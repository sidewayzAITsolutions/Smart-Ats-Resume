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
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm shadow-lg px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="SmartATS Logo" 
              className="h-10 w-10 rounded-lg transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white tracking-tight">
                SmartATS
              </h1>
              <span className="text-xs text-gray-400 font-light">Resume Builder</span>
            </div>
          </Link>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-700"></div>

          {/* Navigation shortcuts */}
          <div className="flex items-center gap-2">
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

          {/* Save Status */}
          {isSaving ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 ml-4">
              <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-400 ml-4">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-medium">All changes saved</span>
            </div>
          )}
        </div>

  {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* ATS Score Button */}
          <button type="button"
            onClick={onCheckATS}
            className="px-4 py-2 text-sm font-semibold text-teal-300 bg-gradient-to-r from-teal-900/60 to-teal-800/60 border border-teal-600/50 rounded-lg hover:from-teal-800/80 hover:to-teal-700/80 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-teal-900/20 backdrop-blur-sm"
          >
            <Zap className="h-4 w-4" />
            Check ATS Score
          </button>

          {/* Import from LinkedIn */}
          <button type="button"
            onClick={onImportLinkedIn}
            className="px-4 py-2 text-sm font-medium text-amber-300 bg-gradient-to-r from-amber-900/60 to-amber-800/60 border border-amber-700/50 rounded-lg hover:from-amber-800/80 hover:to-amber-700/80 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
          >
            <FileText className="h-4 w-4" />
            Import LinkedIn PDF
          </button>

          {/* Import Resume (file) */}
          <button type="button"
            onClick={onImport}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
          >
            <FileText className="h-4 w-4" />
            Import Resume
          </button>

          {/* Preview Toggle */}
          <button
            onClick={onTogglePreview}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm',
              showPreview
                ? 'text-gray-300 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50'
                : 'text-gray-400 bg-gray-800/30 border border-gray-700/30 hover:bg-gray-700/30'
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
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <Save className="h-4 w-4" />
            Save
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={isExporting}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 via-teal-500 to-amber-600 rounded-lg hover:from-teal-500 hover:via-teal-400 hover:to-amber-500 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/30"
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
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </header>
  );
}