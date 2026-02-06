// src/components/Builder/BuilderLayout.tsx
'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Loader2, X } from 'lucide-react';

import toast from 'react-hot-toast';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';
import CollapsibleATSScore from '@/components/CollapsibleATSScore';
import { createClient } from '@/lib/supabase/client';

import BuilderSidebar from './BuilderSidebar';
import BuilderToolbar from './BuilderToolbar';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';

function buildResumePatchFromParsedText(text: string): Partial<ResumeData> {
  console.log('🔍 Starting resume parsing, text length:', text.length);

  // Normalize whitespace and bullets, preserve hyphenated words
  const normalize = (s: string) =>
    s
      .replace(/\r/g, '')
      .replace(/\u00a0/g, ' ')
      .replace(/^\s*[•\u2022]\s+/gm, '• ') // normalize bullet symbols
      .replace(/^\s*-\s+/gm, '• '); // treat leading hyphen as bullet only when at line start

  // Expanded heading variations for better detection
  const headings = [
    'professional summary',
    'professional profile',
    'profile',
    'summary',
    'objective',
    'about me',
    'experience',
    'work experience',
    'professional experience',
    'employment history',
    'work history',
    'education',
    'academic background',
    'qualifications',
    'skills',
    'technical skills',
    'core competencies',
    'expertise',
    'projects',
    'personal projects',
    'key projects',
    'certifications',
    'certificates',
    'licenses',
    'keywords',
    'key words',
    'ats keywords',
    'job description',
    'target role',
    'portfolio',
    'title',
    'professional title',
  ];
  const normalizedText = normalize(text);
  const lower = normalizedText.toLowerCase();
  const indices: Record<string, number> = {};
  for (const h of headings) {
    const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match heading only at the start of a line (with optional leading whitespace)
    // and followed by a colon, end-of-line, or end-of-string.
    // This prevents matching words like "skills" inside "communication skills"
    // or "experience" inside "5+ years of experience".
    const pattern = new RegExp(`(?:^|\\n)[ \\t]*(${escaped})[ \\t]*(?::|\\n|$)`, 'i');
    const match = pattern.exec(lower);
    if (match) {
      // Position of the captured heading text (group 1) within the full string
      const headingPos = match.index + match[0].indexOf(match[1]);
      if (!indices[h]) indices[h] = headingPos;
    }
  }

  // Remove short headings when a longer variant containing them is also found.
  // e.g., if 'professional experience' is detected, remove 'experience' — its
  // position is likely a false match (the word appearing at a line break inside
  // a different section) and would corrupt the section boundary order.
  for (const short of Object.keys(indices)) {
    const dominated = Object.keys(indices).some(
      long => long !== short && long.length > short.length && long.includes(short)
    );
    if (dominated) delete indices[short];
  }

  const order = Object.entries(indices).sort((a, b) => a[1] - b[1]);
  const slice = (startLabel: string) => {
    const start = indices[startLabel];
    if (start == null) return '';
    const i = order.findIndex(([k]) => k === startLabel);
    const end = i >= 0 && i < order.length - 1 ? order[i + 1][1] : normalizedText.length;
    let content = normalizedText.slice(start + startLabel.length, end).trim();
    // Strip leading colon/separator that may follow the heading (e.g. "Skills: Python")
    content = content.replace(/^[:\-|–—]\s*/, '');
    return content;
  };
  const sectionOr = (...names: string[]) => {
    for (const n of names) {
      const s = slice(n);
      if (s) return s;
    }
    return '';
  };

  // Try longer / more-specific headings first so that short generic words like
  // "experience" or "skills" don't shadow the real multi-word section heading.
  const summaryRaw = sectionOr('professional summary', 'professional profile', 'profile', 'summary', 'objective', 'about me') || normalizedText.split(/\n\n/)[0] || '';
  const skillsRaw = sectionOr('technical skills', 'core competencies', 'expertise', 'skills');
  const projectsRaw = sectionOr('personal projects', 'key projects', 'projects');
  const certsRaw = sectionOr('certifications', 'certificates', 'licenses');
  const expRaw = sectionOr('professional experience', 'work experience', 'employment history', 'work history', 'experience');
  const eduRaw = sectionOr('education', 'academic background', 'qualifications');
  const keywordsRaw = sectionOr('ats keywords', 'key words', 'keywords');
  const jobDescriptionRaw = sectionOr('job description', 'target role');
  const portfolioRaw = sectionOr('portfolio');
  const titleRaw = sectionOr('professional title', 'title');

  const toLines = (s: string) => {
    if (!s) return [] as string[];
    const prepared = normalize(s);
    // Split on newlines, then break out bullet-start segments only (avoid splitting hyphenated words)
    return prepared
      .split(/\n+/)
      .flatMap((line) =>
        line.includes('• ')
          ? line
              .split('• ')
              .map((t) => t.trim())
              .filter(Boolean)
          : [line.trim()],
      )
      .map((t) => t.replace(/^[-•\u2022]\s*/, '').trim())
      .filter(Boolean);
  };

  const skills = toLines(skillsRaw)
    .join(',')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name, i) => ({
      id: `${Date.now()}-sk-${i}`,
      name,
      category: 'technical',
      proficiency: 'beginner',
      keywords: [],
    }));

  // Improved projects parsing - handle multiple formats
  const projects: any[] = [];
  if (projectsRaw) {
    // Try to split by double newlines first (project blocks)
    const projectBlocks = projectsRaw.split(/\n\s*\n/).filter(Boolean);
    
    if (projectBlocks.length > 0) {
      // Multiple project blocks
      projectBlocks.forEach((block, i) => {
        const lines = toLines(block);
        if (lines.length === 0) return;
        
        const firstLine = lines[0];
        let name = firstLine;
        let description = '';
        let technologies: string[] = [];
        
        // Try to extract project name (usually first line, may have colon or dash)
        if (firstLine.includes(':') || firstLine.includes(' - ')) {
          const parts = firstLine.split(/[:–-]/).map(p => p.trim());
          name = parts[0] || firstLine;
          if (parts[1]) description = parts[1];
        }
        
        // Look for description in remaining lines
        const descLines: string[] = [];
        for (let j = 1; j < lines.length; j++) {
          const line = lines[j];
          // Check if line looks like technologies (common tech keywords or short phrases)
          const techKeywords = ['javascript', 'python', 'react', 'node', 'java', 'sql', 'html', 'css', 'typescript', 'angular', 'vue', 'django', 'flask', 'express', 'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes', 'git', 'github'];
          const lowerLine = line.toLowerCase();
          const isTechLine = techKeywords.some(keyword => lowerLine.includes(keyword)) || 
                            (line.length < 50 && /^[a-z\s,]+$/i.test(line));
          
          if (isTechLine && technologies.length === 0) {
            // Extract technologies (comma-separated or space-separated)
            const techs = line.split(/[,;|]/).map(t => t.trim()).filter(Boolean);
            technologies = techs;
          } else {
            descLines.push(line);
          }
        }
        
        if (descLines.length > 0) {
          description = descLines.join(' ').trim();
        }
        
        // Clean up name (remove bullets, dashes at start)
        name = name.replace(/^[•\-\u2022]\s*/, '').trim();
        
        if (name) {
          projects.push({
            id: `${Date.now()}-pr-${i}`,
            name,
            description: description || '',
            technologies: technologies.length > 0 ? technologies : [],
          });
        }
      });
    } else {
      // Single line format - try to parse
      const lines = toLines(projectsRaw);
      lines.forEach((line, i) => {
        if (!line.trim()) return;
        
        let name = line;
        let description = '';
        let technologies: string[] = [];
        
        // Check for colon or dash separator
        if (line.includes(':') || line.includes(' - ')) {
          const parts = line.split(/[:–-]/).map(p => p.trim());
          name = parts[0] || line;
          if (parts[1]) {
            // Check if part after separator looks like tech stack
            const techKeywords = ['javascript', 'python', 'react', 'node', 'java', 'sql'];
            const lowerPart = parts[1].toLowerCase();
            if (techKeywords.some(kw => lowerPart.includes(kw)) && parts[1].length < 100) {
              technologies = parts[1].split(/[,;|]/).map(t => t.trim()).filter(Boolean);
            } else {
              description = parts[1];
            }
          }
        }
        
        // Clean up name
        name = name.replace(/^[•\-\u2022]\s*/, '').trim();
        
        if (name) {
          projects.push({
            id: `${Date.now()}-pr-${i}`,
            name,
            description,
            technologies,
          });
        }
      });
    }
  }

  const certifications = toLines(certsRaw).map((line, i) => ({
    id: `${Date.now()}-ce-${i}`,
    name: line,
    issuer: '',
    date: '',
  }));

  // Split experience text into blocks — first by double newlines, and if that
  // yields too few blocks for the amount of text, also split on lines that
  // contain date ranges (indicating a new job entry boundary).
  const splitExperienceBlocks = (text: string): string[] => {
    const blocks = text.split(/\n\s*\n/).filter(b => b.trim());
    if (blocks.length > 2 || text.length < 300) return blocks;

    // Try smarter splitting: lines with date ranges mark new entries
    const dateRangeRe = /\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)/i;
    const result: string[] = [];
    let current: string[] = [];

    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const isBullet = /^[•\-\u2022]/.test(trimmed);
      if (dateRangeRe.test(trimmed) && !isBullet && current.length > 0) {
        result.push(current.join('\n'));
        current = [trimmed];
      } else {
        current.push(trimmed);
      }
    }
    if (current.length > 0) result.push(current.join('\n'));

    return result.length > blocks.length ? result : blocks;
  };

  // Improved experience parsing - handle multiple formats
  const experience = expRaw
    ? splitExperienceBlocks(expRaw)
        .map((block, i) => {
          const lines = toLines(block);
          if (lines.length === 0) return null;

          let position = '';
          let company = '';
          let startDate = '';
          let endDate = '';
          let current = false;
          const achievements: string[] = [];

          // Try to extract dates from the block (common formats)
          const datePattern = /(\d{1,2}\/\d{4}|\d{4}|[A-Z][a-z]{2,8}\s+\d{4}|[A-Z][a-z]{2,8}\.\s+\d{4})/gi;
          const dateMatches = block.match(datePattern);
          if (dateMatches && dateMatches.length >= 1) {
            startDate = dateMatches[0] || '';
            endDate = dateMatches[1] || '';
            // Check for "Present", "Current", "Now"
            if (/present|current|now/i.test(block)) {
              current = true;
              endDate = 'Present';
            }
          }

          // Parse first few lines for position and company
          const [first, second, ...rest] = lines;

          // Format 1: "Position at Company" or "Position | Company"
          if (first && (first.includes(' at ') || first.includes(' | '))) {
            const separator = first.includes(' at ') ? ' at ' : ' | ';
            [position, company] = first.split(separator).map(s => s.trim());
          }
          // Format 2: "Position" on first line, "Company" on second line
          else if (first && second) {
            // Check if first line looks like a position (contains common job title words)
            const jobTitleWords = ['engineer', 'developer', 'manager', 'analyst', 'designer', 'consultant', 'director', 'specialist', 'coordinator', 'lead', 'senior', 'junior', 'intern', 'associate'];
            const firstLower = first.toLowerCase();
            const isLikelyPosition = jobTitleWords.some(word => firstLower.includes(word)) || first.length < 60;

            if (isLikelyPosition) {
              position = first;
              company = second;
            } else {
              // Assume first is company, second is position
              company = first;
              position = second;
            }
          }
          // Format 3: Single line with position only
          else if (first) {
            position = first;
          }

          // Collect achievements from remaining lines
          // Use a non-global regex to avoid lastIndex state issues with .test() in a loop
          const dateTestPattern = /\d{1,2}\/\d{4}|\d{4}|[A-Z][a-z]{2,8}\s+\d{4}|[A-Z][a-z]{2,8}\.\s+\d{4}/i;
          rest.forEach(line => {
            if (line && line.length > 10 && !dateTestPattern.test(line)) {
              achievements.push(line);
            }
          });

          // Clean up extracted values
          position = position.replace(/^[•\-\u2022]\s*/, '').trim();
          company = company.replace(/^[•\-\u2022]\s*/, '').trim();

          // Remove dates from position/company if they got included
          position = position.replace(datePattern, '').trim();
          company = company.replace(datePattern, '').trim();

          if (!position && !company) return null;

          return {
            id: `${Date.now()}-ex-${i}`,
            company: company || '',
            position: position || '',
            startDate: startDate || '',
            endDate: endDate || '',
            current,
            description: achievements.join(' '),
            achievements,
            keywords: [],
          };
        })
        .filter((e): e is NonNullable<typeof e> => e !== null && (!!e.company || !!e.position))
    : [];

  // Improved education parsing - handle multiple formats
  const education = eduRaw
    ? eduRaw.split(/\n\s*\n/).map((block, i) => {
        const lines = toLines(block);
        if (lines.length === 0) return null;

        let degree = '';
        let field = '';
        let institution = '';
        let graduationDate = '';
        let gpa = '';

        // Extract dates
        const datePattern = /(\d{1,2}\/\d{4}|\d{4}|[A-Z][a-z]{2,8}\s+\d{4})/gi;
        const dateMatches = block.match(datePattern);
        if (dateMatches && dateMatches.length >= 1) {
          graduationDate = dateMatches[dateMatches.length - 1] || ''; // Usually graduation is the last date
        }

        // Extract GPA
        const gpaMatch = block.match(/GPA[:\s]*(\d+\.\d+|\d+\/\d+)/i);
        if (gpaMatch) {
          gpa = gpaMatch[1];
        }

        const [first, second] = lines;

        // Common degree keywords
        const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'associate', 'diploma', 'certificate', 'b.s.', 'b.a.', 'm.s.', 'm.a.', 'mba', 'ph.d.'];

        // Format 1: "Degree in Field - Institution" or "Degree in Field | Institution"
        if (first && (first.includes(' - ') || first.includes(' | '))) {
          const separator = first.includes(' - ') ? ' - ' : ' | ';
          const [left, right] = first.split(separator).map(s => s.trim());

          // Check which side has the degree
          const leftLower = left.toLowerCase();
          const rightLower = right.toLowerCase();
          const leftHasDegree = degreeKeywords.some(kw => leftLower.includes(kw));
          const rightHasDegree = degreeKeywords.some(kw => rightLower.includes(kw));

          if (leftHasDegree) {
            institution = right;
            if (left.includes(' in ')) {
              const [d, f] = left.split(' in ').map(s => s.trim());
              degree = d;
              field = f;
            } else {
              degree = left;
            }
          } else if (rightHasDegree) {
            institution = left;
            if (right.includes(' in ')) {
              const [d, f] = right.split(' in ').map(s => s.trim());
              degree = d;
              field = f;
            } else {
              degree = right;
            }
          } else {
            // Assume left is degree, right is institution
            institution = right;
            degree = left;
          }
        }
        // Format 2: Institution on first line, degree on second
        else if (first && second) {
          const firstLower = first.toLowerCase();
          const secondLower = second.toLowerCase();
          const firstHasDegree = degreeKeywords.some(kw => firstLower.includes(kw));
          const secondHasDegree = degreeKeywords.some(kw => secondLower.includes(kw));

          if (firstHasDegree) {
            degree = first;
            institution = second;
          } else if (secondHasDegree) {
            institution = first;
            degree = second;
          } else {
            // Assume first is institution (usually universities are listed first)
            institution = first;
            degree = second;
          }

          // Extract field from degree if present
          if (degree.includes(' in ')) {
            const [d, f] = degree.split(' in ').map(s => s.trim());
            degree = d;
            field = f;
          }
        }
        // Format 3: Single line
        else if (first) {
          const firstLower = first.toLowerCase();
          const hasDegree = degreeKeywords.some(kw => firstLower.includes(kw));

          if (hasDegree) {
            degree = first;
            if (degree.includes(' in ')) {
              const [d, f] = degree.split(' in ').map(s => s.trim());
              degree = d;
              field = f;
            }
          } else {
            institution = first;
          }
        }

        // Clean up extracted values
        degree = degree.replace(/^[•\-\u2022]\s*/, '').replace(datePattern, '').replace(/GPA[:\s]*\d+\.\d+/gi, '').trim();
        institution = institution.replace(/^[•\-\u2022]\s*/, '').replace(datePattern, '').replace(/GPA[:\s]*\d+\.\d+/gi, '').trim();
        field = field.replace(/^[•\-\u2022]\s*/, '').replace(datePattern, '').trim();

        if (!degree && !institution) return null;

        return {
          id: `${Date.now()}-ed-${i}`,
          institution: institution || '',
          degree: degree || '',
          field: field || '',
          startDate: '',
          graduationDate: graduationDate || '',
          gpa: gpa || '',
          achievements: [],
        } as any;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
    : [];

  // Extract top block first (for name and title extraction)
  const topBlockEnd = Object.values(indices).length
    ? Math.min(...Object.values(indices))
    : Math.min(300, normalizedText.length);
  const topBlock = normalizedText.slice(0, topBlockEnd).split(/\n+/).map((l) => l.trim()).filter(Boolean);

  // Extract contact info from whole document
  const emailMatch = normalizedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = normalizedText.match(/\+?\d[\d\s().-]{7,}\d/);
  const linkedinMatch = normalizedText.match(/https?:\/\/[^\s]*linkedin\.com\/in\/[A-Za-z0-9\-_%]+/i);
  const portfolioMatch = normalizedText.match(/https?:\/\/[^\s]+(?:portfolio|github|website|personal)[^\s]*/i) ||
                         normalizedText.match(/https?:\/\/(?:www\.)?[^\s]+\.[a-z]{2,}/i);

  // Extract location (common patterns)
  const locationMatch = normalizedText.match(/(?:location|address|city)[:\s]*([A-Z][a-z]+(?:,?\s+[A-Z]{2})?(?:,?\s+[A-Z][a-z]+)?)/i) ||
                        normalizedText.match(/([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5})?)/); // City, ST or City, ST ZIP
  const location = locationMatch ? locationMatch[1] : '';

  // Process keywords (comma or newline separated)
  const keywords = keywordsRaw
    ? keywordsRaw
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0)
    : [];

  // Process job description
  const jobDescription = jobDescriptionRaw.trim();

  // Extract portfolio URL
  const portfolio = portfolioRaw.trim() || (portfolioMatch ? portfolioMatch[0] : '');

  // Extract title (job title)
  const title = titleRaw.trim() || '';

  // Try to extract title from near the name if not found in dedicated section
  let extractedTitle = title;
  if (!extractedTitle && topBlock.length > 1) {
    // Look for a line after the name that might be a title
    for (let i = 0; i < Math.min(3, topBlock.length); i++) {
      const line = topBlock[i];
      const titleKeywords = ['engineer', 'developer', 'manager', 'analyst', 'designer', 'consultant', 'director', 'specialist', 'coordinator', 'lead', 'architect', 'officer', 'executive', 'associate', 'senior', 'junior'];
      if (titleKeywords.some(kw => line.toLowerCase().includes(kw)) && line.length < 80) {
        extractedTitle = line;
        break;
      }
    }
  }

  // Find the most likely name line
  let fullName = '';
  for (const line of topBlock) {
    // Skip lines with email, phone, linkedin, or common resume keywords
    if (
      line.includes('@') ||
      /linkedin|github|portfolio|website|http/i.test(line) ||
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line) || // phone pattern
      /resume|curriculum vitae|cv/i.test(line)
    ) {
      continue;
    }

    // Check if line looks like a name (2-4 words, each capitalized, reasonable length)
    const words = line.split(/\s+/);
    const looksLikeName =
      words.length >= 2 &&
      words.length <= 4 &&
      line.length >= 4 &&
      line.length <= 50 &&
      words.every(w => /^[A-Z][a-z]+/.test(w) || w.length <= 3); // Allow initials

    if (looksLikeName) {
      fullName = line.replace(/^name[:\-]\s*/i, '').trim();
      break;
    }
  }

  // Fallback: use first non-empty line if no good name found
  if (!fullName && topBlock.length > 0) {
    fullName = topBlock[0].replace(/^name[:\-]\s*/i, '').trim();
  }

  const result = {
    personalInfo: {
      fullName: fullName || '',
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      location: location || '',
      title: extractedTitle || '',
      linkedin: linkedinMatch?.[0],
      portfolio: portfolio || '',
    },
    summary: summaryRaw,
    skills,
    projects,
    certifications,
    experience,
    education,
    keywords,
    jobDescription,
  };

  console.log('✅ Resume parsing complete:', {
    name: result.personalInfo.fullName,
    email: result.personalInfo.email,
    skills: result.skills.length,
    experience: result.experience.length,
    education: result.education.length,
    projects: result.projects.length,
    certifications: result.certifications.length,
  });

  return result;
}

interface BuilderLayoutProps {
  initialData?: ResumeData;
  resumeId?: string;
}

export default function BuilderLayout({ initialData, resumeId }: BuilderLayoutProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [atsScore, setAtsScore] = useState<{
    score: number;
    breakdown: { keywords: number; formatting: number; content: number; impact: number };
    suggestions: string[];
    risks: string[];
    metricInsights?: import('@/lib/ats-analyzer').ATSAnalysis['metricInsights'];
  } | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [resumeCount, setResumeCount] = useState(0);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinResult, setLinkedinResult] = useState<string | null>(null);
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);

  const { resumeData, updateResumeData, saveResume, resetResumeData } = useResumeStore();
  const savingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Default to hiding preview on mobile/tablet; show by default on desktop (xl+)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
    setShowPreview(isDesktop);
  }, []);

  // Fetch user premium status and resume count
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        setUserId(user.id);

        // Get premium status
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        setIsPremium(profile?.is_premium || false);

        // Get resume count
        const { count } = await supabase
          .from('resumes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setResumeCount(count || 0);
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    fetchUserStatus();
  }, []);

  // Initialize with existing data if provided
  useEffect(() => {
    if (initialData) {
      updateResumeData(initialData);
    }
  }, [initialData, updateResumeData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (savingTimeoutRef.current) {
        clearTimeout(savingTimeoutRef.current);
      }
    };
  }, []);

  // Clear resume handler
  const handleClear = useCallback(() => {
    resetResumeData();
    toast.success('Resume cleared! Starting fresh.');
  }, [resetResumeData]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveResume(resumeId || 'new', resumeData);
    } finally {
      // Keep saving indicator visible for at least 500ms to prevent flashing
      if (savingTimeoutRef.current) {
        clearTimeout(savingTimeoutRef.current);
      }
      savingTimeoutRef.current = setTimeout(() => {
        setIsSaving(false);
      }, 500);
    }
  }, [resumeId, resumeData, saveResume]);


  // Import existing resume (PDF/DOCX/RTF/TXT)
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Client-side file size check (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please upload a resume under 5MB.`);
      e.target.value = '';
      return;
    }
    
    try {
      console.log('📄 Uploading resume:', file.name, file.type, file.size);
      toast.loading('Parsing resume...', { id: 'parse-resume' });
      
      const form = new FormData();
      form.append('resume', file);
      const res = await fetch('/api/parse-resume', { method: 'POST', body: form });
      console.log('📡 API response status:', res.status);
      
      let json;
      try {
        json = await res.json();
      } catch (jsonErr) {
        console.error('❌ Failed to parse response JSON:', jsonErr);
        toast.error('Server error. Please try again.', { id: 'parse-resume' });
        return;
      }
      
      console.log('📦 API response:', json);

      if (!res.ok || !json?.success) {
        console.error('❌ Resume parse failed:', json?.error || res.statusText);
        toast.error(json?.error || 'Failed to parse resume. Please try a different file.', { id: 'parse-resume' });
        return;
      }

      if (json?.parsedText) {
        console.log('✅ Parsed text received, length:', json.parsedText.length);
        let patch: Partial<ResumeData>;
        try {
          patch = buildResumePatchFromParsedText(json.parsedText as string);
          console.log('✅ Resume patch created:', patch);
        } catch (parseErr) {
          console.error('❌ Error parsing resume text:', parseErr);
          toast.error(`Failed to extract resume data: ${parseErr instanceof Error ? parseErr.message : 'Unknown error'}`, { id: 'parse-resume' });
          return;
        }

        const combined = { ...resumeData, ...patch } as any;
        updateResumeData(patch);
        setActiveSection('summary');

        // Inform user of imported sections
        const counts = {
          experience: (patch.experience?.length || 0),
          education: (patch.education?.length || 0),
          skills: (patch.skills?.length || 0),
          projects: (patch.projects?.length || 0),
          certifications: (patch.certifications?.length || 0),
        };
        const nonZero = Object.entries(counts).filter(([, v]) => v > 0);
        if (nonZero.length) {
          toast.success(
            `Imported: ` +
              nonZero
                .map(([k, v]) => `${k}(${v as number})`)
                .join(', '),
            { id: 'parse-resume' }
          );
        } else {
          toast.success('Imported basic details. You can edit in the left panel.', { id: 'parse-resume' });
        }

        try {
          const { ATSAnalyzer } = await import('@/lib/ats-analyzer');
          const ats = ATSAnalyzer.analyze({
            personal: {
              fullName: combined.personalInfo?.fullName || '',
              email: combined.personalInfo?.email || '',
              phone: combined.personalInfo?.phone || '',
              location: combined.personalInfo?.location || '',
              linkedin: combined.personalInfo?.linkedin,
              portfolio: combined.personalInfo?.portfolio,
              github: '',
            },
            summary: combined.summary || '',
            experience: combined.experience || [],
            education: combined.education || [],
            skills: (combined.skills || []).map((s: any) => s.name),
            targetKeywords: combined.keywords || [],
          });

          setAtsScore({
            score: ats.score,
            breakdown: ats.breakdown,
            suggestions: ats.suggestions,
            risks: ats.risks,
            metricInsights: ats.metricInsights,
          });
        } catch (atsErr) {
          console.error('Failed to calculate ATS score from imported resume:', atsErr);
        }
      }
    } catch (err) {
      console.error('Failed to import resume:', err);
      toast.error('Import failed. Please try a different file or format.', { id: 'parse-resume' });
    } finally {
      e.target.value = '';
    }
  };

  // Generate LinkedIn 'About' from current resume data via AI endpoint
  const handleGenerateLinkedIn = useCallback(async () => {
    try {
      setLinkedinLoading(true);
      const resp = await fetch('/api/ai/linkedin-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeData }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        console.error('LinkedIn API error', data);
        setLinkedinResult(data?.error || 'Failed to generate LinkedIn summary.');
      } else {
        setLinkedinResult(data?.about || 'No output from AI');
      }
      setShowLinkedinModal(true);
    } catch (err) {
      console.error('Failed to generate LinkedIn about:', err);
      setLinkedinResult('Failed to generate LinkedIn about. Please try again.');
      setShowLinkedinModal(true);
    } finally {
      setLinkedinLoading(false);
    }
  }, [resumeData]);

  const handleExport = useCallback(async (format: 'pdf' | 'docx' | 'txt' | 'json' = 'pdf') => {
    // For PDF export, we need the preview to be visible
    // Temporarily show it if it's hidden
    const wasPreviewHidden = !showPreview;

    if (format === 'pdf' && wasPreviewHidden) {
      setShowPreview(true);
      // Wait for the preview to render
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      const { exportResume } = await import('@/lib/export-resume');
      await exportResume(resumeData as any, format as any);
    } finally {
      // Hide the preview again if it was hidden before
      if (format === 'pdf' && wasPreviewHidden) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowPreview(false);
      }
    }
  }, [resumeData, showPreview]);

  // Keyboard shortcuts (Cmd/Ctrl+S/P/E)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && key === 's') {
        e.preventDefault();
        handleSave();
      } else if (isCmd && key === 'p') {
        e.preventDefault();
        setShowPreview(prev => !prev);
      } else if (isCmd && key === 'e') {
        e.preventDefault();
        handleExport();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave, handleExport]);


  // Import LinkedIn profile via PDF (Option B)
  const handleImportLinkedIn = useCallback(async () => {
    // Guided instructions, then reuse the same file input as generic import.
    alert(
      'To import from LinkedIn:\n\n1. Open your LinkedIn profile.\n2. Click "More" → "Save to PDF".\n3. Upload that PDF in the next dialog.',
    );
    fileInputRef.current?.click();
  }, []);

  // Manually trigger ATS check for current resume
  const handleCheckATS = useCallback(async () => {
    try {
      const { ATSAnalyzer } = await import('@/lib/ats-analyzer');
      const ats = ATSAnalyzer.analyze(
        {
          personal: {
            fullName: resumeData.personalInfo?.fullName || '',
            email: resumeData.personalInfo?.email || '',
            phone: resumeData.personalInfo?.phone || '',
            location: resumeData.personalInfo?.location || '',
            linkedin: resumeData.personalInfo?.linkedin,
            portfolio: resumeData.personalInfo?.portfolio,
            github: '',
          },
          summary: resumeData.summary || '',
          experience: resumeData.experience || [],
          education: resumeData.education || [],
          skills: (resumeData.skills || []).map((s: any) => s.name),
          targetKeywords: resumeData.keywords || [],
          jobDescription: resumeData.jobDescription || '',
        },
      );

      setAtsScore({
        score: ats.score,
        breakdown: ats.breakdown,
        suggestions: ats.suggestions,
        risks: ats.risks,
        metricInsights: ats.metricInsights,
      });
    } catch (error) {
      console.error('Failed to calculate ATS score:', error);
      alert('Something went wrong while calculating your ATS score.');
    }
  }, [resumeData]);

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-900 relative overflow-hidden">
      {/* Background gradient effects matching site theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-900/20 via-amber-900/20 to-pink-900/20 opacity-50 pointer-events-none z-0"></div>

      {/* Smart Ass Donkey - Bottom right corner, VISIBLE and proud! */}
      <div className="fixed bottom-0 right-0 pointer-events-none z-0">
        <img
          src="/Donkey.png"
          alt="Smart ATS Donkey"
	          className="w-80 h-80 object-contain opacity-40 transition-opacity duration-300 hidden xl:block"
        />
      </div>

      {/* Toolbar */}
      <div className="relative z-[100]">
        <BuilderToolbar
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
          onImportLinkedIn={handleImportLinkedIn}
          onGenerateLinkedIn={handleGenerateLinkedIn}
          onCheckATS={handleCheckATS}
          onClear={handleClear}
          isSaving={isSaving}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.rtf,.txt"
        onChange={onFileChange}
        className="hidden"
      />

      {/* LinkedIn About Modal */}
      {showLinkedinModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 max-w-2xl mx-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white">Generated LinkedIn 'About'</h3>
              <div className="ml-4">
                <button
                  onClick={() => setShowLinkedinModal(false)}
                  className="text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-200 whitespace-pre-wrap max-h-96 overflow-auto">
              {linkedinLoading ? 'Generating...' : linkedinResult}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  // copy to clipboard
                  if (linkedinResult) {
                    navigator.clipboard.writeText(linkedinResult);
                    toast.success('Copied to clipboard');
                  }
                }}
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg"
              >
                Copy
              </button>
              <button
                onClick={() => setShowLinkedinModal(false)}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10 min-h-0">
        {/* Sidebar Navigation */}
        <BuilderSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          completionStatus={{
            personal: !!resumeData.personalInfo?.fullName,
            experience: (resumeData.experience?.length || 0) > 0,
            education: (resumeData.education?.length || 0) > 0,
            skills: (resumeData.skills?.length || 0) > 0,
            projects: (resumeData.projects?.length || 0) > 0,
          }}
        />

        {/* Editor - expands when preview is hidden */}
        <div className="flex-1 overflow-y-auto bg-gray-900/50 backdrop-blur-sm min-h-0">
          {/* Add padding-bottom on mobile for bottom nav, extra in landscape */}
          <div className={`mx-auto py-4 sm:py-8 px-3 sm:px-6 pb-28 xl:pb-8 transition-all duration-300 ${
            showPreview ? 'max-w-4xl' : 'max-w-6xl'
          }`}>
            <ResumeEditor
              activeSection={activeSection}
              resumeData={resumeData}
              onUpdate={updateResumeData}
              isPremium={isPremium}
            />
          </div>
        </div>

        {/* Preview Panel - Desktop sidebar */}
        {showPreview && (
          <div className="hidden xl:block xl:w-1/2 border-l border-gray-800 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
            <ResumePreview
              resumeData={resumeData}
              onTemplateChange={(templateId) => {
                updateResumeData({ templateId });
              }}
              isPremium={isPremium}
              onClose={() => setShowPreview(false)}
            />
          </div>
        )}
      </div>

      {/* Mobile Preview Modal - Full screen on mobile when preview is toggled */}
      {showPreview && (
        <div className="xl:hidden fixed inset-0 z-[70] bg-gray-900 flex flex-col">
          {/* Mobile preview header with close button */}
          <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Resume Preview</h2>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(false);
              }}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors z-40"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5rem)]">
            <ResumePreview
              resumeData={resumeData}
              onTemplateChange={(templateId) => {
                updateResumeData({ templateId });
              }}
              isPremium={isPremium}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}

      {/* Auto-save indicator */}
      {isSaving && (
        <div className="fixed bottom-4 left-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
          <span className="text-sm text-gray-300">Saving...</span>
        </div>
      )}

      {/* ATS score widget - Your amazing collapsible ATS score card */}
      {atsScore && (
        <CollapsibleATSScore
          score={atsScore.score}
          breakdown={atsScore.breakdown}
          issues={atsScore.risks}
          suggestions={atsScore.suggestions}
          metricInsights={atsScore.metricInsights}
          isPremium={isPremium}
        />
      )}
    </div>
  );
}