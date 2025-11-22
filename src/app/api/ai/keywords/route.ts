import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { createClientFromRequest } = await import('@/lib/supabase/server');
    const { supabase } = createClientFromRequest(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required to use AI features' },
        { status: 401 }
      );
    }

    const { jobDescription, targetRole, resumeText, existingKeywords = [] } = await req.json();

    if (!jobDescription && !resumeText && !targetRole) {
      return NextResponse.json(
        { error: 'Provide at least a jobDescription, resumeText, or targetRole' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `You are an ATS optimization assistant. Extract and generate the most important keywords and key phrases that should appear in a resume so it ranks well for this role.

Return a JSON object with this exact shape:
{
  "keywords": string[]
}

Guidelines:
- Focus on skills, tools, technologies, certifications, and core responsibilities.
- Include both single-word and short multi-word phrases.
- Do not include full sentences.
- Avoid duplicates and very generic words like "and", "the", "responsible", etc.
- Use Title Case where appropriate (e.g., "Project Management", "Customer Service").

Context:
Target Role: ${targetRole || 'Not specified'}
Job Description: ${jobDescription || 'Not provided'}
Resume Text: ${resumeText || 'Not provided'}
Existing Keywords: ${(existingKeywords || []).join(', ') || 'None'}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'AI did not return any content' },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content as string);
    } catch (err) {
      console.error('Failed to parse keywords JSON:', err, 'content:', content);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    const rawKeywords: string[] = Array.isArray(parsed.keywords) ? parsed.keywords : [];

    const normalized = rawKeywords
      .map((k) => (typeof k === 'string' ? k.trim() : ''))
      .filter(Boolean)
      .map((k) => k.replace(/\s+/g, ' '));

    const deduped = Array.from(new Set(normalized));

    return NextResponse.json({ keywords: deduped });
  } catch (error: any) {
    console.error('AI keywords error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate keywords' },
      { status: 500 }
    );
  }
}

