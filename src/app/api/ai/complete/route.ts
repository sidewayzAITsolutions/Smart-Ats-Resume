import {
  NextRequest,
  NextResponse,
} from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 500 } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI not configured (missing OPENAI_API_KEY)' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });

    return NextResponse.json({
      completion: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('AI completion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate completion' },
      { status: 500 }
    );
  }
}