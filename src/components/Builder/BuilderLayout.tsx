// src/components/Builder/BuilderLayout.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Save, Download, FileText, Share2, Loader2 } from 'lucide-react';
import BuilderSidebar from './BuilderSidebar';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';
import BuilderToolbar from './BuilderToolbar';
import { useResumeStore } from '@/store/resumeStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ResumeData } from '@/types/resume';

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
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+s': () => handleSave(),
    'cmd+p': () => setShowPreview(!showPreview),
    'cmd+e': () => handleExport(),
  });
  
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveResume(resumeId || 'new', resumeData);
    } finally {
      setIsSaving(false);
    }
  }, [resumeId, resumeData, saveResume]);
  
  const handleExport = useCallback(async () => {
    // Export functionality will be implemented in export-resume.ts
    const { exportToPDF } = await import('@/lib/export-resume');
    await exportToPDF(resumeData);
  }, [resumeData]);
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <BuilderToolbar
        onSave={handleSave}
        onExport={handleExport}
        isSaving={isSaving}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <BuilderSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          completionStatus={{
            personal: !!resumeData.personalInfo?.fullName,
            experience: resumeData.experience?.length > 0,
            education: resumeData.education?.length > 0,
            skills: resumeData.skills?.length > 0,
            projects: resumeData.projects?.length > 0,
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