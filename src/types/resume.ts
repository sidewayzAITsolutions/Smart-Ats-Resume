import { ReactNode } from 'react';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  keywords: string[];
}

export interface Education {
  graduationDate: ReactNode;
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'certification';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  keywords: string[];
}

export interface Resume {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  atsScore: number;
  keywords: string[];
  templateId?: string;
  jobDescription?: string;
  targetIndustry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  skills: number;
  experience: number;
  suggestions: string[];
}


// Lightweight UI state for the builder (persisted locally)
export interface ResumeData {
  personalInfo?: Partial<PersonalInfo>;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: any[];
  projects?: any[];
  certifications?: any[];
  customSections?: any[];
  templateId?: string;
  // New: global ATS keywords and job description for the builder UI
  keywords?: string[];
  jobDescription?: string;
}
