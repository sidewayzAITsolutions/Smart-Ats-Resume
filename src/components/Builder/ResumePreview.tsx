// src/components/Builder/ResumePreview.tsx
'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Maximize2,
  Minimize2,
  Palette,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template?: string;
  onTemplateChange?: (templateId: string) => void;
}

const templates: Record<string, string> = {
  modern: 'Modern',
  'modern-professional': 'Modern Professional',
  classic: 'Classic',
  'basic-clean': 'Basic Clean',
  minimal: 'Minimal',
  'minimalist-elegant': 'Minimalist Elegant',
  creative: 'Creative',
  'creative-designer': 'Creative Designer',
};

export default function ResumePreview({
  resumeData,
  template = 'modern',
  onTemplateChange
}: ResumePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData?.templateId || template);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  useEffect(() => {
    if (resumeData?.templateId) {
      setSelectedTemplate(resumeData.templateId);
    }
  }, [resumeData?.templateId]);

  const renderPreviewContent = () => {
    const templateId = selectedTemplate || resumeData?.templateId || 'modern';
    
    // Modern Template (default)
    if (templateId === 'modern' || templateId === 'modern-professional' || !templateId) {
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
                      {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
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
                      <p className="text-gray-600">{edu.school || edu.institution}</p>
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
                  {project.description && (
                    <p className="text-gray-700 text-sm mt-1">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
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
    }

    // Classic Template
    if (templateId === 'classic' || templateId === 'basic-clean') {
      return (
        <div className="bg-white p-8 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px' }}>
          {resumeData.personalInfo && (
            <header className="mb-6 pb-4 border-b border-gray-300 text-center">
              <h1 className="text-2xl font-bold text-gray-900 uppercase mb-1">
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-lg text-gray-700 mb-2">
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {resumeData.summary && (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                Work Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {exp.position}
                      </h3>
                      <p className="text-gray-600 text-xs italic">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-xs mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {resumeData.education && resumeData.education.length > 0 && (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 text-xs">{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-700 text-xs mt-1">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5">
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
    }

    // Minimal Template
    if (templateId === 'minimal' || templateId === 'minimalist-elegant') {
      return (
        <div className="bg-white p-10 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px' }}>
          {resumeData.personalInfo && (
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-base text-gray-600 mb-3">
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="w-16 h-px bg-gray-400 mx-auto mb-3"></div>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {resumeData.summary && (
            <section className="mb-6">
              <h2 className="text-base font-light text-gray-700 mb-2 uppercase tracking-wide">
                Summary
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-light text-gray-700 mb-3 uppercase tracking-wide">
                Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {exp.position}
                      </h3>
                      <p className="text-gray-500 text-xs">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-xs mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {resumeData.education && resumeData.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-light text-gray-700 mb-3 uppercase tracking-wide">
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-500 text-xs">{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-400">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-light text-gray-700 mb-3 uppercase tracking-wide">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-gray-600 text-xs border border-gray-300"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-light text-gray-700 mb-3 uppercase tracking-wide">
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 text-xs mt-1">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-gray-500">
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
    }

    // Creative Template
    if (templateId === 'creative' || templateId === 'creative-designer') {
      return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px' }}>
          {resumeData.personalInfo && (
            <header className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-purple-900 mb-2">
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-xl text-pink-700 font-medium mb-3">
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 my-3"></div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-700">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {resumeData.summary && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-purple-800 mb-2">
                Professional Summary
              </h2>
              <p className="text-purple-700 leading-relaxed">
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-purple-800 mb-3">
                Work Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4 bg-white/50 p-3 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-purple-900">
                        {exp.position}
                      </h3>
                      <p className="text-pink-700">{exp.company}</p>
                    </div>
                    <span className="text-sm text-purple-600">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-purple-700 text-sm mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {resumeData.education && resumeData.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-purple-800 mb-3">
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-3 bg-white/50 p-3 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-purple-900">
                        {edu.degree}
                      </h3>
                      <p className="text-pink-700">{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-sm text-purple-600">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-purple-800 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-medium"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-purple-800 mb-3">
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-3 bg-white/50 p-3 rounded">
                  <h3 className="font-semibold text-purple-900">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-purple-700 text-sm mt-1">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-pink-700 bg-pink-100 px-2 py-1 rounded">
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
    }

    // Default fallback - render modern template
    return (
      <div className="bg-white p-8 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px' }}>
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
              {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
              {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
            </div>
          </header>
        )}
        {resumeData.summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </section>
        )}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Work Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.description && (
                  <ul className="mt-2 space-y-1">
                    {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
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
        {resumeData.education && resumeData.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school || edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                </div>
                {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        )}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech: string, i: number) => (
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
                      // Update resume data with new template
                      if (onTemplateChange) {
                        onTemplateChange(key);
                      }
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