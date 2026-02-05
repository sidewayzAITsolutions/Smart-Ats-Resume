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

function calculateATSScore(resumeText: string): ATSScoreResult {
  // Handle empty or placeholder text (e.g., from image-based PDFs)
  const isPlaceholder = resumeText.includes('[Unable to extract text from resume]');
  if (!resumeText || resumeText.trim().length === 0 || isPlaceholder) {
    return {
      overall: 15,
      breakdown: { keywords: 10, formatting: 20, content: 10, completeness: 20 },
      issues: [
        'We couldn't read any text from your resume file.',
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

  // Score keywords - look for common technical and professional keywords
  const techKeywords = [
    'java', 'python', 'javascript', 'typescript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes',
    'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'mysql', 'linux', 'git', 'agile', 'scrum',
    'angular', 'vue', 'css', 'html', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd'
  ];
  
  const foundKeywords = techKeywords.filter(kw => text.includes(kw)).length;
  keywords = Math.min(100, 40 + foundKeywords * 3);

  // Score formatting - check for common section headers
  const sections = {
    experience: text.includes('experience') || text.includes('work history'),
    education: text.includes('education'),
    skills: text.includes('skills'),
    summary: text.includes('summary') || text.includes('objective'),
    contact: text.includes('email') || text.includes('@'),
  };

  const sectionCount = Object.values(sections).filter(Boolean).length;
  completeness = 40 + sectionCount * 12;
  formatting = 50 + (sectionCount >= 3 ? 25 : sectionCount * 8);

  // Score content - look for action verbs and metrics
  const actionVerbs = [
    'led', 'developed', 'managed', 'created', 'implemented', 'designed', 'optimized', 
    'executed', 'delivered', 'achieved', 'improved', 'increased', 'reduced', 'built',
    'designed', 'architected', 'engineered', 'pioneered', 'spearheaded', 'directed'
  ];
  
  const hasActionVerbs = actionVerbs.some(verb => text.includes(verb));
  const hasNumbers = /\d+%|\d+k|\d+m|\d+\s*(years?|months?)|(\$|\d+)\s*\d+/i.test(text);
  const hasProvenResults = /increased|improved|reduced|saved|earned|generated/i.test(text);
  
  content = 40;
  if (hasActionVerbs) content += 25;
  if (hasNumbers) content += 25;
  if (hasProvenResults) content += 15;

  const overall = Math.round((keywords * 0.4 + formatting * 0.2 + content * 0.25 + completeness * 0.15));

  const issues: string[] = [];
  const suggestions: string[] = [];

  // Generate issues and suggestions based on scores
  if (keywords < 60) {
    issues.push('Missing important technical keywords and industry-specific terms');
    suggestions.push('Research the job description and add relevant keywords like programming languages, tools, or certifications');
  } else if (keywords < 75) {
    suggestions.push('Consider adding more technical keywords to improve matching with job descriptions');
  }

  if (formatting < 70) {
    issues.push('Formatting may not be ATS-friendly');
    suggestions.push('Use standard section headers: "Experience", "Education", "Skills", not custom headers');
  } else if (formatting < 85) {
    suggestions.push('Improve formatting consistency for better ATS parsing');
  }

  if (content < 65) {
    issues.push('Resume lacks quantifiable achievements and strong action verbs');
    suggestions.push('Rewrite bullets with action verbs (Led, Developed, Optimized) and include metrics (30% improvement, $2M saved)');
  } else if (content < 80) {
    suggestions.push('Add more metrics and quantifiable results to strengthen your achievements');
  }

  if (completeness < 75) {
    issues.push('Missing important resume sections');
    suggestions.push('Add all standard sections: Contact Info, Summary/Objective, Experience, Education, and Skills');
  } else if (completeness < 90) {
    suggestions.push('Ensure all required sections are clearly labeled for optimal ATS compatibility');
  }

  // Only add generic success message if no issues
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parsedText, metadata } = body;

    if (!parsedText) {
      return NextResponse.json(
        { error: 'No resume text provided' },
        { status: 400 }
      );
    }

    const score = calculateATSScore(parsedText);

    return NextResponse.json(
      { success: true, score },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error scoring resume:', error);
    return NextResponse.json(
      { error: 'Failed to score resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
