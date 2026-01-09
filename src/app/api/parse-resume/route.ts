import { Buffer } from 'buffer'; // CRITICAL FIX: Import Buffer
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

// Helper to parse PDF content using pdfjs-dist (more reliable in serverless)
const parseEnhancedPDF = async (buffer: Buffer) => {
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
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      extractedText += pageText + '\n';
    }

    if (extractedText.trim().length > 10) {
      console.log('✅ pdfjs-dist extraction successful, text length:', extractedText.length);
      return { text: extractedText.trim(), error: null };
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
      return { text: data.text, error: null };
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
      return { text: extractedText, error: null };
    }
  } catch (fallbackError) {
    console.error('❌ Raw buffer extraction failed:', fallbackError instanceof Error ? fallbackError.message : String(fallbackError));
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
    if (fileType === 'application/octet-stream' && fileName) {
      const lower = fileName.toLowerCase();
      if (lower.endsWith('.pdf')) fileType = 'application/pdf';
      // cspell:disable-next-line
      else if (lower.endsWith('.docx')) fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (lower.endsWith('.rtf')) fileType = 'application/rtf';
      else if (lower.endsWith('.txt')) fileType = 'text/plain';
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
      console.error('❌ Parse failed, no usable text extracted');
      return NextResponse.json({ 
        success: false, 
        error: parseError || 'Failed to extract text from the resume. The file may be image-based, corrupted, or password-protected. Try exporting your resume as a text-based PDF or DOCX.', 
        fileType 
      }, { status: 422 });
    }

    console.log('✅ Successfully parsed resume, text length:', parsedText.length);
    // Return parsed text (future enhancement: structure extraction)
    return NextResponse.json({ success: true, parsedText, fileType });

  } catch (error) {
    console.error('Error in resume parsing API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
