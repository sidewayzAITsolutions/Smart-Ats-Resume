// src/components/Builder/BuilderSidebar.tsx
'use client';

import React from 'react';

import {
  Award,
  Briefcase,
  CheckCircle2,
  Circle,
  Code,
  FileText,
  FolderOpen,
  GraduationCap,
  User,
} from 'lucide-react';

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

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
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Progress Indicator */}
      <div className="p-6 border-b border-gray-700">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Completion</span>
          <span className="text-sm font-semibold text-teal-400">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-teal-500 to-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
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
                'hover:bg-gray-700/50',
                isActive && 'bg-gradient-to-r from-teal-900/50 to-amber-900/50 border-r-2 border-teal-500'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive ? 'text-teal-400' : 'text-gray-500'
                )}
              />
              <span
                className={cn(
                  'flex-1 text-sm font-medium',
                  isActive ? 'text-teal-300' : 'text-gray-300'
                )}
              >
                {section.label}
              </span>
              {section.required && (
                isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-600" />
                )
              )}
            </button>
          );
        })}
      </nav>

      {/* Smart Ass Donkey Section */}
      <div className="p-6 border-t border-gray-700">
        <div className="flex justify-center mb-4">
          <img
            src="/Donkey.png"
            alt="Smart ATS Donkey"
            className="w-32 h-32 object-contain opacity-80"
          />
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-teal-900/30 to-amber-900/30 border border-teal-700/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-teal-300 mb-1">
            Pro Tip
          </h4>
          <p className="text-xs text-gray-400">
            Use action verbs and quantify your achievements to improve your ATS score.
          </p>
        </div>
      </div>
    </div>
  );
}