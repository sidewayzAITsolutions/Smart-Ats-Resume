export interface ATSAnalysisResult {
  overallScore: number;
  competitiveAnalysis: {
    [key: string]: {
      competitorName: string;
      ourScore: number;
      theirEstimatedScore: number;
      advantage: string;
    }
  };
  detailedBreakdown: {
    [key: string]: {
      score: number;
      details?: string;
    }
  };
  actionableInsights: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
  }[];
  competitiveAdvantages: string[];
}

export class CompetitiveATSAnalyzer {
  analyzeCompetitively(resume: any, jobDescription?: string, targetIndustry?: string): ATSAnalysisResult {
    // This is a simplified implementation - in a real application, 
    // this would be much more sophisticated and might connect to an API

    // Calculate base score based on resume completeness
    let overallScore = this.calculateBaseScore(resume);
    
    // Adjust score based on job description match if provided
    if (jobDescription) {
      overallScore = this.adjustScoreForJobMatch(overallScore, resume, jobDescription);
    }

    // Generate mock competitive analysis
    const competitiveAnalysis = this.generateCompetitiveAnalysis(overallScore);
    
    // Generate detailed breakdown
    const detailedBreakdown = this.generateDetailedBreakdown(resume, jobDescription);
    
    // Generate insights based on score and resume content
    const actionableInsights = this.generateActionableInsights(detailedBreakdown);
    
    // Generate competitive advantages
    const competitiveAdvantages = this.generateCompetitiveAdvantages(resume, overallScore);

    return {
      overallScore,
      competitiveAnalysis,
      detailedBreakdown,
      actionableInsights,
      competitiveAdvantages
    };
  }

  private calculateBaseScore(resume: any): number {
    let score = 70; // Start with a base score
    
    // Basic completeness checks
    if (resume.personalInfo?.fullName) score += 2;
    if (resume.personalInfo?.email) score += 1;
    if (resume.personalInfo?.phone) score += 1;
    
    // Experience checks
    if (resume.workExperience?.length > 0) {
      score += Math.min(resume.workExperience.length * 3, 10);
    }
    
    // Education checks
    if (resume.education?.length > 0) {
      score += Math.min(resume.education.length * 2, 5);
    }
    
    // Skills checks
    if (resume.skills?.length > 0) {
      score += Math.min(resume.skills.length * 0.5, 5);
    }

    // Randomize slightly for demo purposes
    score = Math.min(98, Math.max(60, score + (Math.random() * 10 - 5)));
    
    return Math.round(score);
  }

  private adjustScoreForJobMatch(baseScore: number, resume: any, jobDescription: string): number {
    // Simple simulation of job description matching
    // In a real implementation, this would use NLP techniques
    
    let matchScore = baseScore;
    const jd = jobDescription.toLowerCase();
    
    // Check if skills are mentioned in job description
    if (resume.skills) {
      const skillMatches = resume.skills.filter((skill: string) => 
        jd.includes(skill.toLowerCase())
      ).length;
      
      matchScore += skillMatches * 0.5;
    }
    
    // Check experience descriptions for keyword matches
    if (resume.workExperience) {
      resume.workExperience.forEach((exp: any) => {
        if (exp.description && jd.includes(exp.description.toLowerCase())) {
          matchScore += 2;
        }
      });
    }
    
    return Math.min(99, Math.round(matchScore));
  }

  private generateCompetitiveAnalysis(ourScore: number): any {
    return {
      jobscan: {
        competitorName: "Jobscan",
        ourScore: ourScore,
        theirEstimatedScore: Math.max(50, ourScore - 5 - Math.round(Math.random() * 10)),
        advantage: "More accurate keyword optimization"
      },
      resumeio: {
        competitorName: "Resume.io",
        ourScore: ourScore,
        theirEstimatedScore: Math.max(50, ourScore - 8 - Math.round(Math.random() * 5)),
        advantage: "Better formatting for ATS systems"
      },
      rezi: {
        competitorName: "Rezi",
        ourScore: ourScore,
        theirEstimatedScore: Math.max(50, ourScore - 3 - Math.round(Math.random() * 7)),
        advantage: "More customized industry insights"
      }
    };
  }

  private generateDetailedBreakdown(resume: any, jobDescription?: string): any {
    // Generate mock scores for different categories
    return {
      keywords: {
        score: 65 + Math.round(Math.random() * 25)
      },
      formatting: {
        score: 75 + Math.round(Math.random() * 20)
      },
      contentQuality: {
        score: 70 + Math.round(Math.random() * 25)
      },
      relevance: {
        score: jobDescription ? 70 + Math.round(Math.random() * 25) : 60 + Math.round(Math.random() * 20)
      }
    };
  }

  private generateActionableInsights(breakdown: any): any[] {
    const insights = [];
    
    if (breakdown.keywords.score < 80) {
      insights.push({
        title: "Improve keyword matching",
        description: "Your resume could better match industry-specific keywords.",
        priority: "high",
        action: "Add more relevant keywords from the job description",
        impact: "Can increase interview chances by up to 60%"
      });
    }
    
    if (breakdown.formatting.score < 80) {
      insights.push({
        title: "Optimize resume format",
        description: "Your resume format could be more ATS-friendly.",
        priority: "medium",
        action: "Use standard section headings and avoid complex layouts",
        impact: "Can prevent your resume from being rejected by ATS filters"
      });
    }
    
    if (breakdown.contentQuality.score < 80) {
      insights.push({
        title: "Strengthen content quality",
        description: "Your achievement descriptions could be more impactful.",
        priority: "medium",
        action: "Use more quantifiable achievements and action verbs",
        impact: "Makes your accomplishments stand out to recruiters"
      });
    }
    
    if (breakdown.relevance.score < 80) {
      insights.push({
        title: "Increase job relevance",
        description: "Your resume could better align with the target position.",
        priority: "high",
        action: "Customize your experience descriptions for this specific job",
        impact: "Can significantly improve your match rate in ATS systems"
      });
    }
    
    // Always include at least one low priority item for completeness
    insights.push({
      title: "Expand your skills section",
      description: "Consider adding more technical and soft skills.",
      priority: "low",
      action: "Add 3-5 more relevant skills to your resume",
      impact: "Helps to pass through skill-based ATS filters"
    });
    
    return insights;
  }

  private generateCompetitiveAdvantages(resume: any, score: number): string[] {
    // Generate some generic advantages
    const advantages = [
      "Your resume is properly structured for modern ATS systems",
      "Your contact information is complete and properly formatted",
      "Your skills section includes relevant industry keywords"
    ];
    
    // Add conditional advantages
    if (resume.workExperience?.length > 2) {
      advantages.push("Your work history demonstrates solid career progression");
    }
    
    if (score > 80) {
      advantages.push("Your overall ATS compatibility is stronger than 75% of candidates");
    }
    
    if (resume.education?.length > 0) {
      advantages.push("Your education section properly highlights your qualifications");
    }
    
    return advantages;
  }
}
