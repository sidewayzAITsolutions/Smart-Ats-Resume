// src/components/Builder/BuilderSidebar.tsx
'use client';

import React from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderOpen, 
  Award,
  FileText,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuilderSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  completionStatus: {
    personal: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects?: boolean;
    certifications?: boolean;
    summary?: boolean;
  };
}

const sections = [
  { id: 'personal', label: 'Personal Info', icon: User, required: true },
  { id: 'summary', label: 'Professional Summary', icon: FileText, required: false },
  { id: 'experience', label: 'Work Experience', icon: Briefcase, required: true },
  { id: 'education', label: 'Education', icon: GraduationCap, required: true },
  { id: 'skills', label: 'Skills', icon: Code, required: true },
  { id: 'projects', label: 'Projects', icon: FolderOpen, required: false },
  { id: 'certifications', label: 'Certifications', icon: Award, required: false },
];

export default function BuilderSidebar({
  activeSection,
  onSectionChange,
  completionStatus,
}: BuilderSidebarProps) {
  const getCompletionPercentage = () => {
    const requiredSections = sections.filter(s => s.required);
    const completedRequired = requiredSections.filter(
      s => completionStatus[s.id as keyof typeof completionStatus]
    ).length;
    return Math.round((completedRequired / requiredSections.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Progress Indicator */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Completion</span>
          <span className="text-sm font-semibold text-indigo-600">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Complete all required sections for the best ATS score
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isCompleted = completionStatus[section.id as keyof typeof completionStatus];
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                'w-full px-6 py-3 flex items-center gap-3 text-left transition-colors',
                'hover:bg-gray-50',
                isActive && 'bg-indigo-50 border-r-2 border-indigo-600'
              )}
            >
              <Icon 
                className={cn(
                  'h-5 w-5',
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'flex-1 text-sm font-medium',
                  isActive ? 'text-indigo-600' : 'text-gray-700'
                )}
              >
                {section.label}
              </span>
              {section.required && (
                isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )
              )}
            </button>
          );
        })}
      </nav>

      {/* Tips Section */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            Pro Tip
          </h4>
          <p className="text-xs text-blue-700">
            Use action verbs and quantify your achievements to improve your ATS score.
          </p>
        </div>
      </div>
    </div>
  );
}