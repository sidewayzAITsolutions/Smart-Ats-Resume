import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface BulletPointRequest {
  jobTitle: string;
  jobDescription: string;
  roleHistory: {
    title: string;
    company: string;
    duration?: string;
    responsibilities?: string[];
  }[];
}

interface BulletPointResponse {
  bulletPoints: string[];
  jobTitle: string;
  tailoredFor: string;
}

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

    // Parse and validate request body
    const body = await req.json();
    const { jobTitle, jobDescription, roleHistory } = body as BulletPointRequest;

    // Validate required fields
    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job description is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!roleHistory || !Array.isArray(roleHistory) || roleHistory.length === 0) {
      return NextResponse.json(
        { error: 'Role history is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Format role history for the prompt
    const formattedRoleHistory = roleHistory
      .map((role, index) => {
        let roleText = `${index + 1}. ${role.title} at ${role.company}`;
        if (role.duration) {
          roleText += ` (${role.duration})`;
        }
        if (role.responsibilities && role.responsibilities.length > 0) {
          roleText += `\n   Responsibilities: ${role.responsibilities.join('; ')}`;
        }
        return roleText;
      })
      .join('\n');

    // Construct the AI prompt
    const prompt = `You are an expert resume writer specializing in ATS-optimized, professional resume content. Generate exactly 5 compelling, metric-driven bullet points for a resume based on the following information.

TARGET JOB TITLE: ${jobTitle.trim()}

TARGET JOB DESCRIPTION:
${jobDescription.trim()}

CANDIDATE'S ROLE/COMPANY HISTORY:
${formattedRoleHistory}

REQUIREMENTS FOR EACH BULLET POINT:
1. Start with a strong action verb (Led, Developed, Implemented, Optimized, Spearheaded, Architected, Delivered, Executed, etc.)
2. Include quantifiable metrics where possible (percentages, dollar amounts, time saved, team size, etc.)
3. Align with keywords and requirements from the job description
4. Be specific and demonstrate impact/results
5. Be concise (1-2 lines maximum)
6. Use ATS-friendly formatting (no special characters)

FORMAT: Return ONLY a JSON array of exactly 5 bullet point strings. No additional text, explanation, or markdown formatting.

Example format:
["Bullet point 1", "Bullet point 2", "Bullet point 3", "Bullet point 4", "Bullet point 5"]`;

    // Call OpenAI API
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. You ONLY respond with valid JSON arrays containing bullet point strings. Never include any other text or formatting.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.error('No content received from OpenAI');
      return NextResponse.json(
        { error: 'AI service returned empty response. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let bulletPoints: string[];
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();

      bulletPoints = JSON.parse(cleanedContent);

      if (!Array.isArray(bulletPoints)) {
        throw new Error('Response is not an array');
      }

      // Validate each bullet point is a string
      bulletPoints = bulletPoints.filter(
        (bp): bp is string => typeof bp === 'string' && bp.trim().length > 0
      );

      if (bulletPoints.length === 0) {
        throw new Error('No valid bullet points in response');
      }

      // Ensure we have at least 4 bullet points, max 5
      if (bulletPoints.length < 4) {
        console.warn('AI returned fewer than 4 bullet points');
      }
      bulletPoints = bulletPoints.slice(0, 5);

    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      return NextResponse.json(
        { error: 'Failed to generate bullet points. Please try again.' },
        { status: 500 }
      );
    }

    // Return the response
    const response: BulletPointResponse = {
      bulletPoints,
      jobTitle: jobTitle.trim(),
      tailoredFor: roleHistory[0]?.title || 'your role'
    };

    return NextResponse.json(response);

  } catch (error: unknown) {
    console.error('Bullet point generation error:', error);

    // Handle specific error types
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message?: string };
      
      if (apiError.status === 401) {
        return NextResponse.json(
          { error: 'AI service authentication failed. Please contact support.' },
          { status: 503 }
        );
      }

      if (apiError.status === 429) {
        return NextResponse.json(
          { error: 'AI service rate limit reached. Please try again in a moment.' },
          { status: 429 }
        );
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage || 'Failed to generate bullet points. Please try again.' },
      { status: 500 }
    );
  }
}
