// src/components/Builder/BuilderLayout.tsx
'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';

import { useAutoSave } from '@/hooks/useAutoSave';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';

import BuilderSidebar from './BuilderSidebar';
import BuilderToolbar from './BuilderToolbar';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';

interface BuilderLayoutProps {
  initialData?: ResumeData;
  resumeId?: string;
}

export default function BuilderLayout({ initialData, resumeId }: BuilderLayoutProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');

  const { resumeData, updateResumeData, saveResume } = useResumeStore();

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
      if (json?.parsedText) {
        const text: string = json.parsedText as string;
        // Simple heuristic parsing into sections
        const headings = ['professional summary', 'summary', 'experience', 'work experience', 'education', 'skills', 'projects', 'certifications'];
        const lower = text.toLowerCase();
        const indices: Record<string, number> = {};
        for (const h of headings) {
          const idx = lower.indexOf(h);
          if (idx !== -1) indices[h] = idx;
        }
        const order = Object.entries(indices).sort((a,b)=>a[1]-b[1]);
        const slice = (startLabel: string) => {
          const start = indices[startLabel];
          if (start == null) return '';
          const i = order.findIndex(([k]) => k===startLabel);
          const end = i>=0 && i<order.length-1 ? order[i+1][1] : text.length;
          return text.slice(start + startLabel.length, end).trim();
        };
        const sectionOr = (...names: string[]) => {
          for (const n of names) { const s = slice(n); if (s) return s; }
          return '';
        };

        const summaryRaw = sectionOr('professional summary','summary') || text.split(/\n\n/)[0] || '';
        const skillsRaw = sectionOr('skills');
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

        const projectsRaw = sectionOr('projects');
        const certsRaw = sectionOr('certifications');
        const expRaw = sectionOr('experience','work experience');
        const eduRaw = sectionOr('education');

        const toLines = (s: string) => s.split(/\r?\n|•|\u2022|\-/).map(t=>t.trim()).filter(Boolean);

        const skills = toLines(skillsRaw)
          .join(',')
          .split(',')
          .map(s=>s.trim())
          .filter(Boolean)
          .map((name, i)=>({ id: `${Date.now()}-sk-${i}`, name, category: 'technical', proficiency: 'beginner', keywords: [] }));

        const projects = toLines(projectsRaw).map((line,i)=>({ id: `${Date.now()}-pr-${i}`, name: line, description: '', technologies: [] }));
        const certifications = toLines(certsRaw).map((line,i)=>({ id: `${Date.now()}-ce-${i}`, name: line, issuer: '', date: '' }));

        const experiences = expRaw
          ? expRaw.split(/\n\s*\n/).map((block,i)=>{
              const lines = toLines(block);
              const [first,...rest] = lines;
              const [position, company] = first ? first.split(' at ') : ['',''];
              // achievements as rest
              const achievements = rest.filter(Boolean);
              return { id: `${Date.now()}-ex-${i}`, company: (company||'').trim(), position: (position||'').trim(), startDate: '', endDate: '', current: false, description: rest.join(' '), achievements, keywords: [] };
            }).filter(e=>e.company || e.position)
          : [];

        const education = eduRaw
          ? eduRaw.split(/\n\s*\n/).map((block,i)=>{
              const lines = toLines(block);
              const [first] = lines;
              // Try "Degree in Field - Institution"
              let degree = '', field = '', institution = '';
              if (first && first.includes(' - ')) {
                const [left, right] = first.split(' - ');
                institution = right.trim();
                if (left.includes(' in ')) {
                  const [d, f] = left.split(' in ');
                  degree = d.trim(); field = f.trim();
                } else {
                  degree = left.trim();
                }
              } else {
                institution = first || '';
              }
              return { id: `${Date.now()}-ed-${i}`, institution, degree, field, startDate: '', graduationDate: '', gpa: '', achievements: [] } as any;
            })
          : [];

        updateResumeData({
          summary: summaryRaw,
          skills,
          projects,
          certifications,
          experience: experiences,
          education,
        });
        setActiveSection('summary');
      }
    } catch (err) {
      console.error('Failed to import resume:', err);
    } finally {
      e.target.value = '';
    }
  };

  const handleExport = useCallback(async () => {
    const { exportResume } = await import('@/lib/export-resume');
    await exportResume(resumeData as any, 'pdf');
  }, [resumeData]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <BuilderToolbar
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
        isSaving={isSaving}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.rtf,.txt"
        onChange={onFileChange}
        className="hidden"
      />


      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
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
        <div className="flex-1 overflow-y-auto">
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
          <div className="w-1/2 border-l border-gray-200 bg-white overflow-y-auto">
            <ResumePreview resumeData={resumeData} />
          </div>
        )}
      </div>

      {/* Auto-save indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">Saving...</span>
        </div>
      )}
    </div>
  );
}