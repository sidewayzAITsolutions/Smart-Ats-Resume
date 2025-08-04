// src/components/Builder/ResumePreview.tsx
'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { cn } from '@/lib/utils';
import { Maximize2, Minimize2, Palette } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template?: string;
}

const templates = {
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
  creative: 'Creative',
};

export default function ResumePreview({ 
  resumeData, 
  template = 'modern' 
}: ResumePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  const renderPreviewContent = () => {
    // This is a simplified preview - in production, you'd use the actual template components
    return (
      <div className="bg-white p-8 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px' }}>
        {/* Header */}
        {resumeData.personalInfo && (
          <header className="mb-6 pb-6 border-b-2 border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {resumeData.personalInfo.fullName || 'Your Name'}
            </h1>
            {resumeData.personalInfo.title && (
              <p className="text-xl text-gray-600 mb-3">
                {resumeData.personalInfo.title}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {resumeData.personalInfo.email && (
                <span>{resumeData.personalInfo.email}</span>
              )}
              {resumeData.personalInfo.phone && (
                <span>{resumeData.personalInfo.phone}</span>
              )}
              {resumeData.personalInfo.location && (
                <span>{resumeData.personalInfo.location}</span>
              )}
              {resumeData.personalInfo.linkedin && (
                <span>{resumeData.personalInfo.linkedin}</span>
              )}
            </div>
          </header>
        )}

        {/* Summary */}
        {resumeData.summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {resumeData.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Work Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.description && (
                  <ul className="mt-2 space-y-1">
                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                      <li key={i} className="text-gray-700 text-sm pl-5 relative">
                        <span className="absolute left-0">•</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.graduationDate}
                  </span>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Projects
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold text-gray-900">
                  {project.name}
                </h3>
                <p className="text-gray-700 text-sm mt-1">
                  {project.description}
                </p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "relative h-full flex flex-col",
      isFullscreen && "fixed inset-0 z-50 bg-gray-100"
    )}>
      {/* Preview Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          
          {/* Template Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Palette className="h-4 w-4" />
              {templates[selectedTemplate as keyof typeof templates]}
            </button>
            
            {showTemplateMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {Object.entries(templates).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTemplate(key);
                      setShowTemplateMenu(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left hover:bg-gray-50",
                      selectedTemplate === key && "bg-indigo-50 text-indigo-600"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        {renderPreviewContent()}
      </div>
    </div>
  );
}