import { Buffer } from 'buffer'; // CRITICAL FIX: Import Buffer
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

const cleanupExtractedText = (text: string) =>
  text
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([.,:;!?])([A-Za-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Fix PDF extraction artifact: single uppercase letter separated from rest of word.
    // e.g., "D eveloped" → "Developed", "S hirley" → "Shirley".
    // Excludes "I" (common pronoun) to avoid merging "I was", "I have", etc.
    .replace(/\b([A-HJ-Z]) ([a-z]{2,})/g, '$1$2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .trim();

const hasBadSpacing = (text: string) => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return true;

  // If we barely have any actual spaces/newlines, pdf text extraction likely failed.
  const spaceCount = (normalized.match(/\s/g) || []).length;
  if (normalized.length > 120 && spaceCount < Math.floor(normalized.length / 40)) return true;

  const words = normalized.split(' ').filter(Boolean);
  if (!words.length) return true;

  const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const longRatio = words.filter((w) => w.length > 18).length / words.length;

  // Detect lots of mid-word camelCase boundaries, common in concatenated PDFs:
  // e.g. "WilliamB.Shirley" or "endedUpBeing".
  const camelBoundaries = (normalized.match(/[a-z][A-Z]/g) || []).length;
  const camelBoundaryDensity = camelBoundaries / Math.max(1, normalized.length);

  // Detect very long runs of letters with no separators.
  const veryLongAlphaTokens = words.filter((w) => /^[A-Za-z]{24,}$/.test(w)).length;
  const veryLongAlphaRatio = veryLongAlphaTokens / words.length;

  return (
    avgWordLen > 12 ||
    longRatio > 0.22 ||
    camelBoundaryDensity > 0.012 ||
    veryLongAlphaRatio > 0.08
  );
};

const performOcrOnPdf = async (buffer: Buffer) => {
  if (process.env.ENABLE_OCR === 'false') {
    return { text: null, error: 'OCR disabled by ENABLE_OCR=false' };
  }

  console.log('🔄 Attempting OCR fallback...');
  let worker: any;
  try {
  const pdfjsLib = await import('pdfjs-dist');
  // Load native canvas and tesseract at runtime to avoid bundler issues
  const runtimeRequire = (0, eval)('require') as (id: string) => any;
  const { createCanvas } = runtimeRequire('@napi-rs/canvas');
  const { createWorker } = runtimeRequire('tesseract.js');

    if (typeof pdfjsLib.GlobalWorkerOptions !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    }

    const pdfData = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data: pdfData,
      useSystemFonts: true,
      disableFontFace: true,
    });
    const pdf = await loadingTask.promise;

    worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    let ocrText = '';
    const ocrMaxPages = Math.max(1, Number(process.env.OCR_MAX_PAGES ?? '2') || 2);
    const maxPages = Math.min(ocrMaxPages, pdf.numPages);
    const ocrScale = Math.max(1, Number(process.env.OCR_SCALE ?? '2') || 2);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: ocrScale });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');

  await page.render({ canvasContext: context as any, viewport } as any).promise;
      const png = canvas.toBuffer('image/png');
      const { data } = await worker.recognize(png);
      if (data?.text) ocrText += data.text + '\n\n';
    }

    ocrText = cleanupExtractedText(ocrText);
    if (ocrText.length > 20) {
      console.log('✅ OCR extraction successful, text length:', ocrText.length);
      return { text: ocrText, error: null };
    }
  } catch (error) {
    console.error('❌ OCR fallback failed:', error instanceof Error ? error.message : String(error));
  } finally {
    if (worker?.terminate) {
      await worker.terminate();
    }
  }

  return { text: null, error: 'OCR failed or produced no text.' };
};

// Helper to parse PDF content using pdfjs-dist (more reliable in serverless)
const parseEnhancedPDF = async (buffer: Buffer) => {
  // OCR-first (user request): gives consistent spacing & avoids broken PDF text extraction.
  // If OCR is disabled or fails, fall back to text extraction methods.
  const ocrFirst = process.env.PDF_OCR_FIRST !== 'false';
  if (ocrFirst) {
    const ocrResult = await performOcrOnPdf(buffer);
    if (ocrResult.text) {
      return ocrResult;
    }
    console.warn('⚠️ OCR-first produced no text; attempting text-based PDF extraction fallbacks...');
  }

  // Track best available text even if quality checks (hasBadSpacing) reject it.
  // On serverless platforms like Vercel, OCR fallback isn't available, so returning
  // imperfect text is far better than returning nothing.
  let bestEffortText: string | null = null;

  // Primary method: pdfjs-dist (works better in serverless environments)
  console.log('📖 Attempting to parse PDF with pdfjs-dist, buffer size:', buffer.length);
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Disable worker to avoid issues in serverless environment
    if (typeof pdfjsLib.GlobalWorkerOptions !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    }
    
    const pdfData = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ 
      data: pdfData,
      useSystemFonts: true,
      disableFontFace: true,
    });
    const pdf = await loadingTask.promise;

    let extractedText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent({
        normalizeWhitespace: true,
        disableCombineTextItems: false,
      } as any);

      const items = (textContent.items as any[])
        .filter((it) => it?.str)
        .map((it) => {
          const x = it.transform?.[4] ?? 0;
          const y = it.transform?.[5] ?? 0;
          const width = it.width ?? 0;
          const height = it.height ?? 12;
          return { ...it, x, y, width, height };
        });

      // Sort by reading order (top-to-bottom, left-to-right).
      // Use a line-height-aware threshold so items on the same visual line stay
      // together even when their Y coordinates differ slightly (font metrics,
      // subscripts, multi-column layouts with fractional positioning, etc.).
      items.sort((a, b) => {
        const dy = b.y - a.y;
        const avgHeight = ((a.height || 12) + (b.height || 12)) / 2;
        const lineThreshold = Math.max(3, avgHeight * 0.5);
        if (Math.abs(dy) > lineThreshold) return dy > 0 ? 1 : -1;
        return a.x - b.x;
      });

      let lastX: number | null = null;
      let lastY: number | null = null;
      let lastHeight = 12;
      let lastCharW = 6;
      let pageText = '';

      for (const item of items) {
        const str = String(item.str);
        const x = item.x as number;
        const y = item.y as number;
        const width = item.width as number;
        const height = item.height as number;

        const chars = Math.max(1, str.length);
        const charW = width > 0 ? width / chars : lastCharW;

        if (lastY !== null) {
          const lineBreakThreshold = Math.max(3, Math.max(lastHeight, height) * 0.6);
          if (Math.abs(y - lastY) > lineBreakThreshold) {
            pageText += '\n';
            lastX = null;
          } else if (lastX !== null) {
            const gap = x - lastX;
            const spaceThreshold = Math.max(0.8, Math.min(lastCharW, charW) * 0.35);
            if (gap > spaceThreshold) pageText += ' ';
            // If glyphs appear to move backwards, treat as a new line
            if (gap < -2) {
              pageText += '\n';
              lastX = null;
            }
          }
        }

        pageText += str;
        if (item.hasEOL) pageText += '\n';
        lastX = x + width;
        lastY = y;
        lastHeight = height || lastHeight;
        lastCharW = charW || lastCharW;
      }

      extractedText += pageText + '\n\n';
    }

    extractedText = cleanupExtractedText(extractedText);

    if (extractedText.length > 10 && !hasBadSpacing(extractedText)) {
      console.log('✅ pdfjs-dist extraction successful, text length:', extractedText.length);
      return { text: extractedText, error: null };
    } else if (extractedText.length > 10) {
      bestEffortText = extractedText;
      console.warn('⚠️ pdfjs-dist extracted suspicious text, trying fallback...');
    }
  } catch (pdfJsError) {
    console.error('❌ pdfjs-dist failed:', pdfJsError instanceof Error ? pdfJsError.message : String(pdfJsError));
  }

  // Fallback 1: Try pdf-parse
  console.log('🔄 Attempting fallback with pdf-parse...');
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    if (data?.text && data.text.trim().length > 10) {
      console.log('✅ PDF parsed successfully with pdf-parse, text length:', data.text.length);
      const cleanedText = cleanupExtractedText(data.text);
      if (!hasBadSpacing(cleanedText)) {
        return { text: cleanedText, error: null };
      }
      if (!bestEffortText || cleanedText.length > bestEffortText.length) {
        bestEffortText = cleanedText;
      }
      console.warn('⚠️ pdf-parse extracted suspicious text, trying OCR fallback...');
    }
  } catch (error) {
    console.error('❌ pdf-parse failed:', error instanceof Error ? error.message : String(error));
  }

  // Fallback 2: Try raw text extraction from PDF buffer
  console.log('🔄 Attempting raw buffer text extraction...');
  try {
    const text = buffer.toString('latin1');
    // Extract text between common PDF text markers
    const matches = text.match(/BT\s+(.*?)\s+ET/gs) || [];
    const extractedText = matches
      .map(m => m.replace(/BT|ET|Tj|TJ|\(|\)|<|>|\/F\d+|\/Tf/g, ' '))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (extractedText.length > 20) {
      console.log('✅ Raw buffer extraction successful, text length:', extractedText.length);
      const cleanedText = cleanupExtractedText(extractedText);
      if (!hasBadSpacing(cleanedText)) {
        return { text: cleanedText, error: null };
      }
      if (!bestEffortText || cleanedText.length > bestEffortText.length) {
        bestEffortText = cleanedText;
      }
      console.warn('⚠️ Raw buffer extraction suspicious, trying OCR fallback...');
    }
  } catch (fallbackError) {
    console.error('❌ Raw buffer extraction failed:', fallbackError instanceof Error ? fallbackError.message : String(fallbackError));
  }

  // OCR fallback (if not already tried first)
  if (!ocrFirst) {
    const ocrResult = await performOcrOnPdf(buffer);
    if (ocrResult.text) {
      return ocrResult;
    }
  }

  // Last resort: return best-effort text even with potentially poor spacing.
  // Imperfect text is far better than no text — the client-side parser can still
  // extract useful sections from it.
  if (bestEffortText) {
    console.warn('⚠️ Returning best-effort text (spacing quality uncertain), length:', bestEffortText.length);
    return { text: bestEffortText, error: null };
  }

  return { text: null, error: 'Failed to parse PDF: All parsing methods failed. The PDF may be image-based or corrupted.' };
};

// Helper to parse DOCX content
const parseEnhancedDocument = async (buffer: Buffer) => {
  console.log('📖 Attempting to parse DOCX, buffer size:', buffer.length);
  try {
    // mammoth doesn't have a default export, import the module directly
    const mammoth = await import('mammoth');
    
    // Create a proper ArrayBuffer from the Buffer
    // This is critical - we need to create a new ArrayBuffer, not slice the shared one
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; i++) {
      view[i] = buffer[i];
    }
    
    console.log('📄 Calling mammoth.extractRawText with arrayBuffer size:', arrayBuffer.byteLength);
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.value && result.value.trim().length > 0) {
      console.log('✅ DOCX parsed successfully, text length:', result.value.length);
      return result.value;
    }
    
    // Log any messages from mammoth
    if (result.messages && result.messages.length > 0) {
      console.warn('⚠️ Mammoth messages:', result.messages);
    }
    
    console.warn('⚠️ DOCX parsed but no text extracted');
    return null;
  } catch (error) {
    console.error('❌ Error parsing DOCX:', error instanceof Error ? error.message : String(error));
    console.error('❌ Full error:', error);
    return null;
  }
};

// Basic RTF parsing (can be improved with a dedicated library if needed)
const parseRTF = (buffer: Buffer) => {
  // This is a very basic RTF parser. For robust parsing, consider a dedicated library.
  let text = buffer.toString('utf8');
  // Remove common RTF control words and formatting
  text = text.replace(/\\pard|\\par|\\b|\\b0|\\i|\\i0|\\ul|\\ul0|\\f\d+|\\fs\d+|\\cf\d+|\\highlight\d+|\\ql|\\qr|\\qc|\\qj/g, '');
  text = text.replace(/\{[^}]*\}/g, ''); // Remove RTF groups
  text = text.replace(/\\'[0-9a-fA-F]{2}/g, (match) => String.fromCharCode(parseInt(match.substring(2), 16))); // Convert hex to char
  text = text.replace(/[\r\n]+/g, '\n'); // Normalize newlines
  // cspell:disable-next-line
  text = text.replace(/\\cell|\\row|\\trowd|\\trgaph|\\trleft|\\trbrdrb|\\trbrdrl|\\trbrdrr|\\trbrdrt|\\clbrdrb|\\clbrdrl|\\clbrdrr|\\clbrdrt/g, ''); // Remove table formatting
  return text.trim();
};

export async function POST(req: NextRequest) {
  // Allow both authenticated and guest users to parse resumes
  // Guest users can use the basic parsing feature on the homepage
  // Authenticated users get full functionality
  const { supabase } = createClientFromRequest(req);
  const { data: { user } } = await supabase.auth.getUser();

  // Note: user may be null for guest uploads (homepage feature)
  // We still parse the resume but may limit features for guests later

  try {
    const formData = await req.formData();
    // Support both 'resume' and 'file' field names for backwards compatibility
    const file = (formData.get('resume') || formData.get('file')) as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size - limit to 5MB for resumes (should be plenty)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      console.error('❌ File too large:', file.size, 'bytes');
      return NextResponse.json({ 
        success: false,
        error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please upload a resume under 5MB. If your PDF is large due to images, try compressing it or exporting as a text-based document.`
      }, { status: 413 });
    }

    console.log('📥 Received file:', file.name, 'Type:', file.type, 'Size:', file.size);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let fileType = file.type || 'application/octet-stream';
    const fileName = (file as any).name || '';

    // Fallback type detection by file extension if browser didn't set a useful type
    // Also normalize synonyms (e.g., application/msword) to the canonical type we handle
    const lower = fileName.toLowerCase();
    if (
      fileType === 'application/octet-stream' ||
      fileType === 'application/x-pdf' ||
      fileType === 'binary/octet-stream'
    ) {
      if (lower.endsWith('.pdf')) fileType = 'application/pdf';
      // cspell:disable-next-line
      else if (lower.endsWith('.docx')) fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (lower.endsWith('.doc')) fileType = 'application/msword';
      else if (lower.endsWith('.rtf')) fileType = 'application/rtf';
      else if (lower.endsWith('.txt')) fileType = 'text/plain';
    }

    // Normalize older Word MIME types to the types we explicitly handle
    if (fileType === 'application/msword' && lower.endsWith('.docx')) {
      fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    console.log('📋 Detected file type:', fileType);
    let parsedText: string | null = null;
    let parseError: string | null = null;

    switch (fileType) {
      case 'application/pdf': {
        console.log('🔄 Parsing PDF...');
        const { text, error } = await parseEnhancedPDF(buffer);
        parsedText = text;
        parseError = error;
        break;
      }
      // cspell:disable-next-line
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // .docx
        console.log('🔄 Parsing DOCX...');
        parsedText = await parseEnhancedDocument(buffer);
        if (!parsedText) {
          parseError = 'Failed to extract text from DOCX. The file may be corrupted or password-protected.';
        }
        break;
      case 'application/rtf':
        console.log('🔄 Parsing RTF...');
        parsedText = parseRTF(buffer);
        if (!parsedText || parsedText.length < 10) {
          parseError = 'Failed to extract text from RTF file.';
          parsedText = null;
        }
        break;
      case 'text/plain':
        console.log('🔄 Parsing TXT...');
        parsedText = buffer.toString('utf8');
        break;
      default:
        return NextResponse.json({ 
          error: `Unsupported file type: ${fileType}. Please upload a PDF, DOCX, RTF, or TXT file.` 
        }, { status: 400 });
    }

    if (!parsedText || parsedText.trim().length < 10) {
      // Instead of 422, return minimal placeholder text so scoring can still run
      // (the scorer will give a bad score due to lack of content)
      console.warn('⚠️ Parse returned minimal text; returning placeholder so scoring can proceed');
      const fallbackText = '[Unable to extract text from resume]';
      return NextResponse.json({
        success: true,
        parsedText: fallbackText,
        fileType,
        warning: parseError || 'Could not extract readable text from the file. Score may be inaccurate.',
      });
    }

    console.log('✅ Successfully parsed resume, text length:', parsedText.length);
    // Return parsed text (future enhancement: structure extraction)
    return NextResponse.json({ success: true, parsedText, fileType });

  } catch (error) {
    console.error('Error in resume parsing API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
