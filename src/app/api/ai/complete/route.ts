import {
  NextRequest,
  NextResponse,
} from 'next/server';
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

    const { prompt, model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 500 } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
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
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: Math.max(0, Math.min(2, temperature)), // Clamp between 0 and 2
      max_tokens: Math.max(1, Math.min(4000, maxTokens)), // Clamp between 1 and 4000
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      console.error('No content received from OpenAI');
      return NextResponse.json(
        { error: 'AI service returned empty response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      completion: content
    });
  } catch (error: any) {
    console.error('AI completion error:', error);
    
    // Provide more specific error messages
    if (error?.status === 401 || error?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please contact support.' },
        { status: 503 }
      );
    }
    
    if (error?.status === 429 || error?.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'AI service rate limit reached. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to generate completion. Please try again.' },
      { status: 500 }
    );
  }
}