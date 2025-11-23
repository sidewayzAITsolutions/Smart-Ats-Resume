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
import { ResumeData, FormattingOptions } from '@/types/resume';

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

// Helper function to get bullet style character
const getBulletChar = (style: FormattingOptions['bulletStyle']) => {
  switch (style) {
    case 'bullet': return '•';
    case 'dash': return '−';
    case 'circle': return '○';
    case 'number': return ''; // Numbers are handled differently
    default: return '•';
  }
};

// Helper function to get font size
const getFontSize = (size: FormattingOptions['fontSize'], baseSize: string) => {
  const baseSizeNum = parseFloat(baseSize);
  switch (size) {
    case 'small': return `${baseSizeNum * 0.9}rem`; // 10pt equivalent
    case 'medium': return baseSize; // 11pt equivalent (default)
    case 'large': return `${baseSizeNum * 1.1}rem`; // 12pt equivalent
    default: return baseSize;
  }
};

// Helper function to get line spacing
const getLineSpacing = (spacing: FormattingOptions['lineSpacing']) => {
  switch (spacing) {
    case 'compact': return '1.0';
    case 'normal': return '1.15';
    case 'relaxed': return '1.5';
    default: return '1.15';
  }
};

// Helper functions to get colors with defaults
const getPrimaryTextColor = (colors?: FormattingOptions['colors']) => {
  return colors?.primaryText || '#374151';
};

const getHeadingTextColor = (colors?: FormattingOptions['colors']) => {
  return colors?.headingText || '#111827';
};

const getAccentColor = (colors?: FormattingOptions['colors']) => {
  return colors?.accentColor || '#3B82F6';
};

export default function ResumePreview({
  resumeData,
  template = 'modern',
  onTemplateChange
}: ResumePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData?.templateId || template);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // Get formatting options with defaults
  const formatting: FormattingOptions = resumeData.formattingOptions || {
    bulletStyle: 'bullet',
    fontSize: 'medium',
    lineSpacing: 'normal',
  };

  useEffect(() => {
    if (resumeData?.templateId) {
      setSelectedTemplate(resumeData.templateId);
    }
  }, [resumeData?.templateId]);

  const renderPreviewContent = () => {
    const templateId = selectedTemplate || resumeData?.templateId || 'modern';
    
    // Modern Template - Clean sans-serif, contemporary design
    if (templateId === 'modern' || !templateId) {
      return (
        <div className="bg-white p-8 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px', fontFamily: '"Inter", "Roboto", sans-serif' }}>
          {/* Header */}
          {resumeData.personalInfo && (
            <header className="mb-6 pb-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-lg text-gray-600 mb-4 font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>•</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>•</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>•</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {/* Summary */}
          {resumeData.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em', color: getHeadingTextColor(formatting.colors) }}>
                Professional Summary
              </h2>
              <p className="leading-relaxed text-sm" style={{ fontFamily: '"Inter", sans-serif', lineHeight: '1.6', color: getPrimaryTextColor(formatting.colors) }}>
                {resumeData.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em', color: getHeadingTextColor(formatting.colors) }}>
                Work Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-base" style={{ fontFamily: '"Inter", sans-serif', color: getHeadingTextColor(formatting.colors) }}>
                        {exp.position}
                      </h3>
                      <p className="text-sm" style={{ fontFamily: '"Inter", sans-serif', color: getPrimaryTextColor(formatting.colors), opacity: 0.8 }}>{exp.company}</p>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap ml-4" style={{ color: getPrimaryTextColor(formatting.colors), opacity: 0.6 }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-2 space-y-1" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                      {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                        <li
                          key={i}
                          className="pl-5 relative"
                          style={{
                            fontFamily: '"Inter", sans-serif',
                            lineHeight: getLineSpacing(formatting.lineSpacing),
                            fontSize: getFontSize(formatting.fontSize, '0.875rem'),
                            color: getPrimaryTextColor(formatting.colors)
                          }}
                        >
                          {formatting.bulletStyle !== 'number' && (
                            <span className="absolute left-0" style={{ color: getAccentColor(formatting.colors) }}>{getBulletChar(formatting.bulletStyle)}</span>
                          )}
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
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em' }}>
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {edu.graduationDate}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: '"Inter", sans-serif' }}>GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                    style={{ fontFamily: '"Inter", sans-serif' }}
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
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em' }}>
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed" style={{ fontFamily: '"Inter", sans-serif', lineHeight: '1.5' }}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200" style={{ fontFamily: '"Inter", sans-serif' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em' }}>
                Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-gray-600 text-xs" style={{ fontFamily: '"Inter", sans-serif' }}>
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {cert.date && <p>{cert.date}</p>}
                      {cert.expirationDate && (
                        <p className="italic">Expires {cert.expirationDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      );
    }

    // Modern Professional Template - Elegant serif fonts
    if (templateId === 'modern-professional') {
      return (
        <div className="bg-white p-10 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px', fontFamily: '"Crimson Pro", "Lora", "Georgia", serif' }}>
          {/* Header */}
          {resumeData.personalInfo && (
            <header className="mb-8 pb-8 border-b-2 border-gray-300">
              <h1 className="text-4xl font-normal text-gray-900 mb-2 tracking-tight" style={{ fontFamily: '"Playfair Display", "Crimson Pro", serif', letterSpacing: '0.02em' }}>
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-xl text-gray-600 mb-4 font-light italic" style={{ fontFamily: '"Crimson Pro", serif' }}>
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="flex flex-wrap gap-5 text-sm text-gray-600 font-light">
                {resumeData.personalInfo.email && (
                  <span className="border-r border-gray-300 pr-5">{resumeData.personalInfo.email}</span>
                )}
                {resumeData.personalInfo.phone && (
                  <span className="border-r border-gray-300 pr-5">{resumeData.personalInfo.phone}</span>
                )}
                {resumeData.personalInfo.location && (
                  <span className="border-r border-gray-300 pr-5">{resumeData.personalInfo.location}</span>
                )}
                {resumeData.personalInfo.linkedin && (
                  <span>{resumeData.personalInfo.linkedin}</span>
                )}
              </div>
            </header>
          )}

          {/* Summary */}
          {resumeData.summary && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide uppercase" style={{ fontFamily: '"Crimson Pro", serif', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-base" style={{ fontFamily: '"Crimson Pro", serif', lineHeight: '1.8' }}>
                {resumeData.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide uppercase" style={{ fontFamily: '"Crimson Pro", serif', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                Work Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg" style={{ fontFamily: '"Crimson Pro", serif' }}>
                        {exp.position}
                      </h3>
                      <p className="text-gray-600 italic" style={{ fontFamily: '"Crimson Pro", serif' }}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-light whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-3 space-y-1.5" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                      {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                        <li
                          key={i}
                          className="text-gray-700 pl-6 relative"
                          style={{
                            fontFamily: '"Crimson Pro", serif',
                            lineHeight: getLineSpacing(formatting.lineSpacing),
                            fontSize: getFontSize(formatting.fontSize, '0.875rem')
                          }}
                        >
                          {formatting.bulletStyle !== 'number' && (
                            <span className="absolute left-0 text-gray-400">{getBulletChar(formatting.bulletStyle)}</span>
                          )}
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
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide uppercase" style={{ fontFamily: '"Crimson Pro", serif', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base" style={{ fontFamily: '"Crimson Pro", serif' }}>
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 italic" style={{ fontFamily: '"Crimson Pro", serif' }}>{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-light">
                      {edu.graduationDate}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: '"Crimson Pro", serif' }}>GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide uppercase" style={{ fontFamily: '"Crimson Pro", serif', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-sm text-sm font-light border border-gray-200"
                    style={{ fontFamily: '"Crimson Pro", serif' }}
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide uppercase" style={{ fontFamily: '"Crimson Pro", serif', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-1" style={{ fontFamily: '"Crimson Pro", serif' }}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed" style={{ fontFamily: '"Crimson Pro", serif', lineHeight: '1.7' }}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200 font-light" style={{ fontFamily: '"Crimson Pro", serif' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide uppercase" style={{ fontFamily: '"Crimson Pro", serif', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Crimson Pro", serif' }}>
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-gray-600 text-xs" style={{ fontFamily: '"Crimson Pro", serif' }}>
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {cert.date && <p>{cert.date}</p>}
                      {cert.expirationDate && (
                        <p className="italic">Expires {cert.expirationDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      );
    }

    // Classic Template - Traditional, formal style with left accent bar
    if (templateId === 'classic') {
      return (
        <div className="bg-white p-8 shadow-lg mx-auto relative" style={{ maxWidth: '850px', minHeight: '1100px', fontFamily: '"Times New Roman", "Georgia", serif' }}>
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-800 to-gray-500"></div>

          <div className="ml-6">
            {resumeData.personalInfo && (
              <header className="mb-8 pb-6 border-b-4 border-gray-800">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: '"Times New Roman", serif', letterSpacing: '-0.01em' }}>
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h1>
                {resumeData.personalInfo.title && (
                  <p className="text-lg text-gray-700 mb-4 font-semibold italic" style={{ fontFamily: '"Times New Roman", serif' }}>
                    {resumeData.personalInfo.title}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>•</span>}
                  {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>•</span>}
                  {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                  {resumeData.personalInfo.linkedin && <span>•</span>}
                  {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                </div>
              </header>
            )}

            {resumeData.summary && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-3 pb-2 border-b-2 border-gray-400" style={{ fontFamily: '"Times New Roman", serif', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
                  Professional Summary
                </h2>
                <p className="text-gray-700 text-base leading-relaxed" style={{ fontFamily: '"Times New Roman", serif', lineHeight: '1.8' }}>
                  {resumeData.summary}
                </p>
              </section>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b-2 border-gray-400" style={{ fontFamily: '"Times New Roman", serif', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
                  Work Experience
                </h2>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-6 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: '"Times New Roman", serif' }}>
                          {exp.position}
                        </h3>
                        <p className="text-gray-600 italic text-base" style={{ fontFamily: '"Times New Roman", serif' }}>{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500 font-semibold whitespace-nowrap ml-4">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.description && (
                      <ul className="mt-2 space-y-1" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                        {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                          <li
                            key={i}
                            className="text-gray-700 pl-6 relative"
                            style={{
                              fontFamily: '"Times New Roman", serif',
                              lineHeight: getLineSpacing(formatting.lineSpacing),
                              fontSize: getFontSize(formatting.fontSize, '0.875rem')
                            }}
                          >
                            {formatting.bulletStyle !== 'number' && (
                              <span className="absolute left-0 text-gray-600">{getBulletChar(formatting.bulletStyle)}</span>
                            )}
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
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b-2 border-gray-400" style={{ fontFamily: '"Times New Roman", serif', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-4 pb-3 border-b border-gray-200 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: '"Times New Roman", serif' }}>
                          {edu.degree}
                        </h3>
                        <p className="text-gray-600 text-sm" style={{ fontFamily: '"Times New Roman", serif' }}>{edu.school || edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500 font-semibold">{edu.graduationDate}</span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {resumeData.skills && resumeData.skills.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b-2 border-gray-400" style={{ fontFamily: '"Times New Roman", serif', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm border-2 border-gray-400 font-medium"
                      style={{ fontFamily: '"Times New Roman", serif' }}
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {resumeData.projects && resumeData.projects.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b-2 border-gray-400" style={{ fontFamily: '"Times New Roman", serif', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
                  Projects
                </h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-4 pb-3 border-b border-gray-200 last:border-0">
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: '"Times New Roman", serif' }}>
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-700 text-sm mt-1 leading-relaxed" style={{ fontFamily: '"Times New Roman", serif', lineHeight: '1.7' }}>{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.map((tech: string, i: number) => (
                          <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 border border-gray-300" style={{ fontFamily: '"Times New Roman", serif' }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b-2 border-gray-400" style={{ fontFamily: '"Times New Roman", serif', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
                  Certifications
                </h2>
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="mb-3 pb-2 border-b border-gray-200 last:border-0">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: '"Times New Roman", serif' }}>
                          {cert.name}
                        </h3>
                        {cert.issuer && (
                          <p className="text-gray-600 text-xs" style={{ fontFamily: '"Times New Roman", serif' }}>
                            {cert.issuer}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {cert.date && <p>{cert.date}</p>}
                        {cert.expirationDate && (
                          <p className="italic">Expires {cert.expirationDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      );
    }

    // Basic Clean Template - Simple, ATS-friendly, minimal styling
    if (templateId === 'basic-clean') {
      return (
        <div className="bg-white p-8 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px', fontFamily: '"Arial", "Helvetica", sans-serif' }}>
          {resumeData.personalInfo && (
            <header className="mb-6 pb-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: '"Arial", sans-serif' }}>
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-base text-gray-600 mb-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>• {resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {resumeData.summary && (
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: '"Arial", sans-serif', lineHeight: '1.5' }}>
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                Work Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Arial", sans-serif' }}>
                        {exp.position}
                      </h3>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: '"Arial", sans-serif' }}>{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-1 space-y-0.5" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                      {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                        <li
                          key={i}
                          className="text-gray-700 pl-5 relative"
                          style={{
                            fontFamily: '"Arial", sans-serif',
                            lineHeight: getLineSpacing(formatting.lineSpacing),
                            fontSize: getFontSize(formatting.fontSize, '0.75rem')
                          }}
                        >
                          {formatting.bulletStyle !== 'number' && (
                            <span className="absolute left-0 text-gray-500">{getBulletChar(formatting.bulletStyle)}</span>
                          )}
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
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Arial", sans-serif' }}>
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: '"Arial", sans-serif' }}>{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs"
                    style={{ fontFamily: '"Arial", sans-serif' }}
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Arial", sans-serif' }}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-700 text-xs mt-1 leading-relaxed" style={{ fontFamily: '"Arial", sans-serif', lineHeight: '1.4' }}>{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-gray-600" style={{ fontFamily: '"Arial", sans-serif' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: '"Arial", sans-serif' }}>
                Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Arial", sans-serif' }}>
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-gray-600 text-xs" style={{ fontFamily: '"Arial", sans-serif' }}>
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {cert.date && <p>{cert.date}</p>}
                      {cert.expirationDate && (
                        <p className="italic">Expires {cert.expirationDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      );
    }

    // Creative Template - Modern, clean with accent colors and simple design
    if (templateId === 'creative') {
      return (
        <div className="bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px' }}>
          {resumeData.personalInfo && (
            <header className="mb-8 pb-6 border-b-4 border-teal-500">
              <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-lg text-teal-600 font-semibold mb-4" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>•</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>•</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>•</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {resumeData.summary && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-3 uppercase tracking-widest pb-2 border-b-2 border-teal-300" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em' }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', lineHeight: '1.7' }}>
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-widest pb-2 border-b-2 border-teal-300" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em' }}>
                Work Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-5 pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                        {exp.position}
                      </h3>
                      <p className="text-teal-600 font-semibold text-sm" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-2 space-y-1" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                      {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                        <li
                          key={i}
                          className="text-gray-700 pl-5 relative"
                          style={{
                            fontFamily: '"Segoe UI", "Roboto", sans-serif',
                            lineHeight: getLineSpacing(formatting.lineSpacing),
                            fontSize: getFontSize(formatting.fontSize, '0.875rem')
                          }}
                        >
                          {formatting.bulletStyle !== 'number' && (
                            <span className="absolute left-0 text-teal-500">{getBulletChar(formatting.bulletStyle)}</span>
                          )}
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
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-widest pb-2 border-b-2 border-teal-300" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em' }}>
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4 pb-3 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                        {edu.degree}
                      </h3>
                      <p className="text-teal-600 font-semibold text-xs" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-widest pb-2 border-b-2 border-teal-300" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-teal-100 text-teal-900 rounded text-sm font-semibold border border-teal-300"
                    style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-widest pb-2 border-b-2 border-teal-300" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em' }}>
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-4 pb-3 border-b border-gray-200 last:border-0">
                  <h3 className="font-bold text-slate-900 text-base mb-2" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', lineHeight: '1.6' }}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200 font-semibold" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-widest pb-2 border-b-2 border-teal-300" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em' }}>
                Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-3 pb-2 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-gray-600 text-xs" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {cert.date && <p>{cert.date}</p>}
                      {cert.expirationDate && (
                        <p className="italic">Expires {cert.expirationDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      );
    }

    // Minimal Template - Very simple, clean lines, sans-serif
    if (templateId === 'minimal') {
      return (
        <div className="bg-white p-10 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px', fontFamily: '"Roboto", "Arial", sans-serif' }}>
          {resumeData.personalInfo && (
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-base text-gray-500 mb-4 font-light" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="w-20 h-px bg-gray-300 mx-auto mb-4"></div>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 font-light" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {resumeData.summary && (
            <section className="mb-8">
              <h2 className="text-sm font-light text-gray-500 mb-3 uppercase tracking-wider text-center" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, letterSpacing: '0.15em' }}>
                Summary
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed text-center max-w-xl mx-auto" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, lineHeight: '1.7' }}>
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, letterSpacing: '0.15em' }}>
                Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-5 pb-5 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-normal text-gray-900 text-sm mb-1" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400 }}>
                        {exp.position}
                      </h3>
                      <p className="text-gray-500 text-xs font-light" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-light whitespace-nowrap ml-4" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-1 space-y-0.5" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                      {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                        <li
                          key={i}
                          className="text-gray-600 pl-5 relative"
                          style={{
                            fontFamily: '"Roboto", sans-serif',
                            fontWeight: 300,
                            lineHeight: getLineSpacing(formatting.lineSpacing),
                            fontSize: getFontSize(formatting.fontSize, '0.75rem')
                          }}
                        >
                          {formatting.bulletStyle !== 'number' && (
                            <span className="absolute left-0 text-gray-400">{getBulletChar(formatting.bulletStyle)}</span>
                          )}
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
            <section className="mb-8">
              <h2 className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, letterSpacing: '0.15em' }}>
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-normal text-gray-900 text-sm" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400 }}>
                        {edu.degree}
                      </h3>
                      <p className="text-gray-500 text-xs font-light" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-light" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, letterSpacing: '0.15em' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-gray-600 text-xs border border-gray-300 font-light"
                    style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, letterSpacing: '0.15em' }}>
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                  <h3 className="font-normal text-gray-900 text-sm mb-1" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400 }}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, lineHeight: '1.6' }}>{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-gray-400 font-light" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, letterSpacing: '0.15em' }}>
                Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-normal text-gray-900 text-sm" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 400 }}>
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-gray-600 text-xs" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300 }}>
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {cert.date && <p>{cert.date}</p>}
                      {cert.expirationDate && (
                        <p className="italic">Expires {cert.expirationDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      );
    }

    // Minimalist Elegant Template - Ultra refined serif design
    if (templateId === 'minimalist-elegant') {
      return (
        <div className="bg-white p-12 shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px', fontFamily: '"Lora", "Crimson Pro", serif' }}>
          {resumeData.personalInfo && (
            <header className="mb-12 text-center">
              <h1 className="text-5xl font-light text-gray-900 mb-3 tracking-tight" style={{ fontFamily: '"Playfair Display", "Lora", serif', fontWeight: 300, letterSpacing: '0.05em' }}>
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-lg text-gray-500 mb-6 font-light italic" style={{ fontFamily: '"Lora", serif' }}>
                  {resumeData.personalInfo.title}
                </p>
              )}
              <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-6"></div>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 font-light tracking-wider uppercase" style={{ fontFamily: '"Lora", serif', letterSpacing: '0.15em' }}>
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
              </div>
            </header>
          )}

          {resumeData.summary && (
            <section className="mb-10">
              <h2 className="text-xs font-light text-gray-400 mb-4 uppercase tracking-widest text-center" style={{ fontFamily: '"Lora", serif', letterSpacing: '0.2em' }}>
                Summary
              </h2>
              <p className="text-gray-700 text-sm leading-loose text-center max-w-2xl mx-auto" style={{ fontFamily: '"Lora", serif', lineHeight: '2' }}>
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-light text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: '"Lora", serif', letterSpacing: '0.2em' }}>
                Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-8 pb-8 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-normal text-gray-900 text-base mb-1" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>
                        {exp.position}
                      </h3>
                      <p className="text-gray-500 text-sm font-light italic" style={{ fontFamily: '"Lora", serif' }}>{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-light whitespace-nowrap ml-6" style={{ fontFamily: '"Lora", serif' }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-2 space-y-1" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                      {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                        <li
                          key={i}
                          className="text-gray-600 pl-5 relative"
                          style={{
                            fontFamily: '"Lora", serif',
                            lineHeight: getLineSpacing(formatting.lineSpacing),
                            fontSize: getFontSize(formatting.fontSize, '0.875rem')
                          }}
                        >
                          {formatting.bulletStyle !== 'number' && (
                            <span className="absolute left-0 text-gray-400">{getBulletChar(formatting.bulletStyle)}</span>
                          )}
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
            <section className="mb-10">
              <h2 className="text-xs font-light text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: '"Lora", serif', letterSpacing: '0.2em' }}>
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-normal text-gray-900 text-base" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>
                        {edu.degree}
                      </h3>
                      <p className="text-gray-500 text-sm font-light italic" style={{ fontFamily: '"Lora", serif' }}>{edu.school || edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-light" style={{ fontFamily: '"Lora", serif' }}>{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-light text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: '"Lora", serif', letterSpacing: '0.2em' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 text-gray-600 text-xs border border-gray-200 font-light tracking-wide"
                    style={{ fontFamily: '"Lora", serif', letterSpacing: '0.1em' }}
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-light text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: '"Lora", serif', letterSpacing: '0.2em' }}>
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
                  <h3 className="font-normal text-gray-900 text-base mb-2" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed" style={{ fontFamily: '"Lora", serif', lineHeight: '1.8' }}>{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-gray-400 font-light" style={{ fontFamily: '"Lora", serif' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-light text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: '"Lora", serif', letterSpacing: '0.2em' }}>
                Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-normal text-gray-900 text-sm" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-gray-600 text-xs" style={{ fontFamily: '"Lora", serif' }}>
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {cert.date && <p>{cert.date}</p>}
                      {cert.expirationDate && (
                        <p className="italic">Expires {cert.expirationDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      );
    }

    // Creative Designer Template - Bold and artistic with gradient side bar
    if (templateId === 'creative-designer') {
      return (
        <div className="bg-white p-8 shadow-lg mx-auto relative overflow-hidden" style={{ maxWidth: '850px', minHeight: '1100px' }}>
          {/* Decorative side bar */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="ml-6">
            {resumeData.personalInfo && (
              <header className="mb-8 pb-6 border-b-4 border-indigo-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2" style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '-0.02em' }}>
                      {resumeData.personalInfo.fullName || 'Your Name'}
                    </h1>
                    {resumeData.personalInfo.title && (
                      <p className="text-lg text-indigo-700 font-semibold mb-4" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                        {resumeData.personalInfo.title}
                      </p>
                    )}
                  </div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    {(resumeData.personalInfo.fullName || 'Y').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4 font-medium" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  {resumeData.personalInfo.email && <span className="flex items-center gap-1"><span className="text-indigo-500">✉</span> {resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span className="flex items-center gap-1"><span className="text-purple-500">📱</span> {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span className="flex items-center gap-1"><span className="text-pink-500">📍</span> {resumeData.personalInfo.location}</span>}
                  {resumeData.personalInfo.linkedin && <span className="flex items-center gap-1"><span className="text-indigo-500">🔗</span> {resumeData.personalInfo.linkedin}</span>}
                </div>
              </header>
            )}

            {resumeData.summary && (
              <section className="mb-8">
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif', color: getHeadingTextColor(formatting.colors) }}>
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getAccentColor(formatting.colors) }}></span>
                  Professional Summary
                </h2>
                <p className="leading-relaxed pl-5 border-l-2" style={{ fontFamily: '"Open Sans", sans-serif', color: getPrimaryTextColor(formatting.colors), borderColor: getAccentColor(formatting.colors) + '33' }}>
                  {resumeData.summary}
                </p>
              </section>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif', color: getHeadingTextColor(formatting.colors) }}>
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getAccentColor(formatting.colors) }}></span>
                  Work Experience
                </h2>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-5 pl-5 border-l-2 relative" style={{ borderColor: getAccentColor(formatting.colors) + '33' }}>
                    <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: getAccentColor(formatting.colors) }}></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg mb-1" style={{ fontFamily: '"Montserrat", sans-serif', color: getHeadingTextColor(formatting.colors) }}>
                          {exp.position}
                        </h3>
                        <p className="font-semibold" style={{ fontFamily: '"Montserrat", sans-serif', color: getAccentColor(formatting.colors) }}>{exp.company}</p>
                      </div>
                      <span className="text-sm font-medium px-2 py-1 rounded" style={{ color: getPrimaryTextColor(formatting.colors), backgroundColor: getAccentColor(formatting.colors) + '1A' }}>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.description && (
                      <ul className="mt-2 space-y-1" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                        {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                          <li
                            key={i}
                            className="pl-5 relative"
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              lineHeight: getLineSpacing(formatting.lineSpacing),
                              fontSize: getFontSize(formatting.fontSize, '0.875rem'),
                              color: getPrimaryTextColor(formatting.colors)
                            }}
                          >
                            {formatting.bulletStyle !== 'number' && (
                              <span className="absolute left-0" style={{ color: getAccentColor(formatting.colors) }}>{getBulletChar(formatting.bulletStyle)}</span>
                            )}
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
              <section className="mb-8">
                <h2 className="text-lg font-bold text-indigo-600 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full mr-2"></span>
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-4 pl-5 border-l-2 border-pink-200 relative">
                    <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 border-2 border-white"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                          {edu.degree}
                        </h3>
                        <p className="text-indigo-600 font-semibold" style={{ fontFamily: '"Montserrat", sans-serif' }}>{edu.school || edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">{edu.graduationDate}</span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {resumeData.skills && resumeData.skills.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-indigo-600 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></span>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-900 rounded-full text-sm font-semibold border border-indigo-200"
                      style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {resumeData.projects && resumeData.projects.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-indigo-600 mb-4 uppercase tracking-wider" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
                  Projects
                </h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 text-base mb-2" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-700 text-sm mt-1 leading-relaxed" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.technologies.map((tech: string, i: number) => (
                          <span key={i} className="text-xs text-purple-700 bg-white px-2 py-1 rounded border border-purple-200 font-semibold" style={{ fontFamily: '"Montserrat", sans-serif' }}>
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
                  <ul className="mt-2 space-y-1" style={{ listStyleType: formatting.bulletStyle === 'number' ? 'decimal' : 'none' }}>
                    {exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                      <li
                        key={i}
                        className="text-gray-700 pl-5 relative"
                        style={{
                          lineHeight: getLineSpacing(formatting.lineSpacing),
                          fontSize: getFontSize(formatting.fontSize, '0.875rem')
                        }}
                      >
                        {formatting.bulletStyle !== 'number' && (
                          <span className="absolute left-0">{getBulletChar(formatting.bulletStyle)}</span>
                        )}
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

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                    {cert.issuer && (
                      <p className="text-gray-600 text-xs">{cert.issuer}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {cert.date && <p>{cert.date}</p>}
                    {cert.expirationDate && (
                      <p className="italic">Expires {cert.expirationDate}</p>
                    )}
                  </div>
                </div>
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