// src/components/Builder/BuilderSidebar.tsx
'use client';

import React, { useState } from 'react';

import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code,
  FileText,
  FolderOpen,
  GraduationCap,
  Tag,
  User,
  Type,
  X,
  Menu,
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
  { id: 'personal', label: 'Personal Info', shortLabel: 'Personal', icon: User, required: true },
  { id: 'summary', label: 'Professional Summary', shortLabel: 'Summary', icon: FileText, required: false },
  { id: 'experience', label: 'Work Experience', shortLabel: 'Experience', icon: Briefcase, required: true },
  { id: 'education', label: 'Education', shortLabel: 'Education', icon: GraduationCap, required: true },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills', icon: Code, required: true },
  { id: 'keywords', label: 'ATS Keywords', shortLabel: 'Keywords', icon: Tag, required: false },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', icon: FolderOpen, required: false },
  { id: 'certifications', label: 'Certifications', shortLabel: 'Certs', icon: Award, required: false },
  { id: 'formatting', label: 'Formatting', shortLabel: 'Format', icon: Type, required: false },
];

export default function BuilderSidebar({
  activeSection,
  onSectionChange,
  completionStatus,
}: BuilderSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getCompletionPercentage = () => {
    const requiredSections = sections.filter(s => s.required);
    const completedRequired = requiredSections.filter(
      s => completionStatus[s.id as keyof typeof completionStatus]
    ).length;
    return Math.round((completedRequired / requiredSections.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  const currentSectionIndex = sections.findIndex(s => s.id === activeSection);
  const currentSection = sections[currentSectionIndex];
  
  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      onSectionChange(sections[currentSectionIndex - 1].id);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      onSectionChange(sections[currentSectionIndex + 1].id);
    }
  };

  return (
    <>
      {/* MOBILE: Bottom Navigation Bar - Streamlined and Easy */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 safe-area-inset-bottom">
        {/* Progress bar at top of mobile nav */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-1 bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        {/* Mobile Section Navigator */}
        <div className="flex items-center justify-between px-2 py-2">
          {/* Prev Button */}
          <button
            onClick={goToPrevSection}
            disabled={currentSectionIndex === 0}
            className={cn(
              "p-3 rounded-lg transition-colors",
              currentSectionIndex === 0 
                ? "text-gray-600" 
                : "text-gray-300 hover:bg-gray-800 active:bg-gray-700"
            )}
            aria-label="Previous section"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Current Section Display - Tappable for menu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex-1 mx-2 py-2 px-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center gap-3 active:bg-gray-700 transition-colors"
          >
            {currentSection && (
              <>
                <currentSection.icon className="h-5 w-5 text-teal-400" />
                <span className="text-sm font-medium text-white">{currentSection.shortLabel}</span>
                <span className="text-xs text-gray-400 ml-1">
                  {currentSectionIndex + 1}/{sections.length}
                </span>
                {currentSection.required && (
                  completionStatus[currentSection.id as keyof typeof completionStatus] ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-amber-500" />
                  )
                )}
              </>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={goToNextSection}
            disabled={currentSectionIndex === sections.length - 1}
            className={cn(
              "p-3 rounded-lg transition-colors",
              currentSectionIndex === sections.length - 1 
                ? "text-gray-600" 
                : "text-gray-300 hover:bg-gray-800 active:bg-gray-700"
            )}
            aria-label="Next section"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Section Picker */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-gray-900/95 backdrop-blur-sm flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-white">Resume Sections</h2>
              <p className="text-sm text-gray-400">{completionPercentage}% complete</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-3 shrink-0">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Section List - Grid in landscape, list in portrait */}
          <div className="flex-1 overflow-y-auto pb-4 min-h-0">
            <div className="p-2 grid grid-cols-1 landscape:grid-cols-2 landscape:sm:grid-cols-3 gap-2">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isCompleted = completionStatus[section.id as keyof typeof completionStatus];
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={cn(
                      'w-full p-3 landscape:p-2 rounded-xl flex items-center gap-3 transition-all',
                      isActive 
                        ? 'bg-gradient-to-r from-teal-900/60 to-amber-900/60 border border-teal-500/50' 
                        : 'bg-gray-800/50 border border-gray-700/50 active:bg-gray-700'
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 landscape:w-8 landscape:h-8 rounded-lg flex items-center justify-center shrink-0",
                      isActive ? "bg-teal-500/20" : "bg-gray-700"
                    )}>
                      <Icon className={cn(
                        'h-4 w-4',
                        isActive ? 'text-teal-400' : 'text-gray-400'
                      )} />
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'font-medium text-sm truncate',
                          isActive ? 'text-white' : 'text-gray-300'
                        )}>
                          {section.shortLabel}
                        </span>
                        {section.required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 font-medium shrink-0">
                            Req
                          </span>
                        )}
                      </div>
                    </div>

                    {section.required && (
                      isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-600 shrink-0" />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP: Original Sidebar - Hidden on Mobile */}
      <div className="hidden lg:flex w-64 bg-gray-800 border-r border-gray-700 flex-col">
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
                onClick={() => handleSectionChange(section.id)}
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

        {/* Smart Ass Donkey Section - Desktop only */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Smart ATS Donkey"
              className="w-48 h-72 object-contain opacity-80"
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
    </>
  );
}