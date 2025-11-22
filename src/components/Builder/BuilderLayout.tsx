// src/components/Builder/BuilderLayout.tsx
'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';

import { useAutoSave } from '@/hooks/useAutoSave';
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

  const headings = [
    'professional summary',
    'summary',
    'experience',
    'work experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ];
  const normalizedText = normalize(text);
  const lower = normalizedText.toLowerCase();
  const indices: Record<string, number> = {};
  for (const h of headings) {
    const idx = lower.indexOf(h);
    if (idx !== -1) indices[h] = idx;
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

  const summaryRaw = sectionOr('professional summary', 'summary') || normalizedText.split(/\n\n/)[0] || '';
  const skillsRaw = sectionOr('skills');
  const projectsRaw = sectionOr('projects');
  const certsRaw = sectionOr('certifications');
  const expRaw = sectionOr('experience', 'work experience');
  const eduRaw = sectionOr('education');

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

  const experience = expRaw
    ? expRaw
        .split(/\n\s*\n/)
        .map((block, i) => {
          const lines = toLines(block);
          const [first, ...rest] = lines;
          const [position, company] = first ? first.split(' at ') : ['', ''];
          const achievements = rest.filter(Boolean);
          return {
            id: `${Date.now()}-ex-${i}`,
            company: (company || '').trim(),
            position: (position || '').trim(),
            startDate: '',
            endDate: '',
            current: false,
            description: rest.join(' '),
            achievements,
            keywords: [],
          };
        })
        .filter((e) => e.company || e.position)
    : [];

  const education = eduRaw
    ? eduRaw.split(/\n\s*\n/).map((block, i) => {
        const lines = toLines(block);
        const [first] = lines;
        let degree = '';
        let field = '';
        let institution = '';
        if (first && first.includes(' - ')) {
          const [left, right] = first.split(' - ');
          institution = right.trim();
          if (left.includes(' in ')) {
            const [d, f] = left.split(' in ');
            degree = d.trim();
            field = f.trim();
          } else {
            degree = left.trim();
          }
        } else {
          institution = first || '';
        }
        return {
          id: `${Date.now()}-ed-${i}`,
          institution,
          degree,
          field,
          startDate: '',
          graduationDate: '',
          gpa: '',
          achievements: [],
        } as any;
      })
    : [];

  // Extract contact info from whole document
  const emailMatch = normalizedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = normalizedText.match(/\+?\d[\d\s().-]{7,}\d/);
  const linkedinMatch = normalizedText.match(/https?:\/\/[^\s]*linkedin\.com\/in\/[A-Za-z0-9\-_%]+/i);

  // Guess full name as the first non-empty line before the first heading
  const topBlockEnd = Object.values(indices).length
    ? Math.min(...Object.values(indices))
    : Math.min(200, normalizedText.length);
  const topBlock = normalizedText.slice(0, topBlockEnd).split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const fullName = (topBlock.find((l) => !l.includes('@') && !/linkedin/i.test(l) && l.length >= 2 && l.length <= 80) || '').replace(/^name[:\-]\s*/i, '');

  return {
    personalInfo: {
      fullName: fullName || '',
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      location: '',
      linkedin: linkedinMatch?.[0],
    },
    summary: summaryRaw,
    skills,
    projects,
    certifications,
    experience,
    education,
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

  const { resumeData, updateResumeData, saveResume, setResumeData } = useResumeStore();

  // Initialize with existing data if provided
  useEffect(() => {
    if (initialData) {
      updateResumeData(initialData);
    }
  }, [initialData, updateResumeData]);

  // Auto-save functionality
  useAutoSave({
    data: resumeData,
    onSave: async (data) => {
      setIsSaving(true);
      try {
        await saveResume(resumeId || 'new', data);
      } finally {
        setIsSaving(false);
      }
    },
    delay: 3000, // Save after 3 seconds of inactivity
  });


  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveResume(resumeId || 'new', resumeData);
    } finally {
      setIsSaving(false);
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