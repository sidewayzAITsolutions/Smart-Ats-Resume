// src/components/Builder/ResumeEditor.tsx
'use client';

import React from 'react';
import PersonalInfoForm from '../ResumeBuilder/PersonalInfoForm';
import ExperienceForm from '../ResumeBuilder/ExperienceForm';
import EducationForm from '../ResumeBuilder/EducationForm';
import SkillsForm from '../ResumeBuilder/SkillsForm';
import ProjectsForm from './sections/ProjectsForm';
import CertificationsForm from './sections/CertificationsForm';
import SummaryForm from './sections/SummaryForm';
import { ResumeData } from '@/types/resume';

interface ResumeEditorProps {
  activeSection: string;
  resumeData: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
}

export default function ResumeEditor({
  activeSection,
  resumeData,
  onUpdate,
}: ResumeEditorProps) {
  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <PersonalInfoForm
              data={resumeData.personalInfo || {}}
              onChange={(personalInfo) => onUpdate({ personalInfo })}
            />
          </div>
        );

      case 'summary':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Professional Summary
            </h2>
            <SummaryForm
              data={resumeData.summary || ''}
              onChange={(summary) => onUpdate({ summary })}
              jobTitle={resumeData.personalInfo?.title}
            />
          </div>
        );

      case 'experience':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Work Experience
            </h2>
            <ExperienceForm
              experiences={resumeData.experience || []}
              onChange={(experience) => onUpdate({ experience })}
            />
          </div>
        );

      case 'education':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Education
            </h2>
            <EducationForm
              education={resumeData.education || []}
              onChange={(education) => onUpdate({ education })}
            />
          </div>
        );

      case 'skills':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Skills
            </h2>
            <SkillsForm
              skills={resumeData.skills || []}
              onChange={(skills) => onUpdate({ skills })}
            />
          </div>
        );

      case 'projects':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Certifications
            </h2>
            <CertificationsForm
              certifications={resumeData.certifications || []}
              onChange={(certifications) => onUpdate({ certifications })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {renderSection()}
    </div>
  );
}