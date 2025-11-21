// src/components/Builder/BuilderToolbar.tsx
'use client';

import React, { useState } from 'react';

import {
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Save,
  Share2,
  Zap,
} from 'lucide-react';

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

interface BuilderToolbarProps {
  onSave: () => Promise<void>;
  onExport: () => Promise<void>;
  onImport: () => void;
  onImportLinkedIn: () => void;
  onCheckATS: () => void;
  isSaving: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export default function BuilderToolbar({
  onSave,
  onExport,
  onImport,
  onImportLinkedIn,
  onCheckATS,
  isSaving,
  showPreview,
  onTogglePreview,
}: BuilderToolbarProps) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
    setIsExporting(true);
    setExportMenuOpen(false);
    try {
      // Export logic will be handled by parent component
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">
            Resume Builder
          </h1>

          {/* Save Status */}
          {isSaving ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <div className="h-2 w-2 bg-green-400 rounded-full" />
              <span>All changes saved</span>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* ATS Score Button */}
          <button type="button"
            onClick={onCheckATS}
            className="px-4 py-2 text-sm font-medium text-teal-300 bg-teal-900/50 border border-teal-700/50 rounded-lg hover:bg-teal-900/70 transition-colors flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Check ATS Score
          </button>

          {/* Import from LinkedIn */}
          <button type="button"
            onClick={onImportLinkedIn}
            className="px-4 py-2 text-sm font-medium text-amber-300 bg-amber-900/50 border border-amber-700/50 rounded-lg hover:bg-amber-900/70 transition-colors flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Import LinkedIn PDF
          </button>

          {/* Import Resume (file) */}
          <button type="button"
            onClick={onImport}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Import Resume
          </button>

          {/* Preview Toggle */}
          <button
            onClick={onTogglePreview}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
              showPreview
                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                : 'text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700'
            )}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Preview
              </>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            Save
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={isExporting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-amber-600 rounded-lg hover:from-teal-500 hover:to-amber-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-10">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('docx')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as DOCX
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as TXT
                </button>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </header>
  );
}