import { NextRequest, NextResponse } from 'next/server';

interface ATSScoreResult {
  overall: number;
  breakdown: {
    keywords: number;
    formatting: number;
    content: number;
    completeness: number;
  };
  issues: string[];
  suggestions: string[];
  passRate: 'high' | 'medium' | 'low';
}

// ---------------------------------------------------------------------------
// OpenAI-powered ATS scoring
// ---------------------------------------------------------------------------
async function scoreWithOpenAI(resumeText: string): Promise<ATSScoreResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not configured — falling back to rule-based scoring');
    return null;
  }

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the provided resume text and return a JSON object with the following structure:
{
  "overall": <number 0-100>,
  "breakdown": {
    "keywords": <number 0-100>,
    "formatting": <number 0-100>,
    "content": <number 0-100>,
    "completeness": <number 0-100>
  },
  "issues": ["issue1", "issue2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...]
}

Scoring criteria:
- keywords: How well does the resume include industry-relevant keywords, technical skills, certifications, and tools?
- formatting: Is the resume ATS-friendly? (standard section headers, no tables/columns/graphics, clean structure)
- content: Quality of bullet points — action verbs, quantifiable achievements, impact statements
- completeness: Does it have all essential sections? (Contact, Summary, Experience, Education, Skills)

Provide 2-5 specific, actionable issues and 2-5 practical suggestions.
Return ONLY valid JSON, no markdown or explanation.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this resume:\n\n${resumeText.slice(0, 12000)}` },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error:', response.status, errorBody);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('OpenAI returned empty content');
      return null;
    }

    const jsonString = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    if (
      typeof parsed.overall !== 'number' ||
      typeof parsed.breakdown?.keywords !== 'number' ||
      !Array.isArray(parsed.issues) ||
      !Array.isArray(parsed.suggestions)
    ) {
      console.error('OpenAI response missing required fields:', parsed);
      return null;
    }

    const passRate: 'high' | 'medium' | 'low' =
      parsed.overall >= 85 ? 'high' : parsed.overall >= 70 ? 'medium' : 'low';

    return {
      overall: Math.min(100, Math.max(0, parsed.overall)),
      breakdown: {
        keywords: Math.min(100, Math.max(0, parsed.breakdown.keywords)),
        formatting: Math.min(100, Math.max(0, parsed.breakdown.formatting)),
        content: Math.min(100, Math.max(0, parsed.breakdown.content)),
        completeness: Math.min(100, Math.max(0, parsed.breakdown.completeness)),
      },
      issues: parsed.issues.slice(0, 5),
      suggestions: parsed.suggestions.slice(0, 5),
      passRate,
    };
  } catch (error) {
    console.error('OpenAI scoring failed:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Rule-based fallback scoring (no API needed)
// ---------------------------------------------------------------------------
function calculateATSScore(resumeText: string): ATSScoreResult {
  const isPlaceholder = resumeText.includes('[Unable to extract text from resume]');
  if (!resumeText || resumeText.trim().length === 0 || isPlaceholder) {
    return {
      overall: 15,
      breakdown: { keywords: 10, formatting: 20, content: 10, completeness: 20 },
      issues: [
        "We could not read any text from your resume file.",
        'This usually means the resume is an image-based PDF or a scanned document.',
      ],
      suggestions: [
        'Export your resume as a text-based PDF (not a scan) so ATS software can read it.',
        'Open the original Word file and re-save it as a PDF.',
        'If your resume is a graphic design, consider creating a plain-text version for online applications.',
      ],
      passRate: 'low',
    };
  }

  const text = resumeText.toLowerCase();
  let keywords = 50;
  let formatting = 60;
  let content = 50;
  let completeness = 60;

  const techKeywords = [
    'java', 'python', 'javascript', 'typescript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes',
    'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'mysql', 'linux', 'git', 'agile', 'scrum',
    'angular', 'vue', 'css', 'html', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd',
    'excel', 'powerpoint', 'salesforce', 'tableau', 'jira', 'confluence', 'slack', 'figma',
    'marketing', 'sales', 'management', 'leadership', 'communication', 'project management',
  ];

  const foundKeywords = techKeywords.filter((kw) => text.includes(kw)).length;
  keywords = Math.min(100, 40 + foundKeywords * 3);

  const sections = {
    experience: text.includes('experience') || text.includes('work history'),
    education: text.includes('education'),
    skills: text.includes('skills'),
    summary: text.includes('summary') || text.includes('objective') || text.includes('profile'),
    contact: text.includes('email') || text.includes('@') || text.includes('phone'),
  };

  const sectionCount = Object.values(sections).filter(Boolean).length;
  completeness = 40 + sectionCount * 12;
  formatting = 50 + (sectionCount >= 3 ? 25 : sectionCount * 8);

  const actionVerbs = [
    'led', 'developed', 'managed', 'created', 'implemented', 'designed', 'optimized',
    'executed', 'delivered', 'achieved', 'improved', 'increased', 'reduced', 'built',
    'architected', 'engineered', 'pioneered', 'spearheaded', 'directed', 'coordinated',
    'analyzed', 'launched', 'drove', 'generated', 'negotiated', 'mentored',
  ];

  const hasActionVerbs = actionVerbs.some((verb) => text.includes(verb));
  const hasNumbers = /\d+%|\d+k|\d+m|\d+\s*(years?|months?)|(\$|\d+)\s*\d+/i.test(text);
  const hasProvenResults = /increased|improved|reduced|saved|earned|generated|grew|boosted/i.test(text);

  content = 40;
  if (hasActionVerbs) content += 25;
  if (hasNumbers) content += 25;
  if (hasProvenResults) content += 15;

  const overall = Math.round(keywords * 0.4 + formatting * 0.2 + content * 0.25 + completeness * 0.15);

  const issues: string[] = [];
  const suggestions: string[] = [];

  if (keywords < 60) {
    issues.push('Missing important technical keywords and industry-specific terms');
    suggestions.push('Add relevant keywords from job descriptions: programming languages, tools, certifications');
  } else if (keywords < 75) {
    suggestions.push('Consider adding more industry keywords to improve ATS matching');
  }

  if (formatting < 70) {
    issues.push('Formatting may not be ATS-friendly');
    suggestions.push('Use standard section headers: Experience, Education, Skills');
  } else if (formatting < 85) {
    suggestions.push('Improve formatting consistency for better ATS parsing');
  }

  if (content < 65) {
    issues.push('Resume lacks quantifiable achievements and strong action verbs');
    suggestions.push('Rewrite bullets with action verbs and metrics (e.g., Increased sales 30%)');
  } else if (content < 80) {
    suggestions.push('Add more metrics and quantifiable results to strengthen achievements');
  }

  if (completeness < 75) {
    issues.push('Missing important resume sections');
    suggestions.push('Add all standard sections: Contact, Summary, Experience, Education, Skills');
  } else if (completeness < 90) {
    suggestions.push('Ensure all sections are clearly labeled for optimal ATS compatibility');
  }

  if (issues.length === 0) {
    issues.push('Resume structure looks good');
  }
  if (suggestions.length === 0) {
    suggestions.push('Your resume is well-optimized for ATS systems');
  }

  return {
    overall: Math.min(100, overall),
    breakdown: {
      keywords: Math.min(100, keywords),
      formatting: Math.min(100, formatting),
      content: Math.min(100, content),
      completeness: Math.min(100, completeness),
    },
    issues,
    suggestions,
    passRate: overall >= 85 ? 'high' : overall >= 70 ? 'medium' : 'low',
  };
}

// ---------------------------------------------------------------------------
// API Route Handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parsedText } = body;

    if (!parsedText) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }

    // Try OpenAI first, fall back to rule-based
    let score = await scoreWithOpenAI(parsedText);

    if (!score) {
      console.log('Using rule-based scoring fallback');
      score = calculateATSScore(parsedText);
    }

    return NextResponse.json({ success: true, score }, { status: 200 });
  } catch (error) {
    console.error('Error scoring resume:', error);
    return NextResponse.json(
      { error: 'Failed to score resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
