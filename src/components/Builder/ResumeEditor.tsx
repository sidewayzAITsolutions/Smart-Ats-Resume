// src/components/Builder/ResumeEditor.tsx
'use client';

import React from 'react';

import {
  CertificationsForm,
  ProjectsForm,
  SummaryForm,
} from '@/hooks/ProjectsForm';
import KeywordsForm from './sections/KeywordsForm';
import { ResumeData } from '@/types/resume';

import EducationForm from '../ResumeBuilder/EducationForm';
import ExperienceForm from '../ResumeBuilder/ExperienceForm';
import PersonalInfoForm from '../ResumeBuilder/PersonalInfoForm';
import SkillsForm from '../ResumeBuilder/SkillsForm';
import FormattingToolbar from './FormattingToolbar';

interface ResumeEditorProps {
  activeSection: string;
  resumeData: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  isPremium: boolean;
}

export default function ResumeEditor({
  activeSection,
  resumeData,
  onUpdate,
  isPremium,
}: ResumeEditorProps) {
  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Personal Information
            </h2>
            <PersonalInfoForm
              initialData={(resumeData.personalInfo as any) || { fullName: '', email: '' }}
              onUpdate={(personalInfo) => onUpdate({ personalInfo })}
            />
          </div>
        );

      case 'summary':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Professional Summary
            </h2>
            <SummaryForm
              data={resumeData.summary || ''}
              onChange={(summary) => onUpdate({ summary })}
              jobTitle={resumeData.personalInfo?.title}
              isPremium={isPremium}
            />
          </div>
        );

      case 'experience':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Work Experience
            </h2>
            <ExperienceForm
              initialData={resumeData.experience || []}
              onUpdate={(experience) => onUpdate({ experience })}
              jobDescription={(resumeData as any).jobDescription || ''}
              isProUser={isPremium}
              onUpgradeClick={() => window.location.href = '/pricing'}
            />
          </div>
        );

      case 'education':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Education
            </h2>
            <EducationForm
              initialData={resumeData.education || []}
              onUpdate={(education) => onUpdate({ education })}
            />
          </div>
        );

      case 'skills':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Skills
            </h2>
            <SkillsForm
              initialData={resumeData.skills || []}
              onUpdate={(skills) => onUpdate({ skills })}
            />
          </div>
        );

      case 'keywords':
        return (
          <div>
            <KeywordsForm
              data={resumeData}
              onChange={onUpdate}
              isPremium={isPremium}
            />
          </div>
        );

      case 'projects':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Projects
            </h2>
            <ProjectsForm
              projects={resumeData.projects || []}
              onChange={(projects) => onUpdate({ projects })}
            />
          </div>
        );

      case 'certifications':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Certifications
            </h2>
            <CertificationsForm
              certifications={resumeData.certifications || []}
              onChange={(certifications) => onUpdate({ certifications })}
            />
          </div>
        );

      case 'formatting':
        return (
          <div>
            <h2 className="text-3xl font-bold text-lime-400 mb-6">
              Formatting Options
            </h2>
            <p className="text-gray-300 mb-6">
              Customize how your resume looks with different bullet styles, font sizes, and line spacing.
            </p>
            <FormattingToolbar
              options={resumeData.formattingOptions || { bulletStyle: 'bullet', fontSize: 'medium', lineSpacing: 'normal' }}
              onChange={(formattingOptions) => onUpdate({ formattingOptions })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
      {renderSection()}
    </div>
  );
}