// lib/ats-analyzer.ts

export interface MetricInsight {
  /** Short label shown in the UI, e.g. "Keywords" */
  label: string;
  /** What this metric actually measures and why it matters */
  explanation: string;
  /** Concrete gaps we detected for this metric */
  whatsMissing: string[];
  /** Actionable suggestions for how to improve this metric */
  recommendations: string[];
  /** Example resume bullets or phrases that implement the recommendations */
  examples: string[];
}

export interface ATSAnalysis {
  score: number;
  breakdown: {
    keywords: number;
    formatting: number;
    content: number;
    impact: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  risks: string[];
  /** Detailed coaching, organized by metric and consumed by the scorecard UI */
  metricInsights: {
    keywords: MetricInsight;
    formatting: MetricInsight;
    content: MetricInsight;
    impact: MetricInsight;
  };
}

export class ATSAnalyzer {
  private static readonly ROLE_KEYWORDS: Record<string, string[]> = {
    'software engineer': [
      'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
      'api', 'rest', 'graphql', 'database', 'sql', 'nosql', 'mongodb', 'postgresql',
      'microservices', 'ci/cd', 'testing', 'debugging', 'performance', 'scalability'
    ],
    'product manager': [
      'agile', 'scrum', 'roadmap', 'stakeholder', 'analytics', 'strategy',
      'leadership', 'metrics', 'kpi', 'user research', 'jira', 'confluence',
      'product lifecycle', 'go-to-market', 'roi', 'user stories', 'backlog',
      'prioritization', 'cross-functional', 'data-driven', 'customer-centric'
    ],
    'data scientist': [
      'python', 'r', 'machine learning', 'deep learning', 'tensorflow', 'pytorch',
      'scikit-learn', 'pandas', 'numpy', 'sql', 'statistics', 'data analysis',
      'visualization', 'tableau', 'power bi', 'nlp', 'computer vision', 'model',
      'algorithm', 'prediction', 'classification', 'regression', 'neural network'
    ],
    'designer': [
      'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ux', 'ui',
      'prototyping', 'wireframing', 'user research', 'design systems', 'responsive',
      'mobile', 'web', 'accessibility', 'usability', 'interaction', 'visual',
      'typography', 'color theory', 'design thinking', 'user-centered'
    ],
    'marketing': [
      'seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'analytics', 'conversion',
      'roi', 'kpi', 'content marketing', 'social media', 'email marketing', 'crm',
      'salesforce', 'hubspot', 'lead generation', 'funnel', 'campaign', 'strategy',
      'brand', 'engagement', 'metrics', 'a/b testing', 'marketing automation'
    ]
  };

  private static readonly ACTION_VERBS = [
    'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'created',
    'delivered', 'designed', 'developed', 'directed', 'enhanced', 'established',
    'executed', 'generated', 'implemented', 'improved', 'increased', 'initiated',
    'launched', 'led', 'managed', 'optimized', 'organized', 'pioneered',
    'reduced', 'resolved', 'spearheaded', 'streamlined', 'supervised', 'transformed'
  ];

  private static readonly FORMATTING_RULES = {
    hasEmail: { weight: 15, check: (data: any) => data.personal?.email?.includes('@') },
    hasPhone: { weight: 15, check: (data: any) => data.personal?.phone?.length > 5 },
    hasName: { weight: 15, check: (data: any) => data.personal?.fullName?.length > 2 },
    hasSummary: { weight: 20, check: (data: any) => data.summary?.length > 50 },
    hasExperience: { weight: 20, check: (data: any) => data.experience?.[0]?.company },
    hasEducation: { weight: 15, check: (data: any) => data.education?.[0]?.institution }
  };

  static analyze(resumeData: any, targetRole: string = ''): ATSAnalysis {
    const role = targetRole.toLowerCase();
    const keywords = this.ROLE_KEYWORDS[role] || this.ROLE_KEYWORDS['software engineer'];

    // Prefer explicit targetKeywords + builder keywords if present
    const extraKeywords: string[] = [
      ...(resumeData.targetKeywords || []),
      ...(resumeData.keywords || []),
    ];

    // Add custom keywords if provided
    const allKeywords = [...new Set([...keywords, ...extraKeywords])];

    // Convert resume to searchable text
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const words = resumeText.split(/\s+/);

    // Keyword Analysis
    const matchedKeywords = allKeywords.filter((kw) =>
      resumeText.includes(kw.toLowerCase()),
    );
    const missingKeywords = allKeywords.filter((kw) => !matchedKeywords.includes(kw));
    const keywordScore = allKeywords.length > 0
      ? (matchedKeywords.length / allKeywords.length) * 100
      : 0;

    // Formatting Analysis
    let formattingScore = 0;
    Object.values(this.FORMATTING_RULES).forEach((rule) => {
      if (rule.check(resumeData)) {
        formattingScore += rule.weight;
      }
    });

    // Content Analysis
    const wordCount = words.length;
    const optimalWordCount = 500;
    const contentScore = Math.min(100, (wordCount / optimalWordCount) * 100);

    // Impact Analysis
    const actionVerbsUsed = this.ACTION_VERBS.filter((verb) =>
      resumeText.includes(verb.toLowerCase()),
    );
    const hasMetrics = /\d+%|\d+k|\d+m|\$\d+|#\d+/i.test(resumeText);
    const hasBulletPoints = resumeData.experience?.some((exp: any) =>
      exp.description?.includes('•') || exp.description?.includes('-'),
    );

    let impactScore = 0;
    impactScore += actionVerbsUsed.length * 5; // 5 points per action verb
    impactScore += hasMetrics ? 30 : 0;
    impactScore += hasBulletPoints ? 20 : 0;
    impactScore = Math.min(100, impactScore);

    // Calculate total score
    const breakdown = {
      keywords: Math.round(keywordScore),
      formatting: Math.round(formattingScore),
      content: Math.round(contentScore),
      impact: Math.round(impactScore),
    };

    const totalScore = Math.round(
      breakdown.keywords * 0.35 +
        breakdown.formatting * 0.25 +
        breakdown.content * 0.2 +
        breakdown.impact * 0.2,
    );

    // Build metric-level insights for coaching
    const metricInsights = this.buildMetricInsights({
      resumeData,
      breakdown,
      matchedKeywords,
      missingKeywords,
      actionVerbsUsed,
      hasMetrics,
      hasBulletPoints,
    });

    // Generate global suggestions
    const suggestions = this.generateSuggestions(
      resumeData,
      breakdown,
      matchedKeywords,
      actionVerbsUsed,
      hasMetrics,
    );

    // Identify risks
    const risks = this.identifyRisks(resumeData, breakdown);

    return {
      score: totalScore,
      breakdown,
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 10), // Top 10 missing
      suggestions,
      risks,
      metricInsights,
    };
  }

  private static buildMetricInsights(params: {
    resumeData: any;
    breakdown: {
      keywords: number;
      formatting: number;
      content: number;
      impact: number;
    };
    matchedKeywords: string[];
    missingKeywords: string[];
    actionVerbsUsed: string[];
    hasMetrics: boolean;
    hasBulletPoints: boolean;
  }): {
    keywords: MetricInsight;
    formatting: MetricInsight;
    content: MetricInsight;
    impact: MetricInsight;
  } {
    const {
      resumeData,
      breakdown,
      matchedKeywords,
      missingKeywords,
      actionVerbsUsed,
      hasMetrics,
      hasBulletPoints,
    } = params;

    const missingKeywordExamples = missingKeywords.slice(0, 5);

    const keywordsMissingMessages: string[] = [];
    if (breakdown.keywords <= 0) {
      keywordsMissingMessages.push(
        'Your resume is not using any of the target or role-specific keywords. ATS filters are very likely to skip it.',
      );
    } else if (breakdown.keywords < 60) {
      keywordsMissingMessages.push(
        'You are using only a small portion of the important keywords hiring managers and ATS look for.',
      );
    }
    if (missingKeywordExamples.length > 0) {
      keywordsMissingMessages.push(
        `You are missing high-value keywords like: ${missingKeywordExamples.join(', ')}`,
      );
    }

    const keywordsRecommendations: string[] = [];
    if (missingKeywordExamples.length > 0) {
      keywordsRecommendations.push(
        'Add the most relevant missing keywords to your Skills and Work Experience sections where they naturally fit.',
      );
      keywordsRecommendations.push(
        'Mirror language from the job description in your bullet points instead of using only generic terms.',
      );
    } else if (breakdown.keywords < 100) {
      keywordsRecommendations.push(
        'Review the job description again and sprinkle any additional relevant tools, frameworks, or domain terms into your bullets.',
      );
    }

    const keywordsExamples: string[] = [];
    if (missingKeywordExamples.length > 0) {
      const exampleKw = missingKeywordExamples[0];
      keywordsExamples.push(
        `"Implemented ${exampleKw} pipelines to automate data processing, reducing manual effort by 30%."`,
      );
      if (missingKeywordExamples[1]) {
        const kw2 = missingKeywordExamples[1];
        keywordsExamples.push(
          `"Integrated ${kw2} into the existing stack to improve system reliability and monitoring."`,
        );
      }
    }

    const formattingMissingMessages: string[] = [];
    if (breakdown.formatting <= 0) {
      formattingMissingMessages.push(
        'Core sections like contact info, summary, experience, or education are missing or extremely thin.',
      );
    } else if (breakdown.formatting < 60) {
      formattingMissingMessages.push(
        'Some foundational sections are missing or incomplete, which can confuse ATS parsers.',
      );
    }
    if (!resumeData.personal?.email || !resumeData.personal?.phone) {
      formattingMissingMessages.push(
        'Your email and/or phone number are missing from the header. Many recruiters will stop right there.',
      );
    }
    if (!resumeData.summary || resumeData.summary.length < 50) {
      formattingMissingMessages.push(
        'Your professional summary is missing or too short to give context to your experience.',
      );
    }
    if (!resumeData.experience || resumeData.experience.length === 0) {
      formattingMissingMessages.push(
        'Work experience entries are missing, which ATS and recruiters expect even for junior roles.',
      );
    }

    const formattingRecommendations: string[] = [
      'Make sure your resume includes clear sections for Summary, Work Experience, Education, and Skills.',
      'Place contact information (name, email, phone, location, LinkedIn) at the top in plain text.',
    ];
    if (!resumeData.education || resumeData.education.length === 0) {
      formattingRecommendations.push(
        'Add at least one education entry with school, degree, and graduation year or expected graduation.',
      );
    }

    const formattingExamples: string[] = [
      'Add a Summary section: "Senior Software Engineer with 7+ years of experience building scalable web applications and APIs."',
      'Add a clear Work Experience entry with title, company, location, and dates on one line.',
    ];

    const contentMissingMessages: string[] = [];
    if (breakdown.content <= 0 || words.length < 100) {
      contentMissingMessages.push(
        'Your resume is extremely short; ATS systems may treat it as incomplete or junior-level by default.',
      );
    } else if (breakdown.content < 60) {
      contentMissingMessages.push(
        'Your resume has limited detail. A typical mid-level professional resume is 400–700 words.',
      );
    }
    if (resumeData.experience?.some((exp: any) => !exp.description)) {
      contentMissingMessages.push(
        'Some roles are missing bullet points describing your impact and responsibilities.',
      );
    }

    const contentRecommendations: string[] = [
      'Aim for 3–7 bullet points for your most recent roles, focusing on impact and outcomes.',
      'Expand each job description with concrete responsibilities, tools, and results.',
    ];

    const contentExamples: string[] = [
      '"Built and maintained React/TypeScript components used by 50k+ monthly active users."',
      '"Collaborated with designers and PMs to ship features that increased user retention by 15%."',
    ];

    const impactMissingMessages: string[] = [];
    if (!hasMetrics) {
      impactMissingMessages.push(
        'Your bullets do not include numbers (%, $, counts). Metrics make your impact instantly clear to recruiters.',
      );
    }
    if (actionVerbsUsed.length < 3) {
      impactMissingMessages.push(
        'Most bullets start with passive phrasing instead of strong action verbs.',
      );
    }
    if (!hasBulletPoints) {
      impactMissingMessages.push(
        'Experience entries are not formatted as bullet points, which makes them harder to scan.',
      );
    }

    const impactRecommendations: string[] = [
      'Rewrite bullets to start with strong action verbs like "Led", "Built", "Improved", or "Owned".',
      'Add at least one metric to each recent role (%, revenue, time saved, volume handled, etc.).',
      'Break dense paragraphs into separate bullet points so ATS and recruiters can skim quickly.',
    ];

    const impactExamples: string[] = [
      '"Led a team of 4 engineers to deliver a new onboarding flow, increasing activation rate by 18%."',
      '"Improved API response times by 35% by optimizing database queries and caching layers."',
    ];

    return {
      keywords: {
        label: 'Keywords',
        explanation:
          'Measures how well your resume uses the same language as the job description and common role-specific terms that ATS systems scan for.',
        whatsMissing: keywordsMissingMessages,
        recommendations: keywordsRecommendations,
        examples: keywordsExamples,
      },
      formatting: {
        label: 'Formatting & Core Sections',
        explanation:
          'Checks that ATS-critical sections like contact info, summary, experience, and education are present and easy to parse.',
        whatsMissing: formattingMissingMessages,
        recommendations: formattingRecommendations,
        examples: formattingExamples,
      },
      content: {
        label: 'Content Depth',
        explanation:
          'Evaluates whether your resume has enough detail and variety to demonstrate your skills, responsibilities, and career story.',
        whatsMissing: contentMissingMessages,
        recommendations: contentRecommendations,
        examples: contentExamples,
      },
      impact: {
        label: 'Impact & Achievements',
        explanation:
          'Looks for action verbs, metrics, and outcome-focused bullets that show how you made a difference, not just what you were responsible for.',
        whatsMissing: impactMissingMessages,
        recommendations: impactRecommendations,
        examples: impactExamples,
      },
    };
  }

  private static generateSuggestions(
    resumeData: any,
    breakdown: any,
    matchedKeywords: string[],
    actionVerbsUsed: string[],
    hasMetrics: boolean,
  ): string[] {
    const suggestions: string[] = [];

    if (breakdown.keywords < 60) {
      suggestions.push('Add more industry-specific keywords from the job description.');
    }

    if (!hasMetrics) {
      suggestions.push(
        'Include quantifiable achievements (e.g., "increased sales by 40%", "reduced latency by 120ms").',
      );
    }

    if (actionVerbsUsed.length < 5) {
      suggestions.push('Use more action verbs to start your bullet points.');
    }

    if (!resumeData.summary || resumeData.summary.length < 100) {
      suggestions.push('Expand your professional summary to 2–3 specific, outcome-focused sentences.');
    }

    if (resumeData.skills?.length < 8) {
      suggestions.push('Add more relevant technical and soft skills that match the target role.');
    }

    if (!resumeData.personal?.linkedin) {
      suggestions.push('Include your LinkedIn profile URL so recruiters can quickly learn more about you.');
    }

    return suggestions.slice(0, 5); // Top 5 suggestions
  }

  private static identifyRisks(resumeData: any, breakdown: any): string[] {
    const risks: string[] = [];

    if (breakdown.formatting < 50) {
      risks.push('Missing or incomplete core sections (contact, summary, experience, education).');
    }

    if (breakdown.keywords < 40) {
      risks.push('Very low keyword match — ATS filters may never show your resume to a recruiter.');
    }

    if (!resumeData.experience?.[0]?.description) {
      risks.push('Your most recent role does not include any bullet points describing your work.');
    }

    const resumeText = JSON.stringify(resumeData).toLowerCase();
    if (resumeText.includes('responsible for') || resumeText.includes('duties include')) {
      risks.push('Using passive language ("responsible for", "duties include") instead of action verbs.');
    }

    return risks;
  }

  static getKeywordsForRole(role: string): string[] {
    return this.ROLE_KEYWORDS[role.toLowerCase()] || this.ROLE_KEYWORDS['software engineer'];
  }

  static getActionVerbs(): string[] {
    return this.ACTION_VERBS;
  }
}
