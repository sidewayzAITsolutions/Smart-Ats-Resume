import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { createClientFromRequest } = await import('@/lib/supabase/server');
    const { supabase } = createClientFromRequest(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required to use AI features' },
        { status: 401 }
      );
    }

    const { jobTitle } = await req.json();

    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Generate a professional summary for a resume for someone with the job title: "${jobTitle}". 
          
          The summary should be:
          - 2-4 sentences long
          - Highlight key strengths and experience relevant to the role
          - Use professional language
          - Include relevant keywords for ATS optimization
          
          Return only the summary text, no additional formatting.`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const summary = completion.choices[0]?.message?.content;

    if (!summary) {
      console.error('No content received from OpenAI');
      return NextResponse.json(
        { error: 'AI service returned empty response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary: summary.trim()
    });
  } catch (error: any) {
    console.error('AI summary generation error:', error);

    if (error?.status === 401 || error?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please contact support.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}

