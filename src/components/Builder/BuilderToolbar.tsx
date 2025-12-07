// src/components/Builder/BuilderToolbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  ChevronDown,
  Home,
  Download,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Save,
  Share2,
  Zap,
  Trash2,
} from 'lucide-react';

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

interface BuilderToolbarProps {
  onSave: () => Promise<void>;
  onExport: (format: 'pdf' | 'docx' | 'txt' | 'json') => Promise<void>;
  onImport: () => void;
  onImportLinkedIn: () => void;
  onGenerateLinkedIn?: () => Promise<void>;
  onCheckATS: () => void;
  onClear: () => void;
  isSaving: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export default function BuilderToolbar({
  onSave,
  onExport,
  onImport,
  onImportLinkedIn,
  onGenerateLinkedIn,
  onCheckATS,
  onClear,
  isSaving,
  showPreview,
  onTogglePreview,
}: BuilderToolbarProps) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = async (format: 'pdf' | 'docx' | 'txt' | 'json') => {
    setIsExporting(true);
    setExportMenuOpen(false);
    try {
      // Export logic will be handled by parent component
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    setShowClearConfirm(false);
    onClear();
  };


  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm shadow-lg px-3 sm:px-6 py-3 sm:py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <img
              src="/horse-logo.png"
              alt="SmartATS Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg transition-transform group-hover:scale-110 object-contain"
            />
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-bold text-white tracking-tight">
                SmartATS
              </h1>
              <span className="text-xs text-gray-400 font-light">Resume Builder</span>
            </div>
          </Link>

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block h-8 w-px bg-gray-700"></div>

          {/* Navigation shortcuts - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 hover:border-teal-500/50 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/templates"
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 hover:border-teal-500/50 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
            >
              <FileText className="h-4 w-4" />
              Templates
            </Link>
          </div>

          {/* Save Status - Only show when actively saving on desktop */}
          {isSaving && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 ml-4">
              <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
              <span>Saving...</span>
            </div>
          )}
        </div>

  {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* ATS Score Button */}
          <button type="button"
            onClick={onCheckATS}
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-teal-300 bg-gradient-to-r from-teal-900/60 to-teal-800/60 border border-teal-600/50 rounded-lg hover:from-teal-800/80 hover:to-teal-700/80 transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-lg shadow-teal-900/20 backdrop-blur-sm"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Check ATS Score</span>
            <span className="sm:hidden">ATS</span>
          </button>

          {/* Import from LinkedIn - Hidden on mobile */}
          <button type="button"
            onClick={onImportLinkedIn}
            className="hidden md:flex px-4 py-2 text-sm font-medium text-amber-300 bg-gradient-to-r from-amber-900/60 to-amber-800/60 border border-amber-700/50 rounded-lg hover:from-amber-800/80 hover:to-amber-700/80 transition-all duration-200 items-center gap-2 backdrop-blur-sm"
          >
            <FileText className="h-4 w-4" />
            Import LinkedIn PDF
          </button>

          {/* Generate LinkedIn 'About' - Hidden on mobile */}
          <button type="button"
            onClick={() => onGenerateLinkedIn?.()}
            className="hidden md:flex px-4 py-2 text-sm font-medium text-sky-200 bg-gradient-to-r from-sky-900/40 to-sky-700/40 border border-sky-600/50 rounded-lg hover:from-sky-800/60 hover:to-sky-600/60 transition-all duration-200 items-center gap-2 backdrop-blur-sm"
            title="Generate LinkedIn About"
          >
            <Share2 className="h-4 w-4" />
            Generate LinkedIn About
          </button>

          {/* Import Resume (file) - Hidden on mobile */}
          <button type="button"
            onClick={onImport}
            className="hidden md:flex px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200 items-center gap-2 backdrop-blur-sm"
          >
            <FileText className="h-4 w-4" />
            Import Resume
          </button>

          {/* Clear Resume Button */}
          <button type="button"
            onClick={() => setShowClearConfirm(true)}
            className="hidden md:flex px-4 py-2 text-sm font-medium text-red-300 bg-red-900/30 border border-red-700/50 rounded-lg hover:bg-red-800/40 hover:border-red-600 transition-all duration-200 items-center gap-2 backdrop-blur-sm"
            title="Clear resume and start fresh"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>

          {/* Preview Toggle */}
          <button
            onClick={onTogglePreview}
            className={cn(
              'px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 backdrop-blur-sm',
              showPreview
                ? 'text-gray-300 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50'
                : 'text-gray-400 bg-gray-800/30 border border-gray-700/30 hover:bg-gray-700/30'
            )}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden sm:inline">Hide Preview</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Show Preview</span>
              </>
            )}
          </button>

          {/* Save Button - Hidden on mobile (auto-save) */}
          <button
            onClick={onSave}
            disabled={isSaving}
            className="hidden sm:flex px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <Save className="h-4 w-4" />
            Save
          </button>

          {/* Export Dropdown */}
          <div className="relative z-[9999]">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={isExporting}
              className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 via-teal-500 to-amber-600 rounded-lg hover:from-teal-500 hover:via-teal-400 hover:to-amber-500 transition-all duration-200 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/30"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-[9999]">
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
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as JSON
                </button>
              </div>
            )}
          </div>

          {/* Share Button - Hidden on mobile */}
          <button
            className="hidden md:flex px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 items-center gap-2 backdrop-blur-sm"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Clear Resume?</h3>
            <p className="text-gray-400 mb-6">
              This will erase all your resume content and start with a blank slate. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-all duration-200"
              >
                Clear Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}