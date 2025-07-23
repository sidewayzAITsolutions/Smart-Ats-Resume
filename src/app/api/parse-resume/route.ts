import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import formidable from 'formidable';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ParsedResume {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    github: string;
  };
  summary: string;
  experience: Array<{
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    gpa?: string;
    honors?: string;
  }>;
  skills: string[];
  certifications: string[];
  licenses: string[];
  languages: string[];
}

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Helper function to extract text from DOCX
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

// Helper function to extract email
function extractEmail(text: string): string {
  const emailRegex = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/i;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

// Helper function to extract phone
function extractPhone(text: string): string {
  // Multiple phone patterns
  const phonePatterns = [
    /\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/,
    /(\d{3})[-.\s](\d{3})[-.\s](\d{4})/,
    /\(\d{3}\)\s*\d{3}-\d{4}/,
    /\d{3}\.\d{3}\.\d{4}/,
    /\d{10}/
  ];
  
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  return '';
}

// Helper function to extract LinkedIn URL
function extractLinkedIn(text: string): string {
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;
  const match = text.match(linkedinRegex);
  return match ? match[0] : '';
}

// Helper function to extract GitHub URL
function extractGitHub(text: string): string {
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i;
  const match = text.match(githubRegex);
  return match ? match[0] : '';
}

// Helper function to extract name (usually the first line or largest text)
function extractName(text: string): string {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Common patterns that are NOT names
  const excludePatterns = [
    /^(resume|cv|curriculum vitae)/i,
    /^(page \d|references)/i,
    /@/,  // Email lines
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,  // Phone numbers
  ];
  
  // Look for the first substantial line that's likely a name
  for (const line of lines.slice(0, 10)) {
    const trimmed = line.trim();
    
    // Skip if matches exclude patterns
    if (excludePatterns.some(pattern => pattern.test(trimmed))) continue;
    
    // Skip if too short or too long
    if (trimmed.length < 3 || trimmed.length > 50) continue;
    
    // Skip if contains too many numbers
    if ((trimmed.match(/\d/g) || []).length > 2) continue;
    
    // Check if it looks like a name (2-4 words, mostly letters)
    const words = trimmed.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && /^[A-Za-z\s'-]+$/.test(trimmed)) {
      return trimmed;
    }
  }
  
  return '';
}

// Helper function to extract summary/objective
function extractSummary(text: string): string {
  const summaryPatterns = [
    /(?:professional summary|summary|objective|profile|about me)[\s:]*([^\n]+(?:\n(?![A-Z]{2,})[^\n]+)*)/i,
    /^([A-Z][^.!?]*[.!?](?:\s+[A-Z][^.!?]*[.!?]){1,3})/m
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const summary = match[1].trim();
      if (summary.length > 50 && summary.length < 500) {
        return summary;
      }
    }
  }
  
  return '';
}

// Helper function to extract skills
function extractSkills(text: string): string[] {
  const skills = new Set<string>();
  
  // Common skill keywords
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Angular', 'Vue',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'AWS', 'Azure', 'GCP', 'Docker',
    'Kubernetes', 'Git', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'HTML', 'CSS', 'SASS', 'REST', 'GraphQL', 'Agile', 'Scrum', 'CI/CD', 'DevOps',
    'Machine Learning', 'Data Analysis', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Excel', 'PowerPoint', 'Photoshop', 'Figma', 'Sketch', 'Leadership', 'Communication',
    'Project Management', 'Problem Solving', 'Team Collaboration', 'Time Management'
  ];
  
  // Look for skills section
  const skillsSectionRegex = /(?:skills|technical skills|core competencies|expertise)[\s:]*([^]+?)(?=\n[A-Z]{2,}|\n\n|$)/i;
  const skillsMatch = text.match(skillsSectionRegex);
  
  if (skillsMatch && skillsMatch[1]) {
    const skillsText = skillsMatch[1];
    
    // Extract skills from bullet points or comma-separated lists
    const lines = skillsText.split('\n');
    for (const line of lines) {
      // Remove bullet points and clean
      const cleaned = line.replace(/^[\s•·\-*]+/, '').trim();
      
      // Split by common delimiters
      const items = cleaned.split(/[,;|]/);
      for (const item of items) {
        const skill = item.trim();
        if (skill.length > 2 && skill.length < 50 && !skill.includes(' ')) {
          skills.add(skill);
        }
      }
    }
  }
  
  // Also look for known skills throughout the text
  const textLower = text.toLowerCase();
  for (const keyword of skillKeywords) {
    if (textLower.includes(keyword.toLowerCase())) {
      skills.add(keyword);
    }
  }
  
  return Array.from(skills).slice(0, 20); // Limit to 20 skills
}

// Helper function to extract experience
function extractExperience(text: string): ParsedResume['experience'] {
  const experiences: ParsedResume['experience'] = [];
  
  // Look for experience section
  const expSectionRegex = /(?:experience|employment|work history|professional experience)[\s:]*([^]+?)(?=\n[A-Z]{2,}(?![\w\s,])|education|skills|$)/i;
  const expMatch = text.match(expSectionRegex);
  
  if (!expMatch || !expMatch[1]) return experiences;
  
  const expText = expMatch[1];
  
  // Common job title keywords
  const titleKeywords = ['Manager', 'Developer', 'Engineer', 'Analyst', 'Designer', 'Consultant',
    'Director', 'Specialist', 'Coordinator', 'Administrator', 'Associate', 'Senior', 'Junior',
    'Lead', 'Principal', 'Architect', 'Scientist', 'Researcher', 'Intern'];
  
  // Split into potential job entries
  const lines = expText.split('\n').filter(line => line.trim());
  
  let currentExp: Partial<ParsedResume['experience'][0]> | null = null;
  let achievements: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line might be a job title/company
    const hasTitle = titleKeywords.some(keyword => line.includes(keyword));
    const hasDate = /\d{4}/.test(line);
    
    if ((hasTitle || hasDate) && line.length < 100) {
      // Save previous experience if exists
      if (currentExp && currentExp.position) {
        experiences.push({
          id: Date.now() + experiences.length,
          company: currentExp.company || '',
          position: currentExp.position || '',
          startDate: currentExp.startDate || '',
          endDate: currentExp.endDate || '',
          current: currentExp.endDate?.toLowerCase().includes('present') || false,
          location: currentExp.location || '',
          description: currentExp.description || '',
          achievements: achievements.filter(a => a.trim())
        });
      }
      
      // Start new experience
      currentExp = {};
      achievements = [];
      
      // Extract dates
      const dateMatch = line.match(/(\w+\.?\s*\d{4})\s*[-–]\s*(\w+\.?\s*\d{4}|present|current)/i);
      if (dateMatch) {
        currentExp.startDate = dateMatch[1].trim();
        currentExp.endDate = dateMatch[2].trim();
      }
      
      // Extract position and company
      const cleanedLine = line.replace(/(\w+\.?\s*\d{4})\s*[-–]\s*(\w+\.?\s*\d{4}|present|current)/i, '').trim();
      
      // Check if it's position at company format
      const atMatch = cleanedLine.match(/(.+?)\s+(?:at|@)\s+(.+)/i);
      if (atMatch) {
        currentExp.position = atMatch[1].trim();
        currentExp.company = atMatch[2].trim();
      } else if (hasTitle) {
        currentExp.position = cleanedLine;
        // Look for company in next line
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (!titleKeywords.some(k => nextLine.includes(k)) && nextLine.length < 50) {
            currentExp.company = nextLine;
            i++; // Skip next line
          }
        }
      } else {
        currentExp.company = cleanedLine;
      }
    } else if (currentExp && line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // This is likely an achievement
      achievements.push(line.replace(/^[•\-*]\s*/, '').trim());
    } else if (currentExp && !currentExp.description && line.length > 50) {
      // This might be a description
      currentExp.description = line;
    }
  }
  
  // Don't forget the last experience
  if (currentExp && currentExp.position) {
    experiences.push({
      id: Date.now() + experiences.length,
      company: currentExp.company || '',
      position: currentExp.position || '',
      startDate: currentExp.startDate || '',
      endDate: currentExp.endDate || '',
      current: currentExp.endDate?.toLowerCase().includes('present') || false,
      location: currentExp.location || '',
      description: currentExp.description || '',
      achievements: achievements.filter(a => a.trim())
    });
  }
  
  return experiences.slice(0, 5); // Limit to 5 experiences
}

// Helper function to extract education
function extractEducation(text: string): ParsedResume['education'] {
  const education: ParsedResume['education'] = [];
  
  // Look for education section
  const eduSectionRegex = /(?:education|academic|qualifications)[\s:]*([^]+?)(?=\n[A-Z]{2,}|experience|skills|$)/i;
  const eduMatch = text.match(eduSectionRegex);
  
  if (!eduMatch || !eduMatch[1]) return education;
  
  const eduText = eduMatch[1];
  
  // Common degree patterns
  const degreePatterns = [
    /(?:Bachelor|B\.?S\.?|B\.?A\.?|Master|M\.?S\.?|M\.?A\.?|M\.?B\.?A|Ph\.?D\.?|Doctor|Associate)/i
  ];
  
  const lines = eduText.split('\n').filter(line => line.trim());
  
  let currentEdu: Partial<ParsedResume['education'][0]> | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if this line contains a degree
    const hasDegree = degreePatterns.some(pattern => pattern.test(trimmed));
    
    if (hasDegree || /university|college|institute|school/i.test(trimmed)) {
      // Save previous education if exists
      if (currentEdu && (currentEdu.school || currentEdu.degree)) {
        education.push({
          id: Date.now() + education.length,
          school: currentEdu.school || '',
          degree: currentEdu.degree || '',
          field: currentEdu.field || '',
          startYear: currentEdu.startYear || '',
          endYear: currentEdu.endYear || '',
          gpa: currentEdu.gpa,
          honors: currentEdu.honors
        });
      }
      
      // Start new education entry
      currentEdu = {};
      
      // Extract year
      const yearMatch = trimmed.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        currentEdu.endYear = yearMatch[0];
      }
      
      // Extract GPA
      const gpaMatch = trimmed.match(/(?:GPA|Grade|Score)[\s:]*(\d+\.?\d*)/i);
      if (gpaMatch) {
        currentEdu.gpa = gpaMatch[1];
      }
      
      // Extract degree and field
      const degreeMatch = trimmed.match(/(Bachelor|B\.?S\.?|B\.?A\.?|Master|M\.?S\.?|M\.?A\.?|M\.?B\.?A|Ph\.?D\.?|Doctor|Associate)(?:'?s)?(?:\s+of\s+)?(\w+)?/i);
      if (degreeMatch) {
        currentEdu.degree = degreeMatch[0].trim();
        if (degreeMatch[2]) {
          currentEdu.field = degreeMatch[2];
        }
      }
      
      // Extract school name
      if (/university|college|institute|school/i.test(trimmed)) {
        const cleanedLine = trimmed.replace(/\b(19|20)\d{2}\b/, '').replace(/(?:GPA|Grade|Score)[\s:]*\d+\.?\d*/i, '').trim();
        currentEdu.school = cleanedLine;
      }
    } else if (currentEdu && /magna cum laude|summa cum laude|cum laude|honors|dean's list/i.test(trimmed)) {
      currentEdu.honors = trimmed;
    }
  }
  
  // Don't forget the last education entry
  if (currentEdu && (currentEdu.school || currentEdu.degree)) {
    education.push({
      id: Date.now() + education.length,
      school: currentEdu.school || '',
      degree: currentEdu.degree || '',
      field: currentEdu.field || '',
      startYear: currentEdu.startYear || '',
      endYear: currentEdu.endYear || '',
      gpa: currentEdu.gpa,
      honors: currentEdu.honors
    });
  }
  
  return education.slice(0, 3); // Limit to 3 education entries
}

// Main parsing function
function parseResumeText(text: string): ParsedResume {
  // Clean the text
  const cleanedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const parsed: ParsedResume = {
    personal: {
      fullName: extractName(cleanedText),
      title: '',
      email: extractEmail(cleanedText),
      phone: extractPhone(cleanedText),
      location: '',
      linkedin: extractLinkedIn(cleanedText),
      portfolio: '',
      github: extractGitHub(cleanedText)
    },
    summary: extractSummary(cleanedText),
    experience: extractExperience(cleanedText),
    education: extractEducation(cleanedText),
    skills: extractSkills(cleanedText),
    certifications: [],
    licenses: [],
    languages: []
  };
  
  return parsed;
}

export async function POST(req: NextRequest) {
  try {
    // Get the form data
    const formData = await req.formData();
    const file = formData.get('resume') as File | undefined; // Ensure file is defined and not null
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let extractedText = '';
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      extractedText = await extractTextFromPDF(buffer);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      extractedText = await extractTextFromDOCX(buffer);
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
    
    if (!extractedText) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 });
    }
    
    // Parse the extracted text
    const parsedData = parseResumeText(extractedText);
    
    // Return the parsed data
    return NextResponse.json({
      success: true,
      data: parsedData,
      extractedText: extractedText.substring(0, 500) // For debugging
    });
    
  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse resume' },
      { status: 500 }
    );
  }
}


