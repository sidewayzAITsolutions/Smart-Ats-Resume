import { NextRequest, NextResponse } from 'next/server';import { NextRequest, NextResponse } from 'next/server';



interface ATSScoreResult {interface ATSScoreResult {

  overall: number;  overall: number;

  breakdown: {  breakdown: {

    keywords: number;    keywords: number;

    formatting: number;    formatting: number;

    content: number;    content: number;

    completeness: number;    completeness: number;

  };  };

  issues: string[];  issues: string[];

  suggestions: string[];  suggestions: string[];

  passRate: 'high' | 'medium' | 'low';  passRate: 'high' | 'medium' | 'low';

}}



// ---------------------------------------------------------------------------function calculateATSScore(resumeText: string): ATSScoreResult {

// OpenAI-powered ATS scoring  // Handle empty or placeholder text (e.g., from image-based PDFs)

// ---------------------------------------------------------------------------  const isPlaceholder = resumeText.includes('[Unable to extract text from resume]');

async function scoreWithOpenAI(resumeText: string): Promise<ATSScoreResult | null> {  if (!resumeText || resumeText.trim().length === 0 || isPlaceholder) {

  const apiKey = process.env.OPENAI_API_KEY;    return {

  if (!apiKey) {      overall: 15,

    console.warn('OPENAI_API_KEY not configured — falling back to rule-based scoring');      breakdown: { keywords: 10, formatting: 20, content: 10, completeness: 20 },

    return null;      issues: [

  }        "We couldn't read any text from your resume file.",

        'This usually means the resume is an image-based PDF or a scanned document.',

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the provided resume text and return a JSON object with the following structure:      ],

{      suggestions: [

  "overall": <number 0-100>,        'Export your resume as a text-based PDF (not a scan) so ATS software can read it.',

  "breakdown": {        'Open the original Word file and re-save it as a PDF.',

    "keywords": <number 0-100>,        'If your resume is a graphic design, consider creating a plain-text version for online applications.',

    "formatting": <number 0-100>,      ],

    "content": <number 0-100>,      passRate: 'low',

    "completeness": <number 0-100>    };

  },  }

  "issues": ["issue1", "issue2", ...],

  "suggestions": ["suggestion1", "suggestion2", ...]  const text = resumeText.toLowerCase();

}  let keywords = 50;

  let formatting = 60;

Scoring criteria:  let content = 50;

- keywords: How well does the resume include industry-relevant keywords, technical skills, certifications, and tools?  let completeness = 60;

- formatting: Is the resume ATS-friendly? (standard section headers, no tables/columns/graphics, clean structure)

- content: Quality of bullet points — action verbs, quantifiable achievements, impact statements  // Score keywords - look for common technical and professional keywords

- completeness: Does it have all essential sections? (Contact, Summary, Experience, Education, Skills)  const techKeywords = [

    'java', 'python', 'javascript', 'typescript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes',

Provide 2-5 specific, actionable issues and 2-5 practical suggestions.    'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'mysql', 'linux', 'git', 'agile', 'scrum',

Return ONLY valid JSON, no markdown or explanation.`;    'angular', 'vue', 'css', 'html', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd'

  ];

  try {  

    const response = await fetch('https://api.openai.com/v1/chat/completions', {  const foundKeywords = techKeywords.filter(kw => text.includes(kw)).length;

      method: 'POST',  keywords = Math.min(100, 40 + foundKeywords * 3);

      headers: {

        'Content-Type': 'application/json',  // Score formatting - check for common section headers

        'Authorization': `Bearer ${apiKey}`,  const sections = {

      },    experience: text.includes('experience') || text.includes('work history'),

      body: JSON.stringify({    education: text.includes('education'),

        model: 'gpt-4o-mini',    skills: text.includes('skills'),

        messages: [    summary: text.includes('summary') || text.includes('objective'),

          { role: 'system', content: systemPrompt },    contact: text.includes('email') || text.includes('@'),

          { role: 'user', content: `Analyze this resume:\n\n${resumeText.slice(0, 12000)}` },  };

        ],

        temperature: 0.3,  const sectionCount = Object.values(sections).filter(Boolean).length;

        max_tokens: 1000,  completeness = 40 + sectionCount * 12;

      }),  formatting = 50 + (sectionCount >= 3 ? 25 : sectionCount * 8);

    });

  // Score content - look for action verbs and metrics

    if (!response.ok) {  const actionVerbs = [

      const errorBody = await response.text();    'led', 'developed', 'managed', 'created', 'implemented', 'designed', 'optimized', 

      console.error('OpenAI API error:', response.status, errorBody);    'executed', 'delivered', 'achieved', 'improved', 'increased', 'reduced', 'built',

      return null;    'designed', 'architected', 'engineered', 'pioneered', 'spearheaded', 'directed'

    }  ];

  

    const data = await response.json();  const hasActionVerbs = actionVerbs.some(verb => text.includes(verb));

    const content = data.choices?.[0]?.message?.content;  const hasNumbers = /\d+%|\d+k|\d+m|\d+\s*(years?|months?)|(\$|\d+)\s*\d+/i.test(text);

  const hasProvenResults = /increased|improved|reduced|saved|earned|generated/i.test(text);

    if (!content) {  

      console.error('OpenAI returned empty content');  content = 40;

      return null;  if (hasActionVerbs) content += 25;

    }  if (hasNumbers) content += 25;

  if (hasProvenResults) content += 15;

    // Parse the JSON response (strip markdown code fences if present)

    const jsonString = content.replace(/```json\n?|\n?```/g, '').trim();  const overall = Math.round((keywords * 0.4 + formatting * 0.2 + content * 0.25 + completeness * 0.15));

    const parsed = JSON.parse(jsonString);

  const issues: string[] = [];

    // Validate structure  const suggestions: string[] = [];

    if (

      typeof parsed.overall !== 'number' ||  // Generate issues and suggestions based on scores

      typeof parsed.breakdown?.keywords !== 'number' ||  if (keywords < 60) {

      !Array.isArray(parsed.issues) ||    issues.push('Missing important technical keywords and industry-specific terms');

      !Array.isArray(parsed.suggestions)    suggestions.push('Research the job description and add relevant keywords like programming languages, tools, or certifications');

    ) {  } else if (keywords < 75) {

      console.error('OpenAI response missing required fields:', parsed);    suggestions.push('Consider adding more technical keywords to improve matching with job descriptions');

      return null;  }

    }

  if (formatting < 70) {

    const passRate: 'high' | 'medium' | 'low' =    issues.push('Formatting may not be ATS-friendly');

      parsed.overall >= 85 ? 'high' : parsed.overall >= 70 ? 'medium' : 'low';    suggestions.push('Use standard section headers: "Experience", "Education", "Skills", not custom headers');

  } else if (formatting < 85) {

    return {    suggestions.push('Improve formatting consistency for better ATS parsing');

      overall: Math.min(100, Math.max(0, parsed.overall)),  }

      breakdown: {

        keywords: Math.min(100, Math.max(0, parsed.breakdown.keywords)),  if (content < 65) {

        formatting: Math.min(100, Math.max(0, parsed.breakdown.formatting)),    issues.push('Resume lacks quantifiable achievements and strong action verbs');

        content: Math.min(100, Math.max(0, parsed.breakdown.content)),    suggestions.push('Rewrite bullets with action verbs (Led, Developed, Optimized) and include metrics (30% improvement, $2M saved)');

        completeness: Math.min(100, Math.max(0, parsed.breakdown.completeness)),  } else if (content < 80) {

      },    suggestions.push('Add more metrics and quantifiable results to strengthen your achievements');

      issues: parsed.issues.slice(0, 5),  }

      suggestions: parsed.suggestions.slice(0, 5),

      passRate,  if (completeness < 75) {

    };    issues.push('Missing important resume sections');

  } catch (error) {    suggestions.push('Add all standard sections: Contact Info, Summary/Objective, Experience, Education, and Skills');

    console.error('OpenAI scoring failed:', error);  } else if (completeness < 90) {

    return null;    suggestions.push('Ensure all required sections are clearly labeled for optimal ATS compatibility');

  }  }

}

  // Only add generic success message if no issues

// ---------------------------------------------------------------------------  if (issues.length === 0) {

// Rule-based fallback scoring (no API needed)    issues.push('✓ Resume structure looks good');

// ---------------------------------------------------------------------------  }

function calculateATSScore(resumeText: string): ATSScoreResult {

  // Handle empty or placeholder text (e.g., from image-based PDFs)  if (suggestions.length === 0) {

  const isPlaceholder = resumeText.includes('[Unable to extract text from resume]');    suggestions.push('✓ Your resume is well-optimized for ATS systems');

  if (!resumeText || resumeText.trim().length === 0 || isPlaceholder) {  }

    return {

      overall: 15,  return {

      breakdown: { keywords: 10, formatting: 20, content: 10, completeness: 20 },    overall: Math.min(100, overall),

      issues: [    breakdown: {

        "We couldn't read any text from your resume file.",      keywords: Math.min(100, keywords),

        'This usually means the resume is an image-based PDF or a scanned document.',      formatting: Math.min(100, formatting),

      ],      content: Math.min(100, content),

      suggestions: [      completeness: Math.min(100, completeness),

        'Export your resume as a text-based PDF (not a scan) so ATS software can read it.',    },

        'Open the original Word file and re-save it as a PDF.',    issues,

        'If your resume is a graphic design, consider creating a plain-text version for online applications.',    suggestions,

      ],    passRate: overall >= 85 ? 'high' : overall >= 70 ? 'medium' : 'low',

      passRate: 'low',  };

    };}

  }

export async function POST(request: NextRequest) {

  const text = resumeText.toLowerCase();  try {

  let keywords = 50;    const body = await request.json();

  let formatting = 60;    const { parsedText, metadata } = body;

  let content = 50;

  let completeness = 60;    if (!parsedText) {

      return NextResponse.json(

  // Score keywords - look for common technical and professional keywords        { error: 'No resume text provided' },

  const techKeywords = [        { status: 400 }

    'java', 'python', 'javascript', 'typescript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes',      );

    'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'mysql', 'linux', 'git', 'agile', 'scrum',    }

    'angular', 'vue', 'css', 'html', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd',

    'excel', 'powerpoint', 'salesforce', 'tableau', 'jira', 'confluence', 'slack', 'figma',    const score = calculateATSScore(parsedText);

    'marketing', 'sales', 'management', 'leadership', 'communication', 'project management',

  ];    return NextResponse.json(

      { success: true, score },

  const foundKeywords = techKeywords.filter((kw) => text.includes(kw)).length;      { status: 200 }

  keywords = Math.min(100, 40 + foundKeywords * 3);    );

  } catch (error) {

  // Score formatting - check for common section headers    console.error('Error scoring resume:', error);

  const sections = {    return NextResponse.json(

    experience: text.includes('experience') || text.includes('work history'),      { error: 'Failed to score resume', details: error instanceof Error ? error.message : 'Unknown error' },

    education: text.includes('education'),      { status: 500 }

    skills: text.includes('skills'),    );

    summary: text.includes('summary') || text.includes('objective') || text.includes('profile'),  }

    contact: text.includes('email') || text.includes('@') || text.includes('phone'),}

  };

  const sectionCount = Object.values(sections).filter(Boolean).length;
  completeness = 40 + sectionCount * 12;
  formatting = 50 + (sectionCount >= 3 ? 25 : sectionCount * 8);

  // Score content - look for action verbs and metrics
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

  // Generate issues and suggestions based on scores
  if (keywords < 60) {
    issues.push('Missing important technical keywords and industry-specific terms');
    suggestions.push('Add relevant keywords from job descriptions: programming languages, tools, certifications');
  } else if (keywords < 75) {
    suggestions.push('Consider adding more industry keywords to improve ATS matching');
  }

  if (formatting < 70) {
    issues.push('Formatting may not be ATS-friendly');
    suggestions.push('Use standard section headers: "Experience", "Education", "Skills"');
  } else if (formatting < 85) {
    suggestions.push('Improve formatting consistency for better ATS parsing');
  }

  if (content < 65) {
    issues.push('Resume lacks quantifiable achievements and strong action verbs');
    suggestions.push('Rewrite bullets with action verbs and metrics (e.g., "Increased sales 30%")');
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
    issues.push('✓ Resume structure looks good');
  }
  if (suggestions.length === 0) {
    suggestions.push('✓ Your resume is well-optimized for ATS systems');
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
