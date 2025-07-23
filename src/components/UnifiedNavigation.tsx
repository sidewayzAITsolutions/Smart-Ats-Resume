// components/UnifiedNavigation.tsx
import React from 'react';
import { Download, Eye, Save, Check } from 'lucide-react';
import Link from 'next/link';
import UserDropdown from './UserDropdown';

interface UnifiedNavigationProps {
  resumeName?: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  onPreview?: () => void;
  onExportPDF?: () => void;
  userData?: any;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  resumeName = 'Untitled Resume',
  saveStatus = 'saved',
  onPreview,
  onExportPDF,
  userData
}) => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-full">
        {/* Logo on far left */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <img src="/horse-logo.png" alt="SmartATS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
                SmartATS
              </div>
            </div>
          </Link>
        </div>

        {/* Center - Resume Name and Save Status */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 font-medium">{resumeName}</span>
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </div>
            )}
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                <span>Saving...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right - Action Buttons and User Dropdown */}
        <div className="flex items-center gap-4">
          {onPreview && (
            <button
              onClick={onPreview}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-sm hover:shadow-md"
              title="Preview Resume"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          )}
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-sm hover:shadow-md"
              title="Export as PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}

          {/* Separator */}
          <div className="w-px h-6 bg-gray-700"></div>

          {/* User Dropdown */}
          <UserDropdown userData={userData} />
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavigation;