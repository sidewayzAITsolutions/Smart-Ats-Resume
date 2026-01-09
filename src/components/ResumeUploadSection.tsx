'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ATSScoreResult {
  overall: number;
  breakdown: {
    keywords: number;
    formatting: number;
    content: number;
    completeness: number;
  };
  issues: string[];
  suggestions: string[];
  passRate: 'high' | 'medium' | 'low';
}

export default function ResumeUploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('document') && !file.type.includes('word')) {
      setError('Please upload a PDF or Word document (.pdf, .docx, .doc)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setIsLoading(true);
    setUploadedFileName(file.name);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Call parse-resume API
      const parseResponse = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const parseData = await parseResponse.json();

      if (!parseResponse.ok || !parseData.success) {
        throw new Error(parseData.error || 'Failed to parse resume');
      }

      if (!parseData.parsedText) {
        throw new Error('Failed to extract resume content');
      }

      // Call ATS scoring endpoint (or use client-side scoring)
      const scoringResponse = await fetch('/api/score-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          parsedText: parseData.parsedText,
          metadata: { fileType: parseData.fileType } 
        }),
      });

      if (!scoringResponse.ok) {
        // Fallback to basic scoring if endpoint not available
        const basicScore = calculateBasicScore(parseData.data.text);
        setAtsScore(basicScore);
      } else {
        const scoreData = await scoringResponse.json();
        setAtsScore(scoreData.score);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your resume';
      setError(errorMessage);
      setAtsScore(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgGradient = (score: number) => {
    if (score >= 85) return 'from-green-900/50 to-emerald-900/50 border-green-700/50';
    if (score >= 70) return 'from-amber-900/50 to-orange-900/50 border-amber-700/50';
    return 'from-red-900/50 to-orange-900/50 border-red-700/50';
  };

  const getPassRateIcon = (passRate: string) => {
    return passRate === 'high' ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-amber-400" />
    );
  };

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/10 via-transparent to-amber-950/10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Instant ATS Analysis</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Check Your ATS Score in Seconds
          </h2>
          <p className="text-lg text-gray-300">
            Upload your resume and get instant feedback on how ATS systems will read it. No signup required.
          </p>
        </div>

        {/* Upload Area */}
        {!atsScore && !isLoading && (
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
              isDragging
                ? 'border-teal-400 bg-teal-500/10 scale-[1.02]'
                : 'border-gray-600 bg-gray-800/30 hover:border-teal-400 hover:bg-teal-500/5'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-teal-500 opacity-20 animate-ping"></div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
              </h3>
              <p className="text-gray-400 mb-6">
                or click to browse (PDF, DOCX, DOC up to 10MB)
              </p>

              <button className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg font-semibold hover:from-teal-500 hover:to-teal-400 transition-all transform hover:scale-105">
                Choose File
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-teal-400 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Analyzing your resume...
            </h3>
            <p className="text-gray-400">
              We're checking your ATS compatibility. This won't take long!
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-950/30 border border-red-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-300 mb-1">Upload Error</h3>
                <p className="text-red-200">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fileInputRef.current?.click();
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Score Display */}
        {atsScore && (
          <div className="animate-fade-in-up">
            {/* Main Score Card */}
            <div className={`bg-gradient-to-br ${getScoreBgGradient(atsScore.overall)} border rounded-2xl p-8 mb-8`}>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-gray-400 text-sm mb-2">ATS Score for {uploadedFileName}</p>
                  <div className="flex items-baseline gap-2">
                    <div className={`text-6xl font-bold ${getScoreColor(atsScore.overall)}`}>
                      {atsScore.overall}
                    </div>
                    <span className="text-gray-400 text-2xl">/100</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg relative">
                  <div className="blur-sm select-none flex items-center gap-2">
                    {getPassRateIcon(atsScore.passRate)}
                    <span className={`text-sm font-semibold ${
                      atsScore.passRate === 'high' ? 'text-green-300' : 'text-amber-300'
                    }`}>
                      {atsScore.passRate === 'high' ? 'Excellent' : atsScore.passRate === 'medium' ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Keywords', score: atsScore.breakdown.keywords },
                  { label: 'Formatting', score: atsScore.breakdown.formatting },
                  { label: 'Content', score: atsScore.breakdown.content },
                  { label: 'Completeness', score: atsScore.breakdown.completeness },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 rounded-lg p-4 relative">
                    <div className="text-sm text-gray-400 mb-2">{item.label}</div>
                    <div className="text-2xl font-bold text-gray-200 blur-sm select-none">{item.score}</div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden blur-sm">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-amber-500"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues and Suggestions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Issues */}
              {atsScore.issues.length > 0 && (
                <div className="bg-red-950/30 border border-red-700/50 rounded-xl p-6 relative">
                  <div className="blur-sm select-none">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <h3 className="font-semibold text-red-300">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-3">
                      {atsScore.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-red-200 text-sm">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700">
                      <span className="text-gray-300 text-sm font-medium">🔒 Premium Feature</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {atsScore.suggestions.length > 0 && (
                <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-6 relative">
                  <div className="blur-sm select-none">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-teal-400" />
                      <h3 className="font-semibold text-teal-300">Quick Fixes</h3>
                    </div>
                    <ul className="space-y-3">
                      {atsScore.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-teal-200 text-sm">
                          <span className="text-teal-400 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700">
                      <span className="text-gray-300 text-sm font-medium">🔒 Premium Feature</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setAtsScore(null);
                  setUploadedFileName(null);
                  fileInputRef.current?.click();
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Upload Another Resume
              </button>
              <Link
                href="/builder"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                Optimize in Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Basic client-side ATS scoring function (fallback)
function calculateBasicScore(resumeText: string): ATSScoreResult {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      overall: 0,
      breakdown: { keywords: 0, formatting: 0, content: 0, completeness: 0 },
      issues: ['Resume text could not be extracted'],
      suggestions: ['Try re-uploading your resume in a different format'],
      passRate: 'low',
    };
  }

  const text = resumeText.toLowerCase();
  let keywords = 50;
  let formatting = 60;
  let content = 50;
  let completeness = 60;

  // Score keywords
  const techKeywords = ['java', 'python', 'javascript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'api'];
  const foundKeywords = techKeywords.filter(kw => text.includes(kw)).length;
  keywords = Math.min(100, 50 + foundKeywords * 5);

  // Score content
  const actionVerbs = ['led', 'developed', 'managed', 'created', 'implemented', 'designed', 'optimized', 'executed', 'delivered'];
  const hasActionVerbs = actionVerbs.some(verb => text.includes(verb));
  const hasNumbers = /\d+%|\d+k|\d+m/i.test(text);
  content = (hasActionVerbs ? 70 : 50) + (hasNumbers ? 20 : 0);

  // Score completeness
  const sections = ['experience', 'education', 'skills', 'summary'].filter(section => text.includes(section)).length;
  completeness = 50 + sections * 12;

  // Score formatting
  const lines = resumeText.split('\n').length;
  formatting = lines > 5 ? 75 : 50;

  const overall = Math.round((keywords * 0.4 + formatting * 0.2 + content * 0.25 + completeness * 0.15));

  const issues: string[] = [];
  const suggestions: string[] = [];

  if (keywords < 70) {
    issues.push('Missing important technical keywords');
    suggestions.push('Add relevant skills and technologies from job descriptions');
  }

  if (content < 70) {
    issues.push('Lacks quantifiable achievements');
    suggestions.push('Include metrics and numbers to demonstrate impact');
  }

  if (completeness < 80) {
    issues.push('Some resume sections may be missing');
    suggestions.push('Ensure you have Experience, Education, and Skills sections');
  }

  return {
    overall,
    breakdown: {
      keywords: Math.min(100, keywords),
      formatting: Math.min(100, formatting),
      content: Math.min(100, content),
      completeness: Math.min(100, completeness),
    },
    issues: issues.length > 0 ? issues : ['Resume looks good overall'],
    suggestions: suggestions.length > 0 ? suggestions : ['Continue optimizing for better results'],
    passRate: overall >= 85 ? 'high' : overall >= 70 ? 'medium' : 'low',
  };
}
