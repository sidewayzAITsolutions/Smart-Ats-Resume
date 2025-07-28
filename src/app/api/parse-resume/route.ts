import { Buffer } from 'buffer'; // CRITICAL FIX: Import Buffer
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// Dynamically import libraries for parsing different file types
// This helps in reducing the initial bundle size for serverless functions
const loadLibraries = async () => {
  const [pdfParse, mammoth, natural, compromise] = await Promise.all([
    import('pdf-parse').catch(() => null), // Catch import errors gracefully
    import('mammoth').catch(() => null),
    import('natural').catch(() => null),
    import('compromise').catch(() => null),
  ]);
  return { pdfParse, mammoth, natural, compromise };
};

// Helper to parse PDF content
const parseEnhancedPDF = async (buffer: Buffer, pdfParse: any) => {
  if (!pdfParse) {
    console.error("PDF parsing library not loaded.");
    return null;
  }
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return null;
  }
};

// Helper to parse DOCX content
const parseEnhancedDocument = async (buffer: Buffer, mammoth: any) => {
  if (!mammoth) {
    console.error("DOCX parsing library not loaded.");
    return null;
  }
  try {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer.buffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
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
  text = text.replace(/\\cell|\\row|\\trowd|\\trgaph|\\trleft|\\trbrdrb|\\trbrdrl|\\trbrdrr|\\trbrdrt|\\clbrdrb|\\clbrdrl|\\clbrdrr|\\clbrdrt/g, ''); // Remove table formatting
  return text.trim();
};

export async function POST(req: NextRequest) {
  const { supabase } = createClientFromRequest(req);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = file.type;

    let parsedText: string | null = null;
    const { pdfParse, mammoth } = await loadLibraries();

    switch (fileType) {
      case 'application/pdf':
        parsedText = await parseEnhancedPDF(buffer, pdfParse);
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // .docx
        parsedText = await parseEnhancedDocument(buffer, mammoth);
        break;
      case 'application/rtf':
        parsedText = parseRTF(buffer);
        break;
      case 'text/plain':
        parsedText = buffer.toString('utf8');
        break;
      default:
        return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (!parsedText) {
      return NextResponse.json({ error: 'Failed to parse resume content' }, { status: 500 });
    }

    // You might want to save the parsed text or further process it here
    // For now, just return the parsed text
    return NextResponse.json({ success: true, parsedText });

  } catch (error) {
    console.error('Error in resume parsing API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
