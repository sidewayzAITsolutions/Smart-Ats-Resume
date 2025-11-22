import { Buffer } from 'buffer'; // CRITICAL FIX: Import Buffer
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

// Helper to parse PDF content using pdf-parse
const parseEnhancedPDF = async (buffer: Buffer) => {
  try {
    console.log('📖 Attempting to parse PDF, buffer size:', buffer.length);
    // Use require for CommonJS module in Node.js environment
    const pdfParse = require('pdf-parse');
    console.log('✅ pdf-parse loaded:', typeof pdfParse);
    const data = await pdfParse(buffer);
    console.log('✅ PDF parsed successfully, text length:', data?.text?.length);
    return { text: data?.text || null, error: null };
  } catch (error) {
    console.error('❌ Error parsing PDF:', error);
    return { text: null, error: `Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}` };
  }
};

// Helper to parse DOCX content
const parseEnhancedDocument = async (buffer: Buffer) => {
  try {
    const mammoth = require('mammoth');
    // Ensure we pass just the used slice of the underlying ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const result = await mammoth.extractRawText({ arrayBuffer });
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
  // cspell:disable-next-line
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
        parsedText = await parseEnhancedDocument(buffer);
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
      return NextResponse.json({ success: false, error: parseError || 'Failed to parse resume content', fileType }, { status: 422 });
    }

    // Return parsed text (future enhancement: structure extraction)
    return NextResponse.json({ success: true, parsedText, fileType });

  } catch (error) {
    console.error('Error in resume parsing API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
