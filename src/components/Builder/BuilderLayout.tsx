// src/components/Builder/BuilderLayout.tsx
'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';

import toast from 'react-hot-toast';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';
import CollapsibleATSScore from '@/components/CollapsibleATSScore';

import BuilderSidebar from './BuilderSidebar';
import BuilderToolbar from './BuilderToolbar';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';

function buildResumePatchFromParsedText(text: string): Partial<ResumeData> {
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
    const idx = lower.indexOf(h);
    if (idx !== -1 && !indices[h]) indices[h] = idx;
  }
  const order = Object.entries(indices).sort((a, b) => a[1] - b[1]);
  const slice = (startLabel: string) => {
    const start = indices[startLabel];
    if (start == null) return '';
    const i = order.findIndex(([k]) => k === startLabel);
    const end = i >= 0 && i < order.length - 1 ? order[i + 1][1] : text.length;
    return normalizedText.slice(start + startLabel.length, end).trim();
  };
  const sectionOr = (...names: string[]) => {
    for (const n of names) {
      const s = slice(n);
      if (s) return s;
    }
    return '';
  };

  const summaryRaw = sectionOr('professional summary', 'professional profile', 'profile', 'summary', 'objective', 'about me') || normalizedText.split(/\n\n/)[0] || '';
  const skillsRaw = sectionOr('skills', 'technical skills', 'core competencies', 'expertise');
  const projectsRaw = sectionOr('projects', 'personal projects', 'key projects');
  const certsRaw = sectionOr('certifications', 'certificates', 'licenses');
  const expRaw = sectionOr('experience', 'work experience', 'professional experience', 'employment history', 'work history');
  const eduRaw = sectionOr('education', 'academic background', 'qualifications');
  const keywordsRaw = sectionOr('keywords', 'key words', 'ats keywords');
  const jobDescriptionRaw = sectionOr('job description', 'target role');
  const portfolioRaw = sectionOr('portfolio');
  const titleRaw = sectionOr('title', 'professional title');

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

  // Improved experience parsing - handle multiple formats
  const experience = expRaw
    ? expRaw
        .split(/\n\s*\n/)
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
          rest.forEach(line => {
            if (line && line.length > 10 && !datePattern.test(line)) {
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

  return {
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
}

interface BuilderLayoutProps {
  initialData?: ResumeData;
  resumeId?: string;
}

export default function BuilderLayout({ initialData, resumeId }: BuilderLayoutProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const [atsScore, setAtsScore] = useState<{
    score: number;
    breakdown: { keywords: number; formatting: number; content: number; impact: number };
    suggestions: string[];
    risks: string[];
  } | null>(null);

  const { resumeData, updateResumeData, saveResume } = useResumeStore();
  const savingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
    try {
      const form = new FormData();
      form.append('resume', file);
      const res = await fetch('/api/parse-resume', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        console.error('Resume parse failed:', json?.error || res.statusText);
        toast.error(`Failed to parse resume: ${json?.error || 'Unknown error'}`);
        return;
      }

      if (json?.parsedText) {
        const patch = buildResumePatchFromParsedText(json.parsedText as string);
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
          );
        } else {
          toast.success('Imported basic details. You can edit in the left panel.');
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
            targetKeywords: [],
          });

          setAtsScore({
            score: ats.score,
            breakdown: ats.breakdown,
            suggestions: ats.suggestions,
            risks: ats.risks,
          });
        } catch (atsErr) {
          console.error('Failed to calculate ATS score from imported resume:', atsErr);
        }
      }
    } catch (err) {
      console.error('Failed to import resume:', err);
      toast.error('Import failed. Please try a different file or format.');
    } finally {
      e.target.value = '';
    }
  };

  const handleExport = useCallback(async () => {
    const { exportResume } = await import('@/lib/export-resume');
    await exportResume(resumeData as any, 'pdf');
  }, [resumeData]);

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
          targetKeywords: [],
        },
      );

      setAtsScore({
        score: ats.score,
        breakdown: ats.breakdown,
        suggestions: ats.suggestions,
        risks: ats.risks,
      });
    } catch (error) {
      console.error('Failed to calculate ATS score:', error);
      alert('Something went wrong while calculating your ATS score.');
    }
  }, [resumeData]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 relative overflow-hidden">
      {/* Background gradient effects matching site theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-900/20 via-amber-900/20 to-pink-900/20 opacity-50 pointer-events-none z-0"></div>

      {/* Smart Ass Donkey - Bottom right corner, VISIBLE and proud! */}
      <div className="fixed bottom-0 right-0 pointer-events-none z-0">
        <img
          src="/Donkey.png"
          alt="Smart ATS Donkey"
          className="w-80 h-80 object-contain opacity-40 transition-opacity duration-300"
        />
      </div>

      {/* Toolbar */}
      <div className="relative z-10">
        <BuilderToolbar
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
          onImportLinkedIn={handleImportLinkedIn}
          onCheckATS={handleCheckATS}
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
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

        {/* Editor */}
        <div className="flex-1 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto py-8 px-6">
            <ResumeEditor
              activeSection={activeSection}
              resumeData={resumeData}
              onUpdate={updateResumeData}
            />
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-800 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
            <ResumePreview 
              resumeData={resumeData} 
              onTemplateChange={(templateId) => {
                updateResumeData({ templateId });
              }}
            />
          </div>
        )}
      </div>

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
        />
      )}
    </div>
  );
}