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
  isSaving: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export default function BuilderToolbar({
  onSave,
  onExport,
  onImport,
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

  const handleATSCheck = () => {
    // Open ATS analysis modal
    // This will be implemented with the ATS scoring engine
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Resume Builder
          </h1>

          {/* Save Status */}
          {isSaving ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="h-2 w-2 bg-green-600 rounded-full" />
              <span>All changes saved</span>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* ATS Score Button */}
          <button type="button"
            onClick={handleATSCheck}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Check ATS Score
          </button>

          {/* Import Resume */}
          <button type="button"
            onClick={onImport}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
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
                ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            Save
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={isExporting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('docx')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as DOCX
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as TXT
                </button>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </header>
  );
}