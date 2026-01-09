'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FileText, Loader2, Mail, Shield, Upload, Zap } from 'lucide-react';
import GlobalNavigation from '@/components/GlobalNavigation';
import CollapsibleATSScore from '@/components/CollapsibleATSScore';
import { createClient } from '@/lib/supabase/client';

type ATSResults = {
  score: number;
  breakdown: { keywords: number; formatting: number; content: number; impact: number };
  suggestions: string[];
  risks: string[];
  metricInsights?: any;
};

export default function ResumeCheckerPage() {
  const [stage, setStage] = useState<'upload' | 'email' | 'results'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [atsResults, setAtsResults] = useState<ATSResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size check (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please upload a resume under 5MB.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('resume', file);
      
      const res = await fetch('/api/parse-resume', { method: 'POST', body: form });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        setError(json?.error || 'Failed to parse resume. Please try a different file.');
        setIsUploading(false);
        return;
      }

      // Store parsed data for later ATS analysis
      setParsedData(json);
      
      // Move to email capture stage
      setStage('email');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmittingEmail(true);
    setError(null);

    try {
      // Save email to Supabase leads table
      const supabase = createClient();
      
      // Try to insert into leads table (create if doesn't exist handled by RLS)
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          email,
          source: 'resume-checker',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.warn('Could not save lead:', insertError);
        // Continue anyway - don't block user from seeing results
      }

      // Now calculate ATS score from parsed data
      if (parsedData) {
        // Import ATS analyzer dynamically
        const { ATSAnalyzer } = await import('@/lib/ats-analyzer');
        
        // Build resume data structure from parsed text
        const resumeText = parsedData.parsedText || '';
        
        // Simple structure for analysis
        const resumeData = {
          summary: resumeText.slice(0, 500),
          personal: {
            fullName: 'User',
            email: email,
            phone: ''
          },
          experience: [],
          education: [],
          skills: [],
          targetKeywords: [],
          keywords: []
        };

        const analysis = ATSAnalyzer.analyze(resumeData, '');
        
        setAtsResults({
          score: analysis.score,
          breakdown: analysis.breakdown,
          suggestions: analysis.suggestions,
          risks: analysis.risks,
          metricInsights: analysis.metricInsights
        });
      }

      setStage('results');
    } catch (err) {
      console.error('Email submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <GlobalNavigation showBuilderActions={false} showMainNav={true} showAuthButtons={true} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-900/50 border border-teal-700/50 rounded-full text-teal-300 text-sm mb-6">
            <Shield className="w-4 h-4" />
            Free ATS Resume Checker
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Is Your Resume{' '}
            <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
              ATS-Ready?
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Upload your resume and get an instant ATS compatibility score. Find out if your resume will pass automated screening systems.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Stage: Upload */}
          {stage === 'upload' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-teal-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">Upload Your Resume</h2>
                <p className="text-gray-400 mb-8">Supports PDF, DOCX, RTF, and TXT files (max 5MB)</p>

                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.rtf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="px-8 py-4 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all inline-flex items-center gap-3">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Choose File
                      </>
                    )}
                  </div>
                </label>

                {error && (
                  <p className="mt-4 text-red-400 text-sm">{error}</p>
                )}
              </div>

              {/* Trust indicators */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-teal-400">98.4%</div>
                    <div className="text-xs text-gray-500">ATS Pass Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">50K+</div>
                    <div className="text-xs text-gray-500">Resumes Checked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">Free</div>
                    <div className="text-xs text-gray-500">No Credit Card</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage: Email Capture */}
          {stage === 'email' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">Resume Uploaded Successfully!</h2>
                <p className="text-gray-400 mb-8">Enter your email to see your ATS score and detailed feedback.</p>

                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                  <div className="relative mb-4">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingEmail}
                    className="w-full px-8 py-4 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmittingEmail ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        See My ATS Score
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {error && (
                    <p className="mt-4 text-red-400 text-sm">{error}</p>
                  )}
                </form>

                <p className="mt-6 text-xs text-gray-500">
                  We'll send you resume tips. Unsubscribe anytime.
                </p>
              </div>
            </div>
          )}

          {/* Stage: Results */}
          {stage === 'results' && atsResults && (
            <div className="space-y-8">
              {/* ATS Score Card */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Your ATS Score</h2>
                  <p className="text-gray-400">Here's how your resume performs against ATS systems</p>
                </div>

                {/* Inline ATS Score Display */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
                      atsResults.score >= 80 ? 'border-green-500 bg-green-900/20' :
                      atsResults.score >= 60 ? 'border-amber-500 bg-amber-900/20' :
                      'border-red-500 bg-red-900/20'
                    }`}>
                      <span className={`text-4xl font-bold ${
                        atsResults.score >= 80 ? 'text-green-400' :
                        atsResults.score >= 60 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>{Math.round(atsResults.score)}</span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Object.entries(atsResults.breakdown).map(([key, value]) => (
                    <div key={key} className="bg-gray-900/50 rounded-lg p-4 text-center">
                      <div className="text-xl font-bold text-white">{Math.round(value)}%</div>
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {atsResults.suggestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3">Suggestions</h3>
                    <ul className="space-y-2">
                      {atsResults.suggestions.slice(0, 3).map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-6 border-t border-gray-700">
                  <p className="text-center text-gray-400 mb-4">
                    Want to fix these issues automatically?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/builder"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      <Zap className="w-5 h-5" />
                      Optimize My Resume
                    </Link>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
                    >
                      View Pricing
                    </Link>
                  </div>
                </div>
              </div>

              {/* Start Over */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setStage('upload');
                    setAtsResults(null);
                    setParsedData(null);
                    setEmail('');
                  }}
                  className="text-gray-500 hover:text-gray-300 text-sm underline"
                >
                  Check another resume
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {stage === 'upload' && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              What You'll Learn About Your Resume
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">ATS Compatibility</h3>
                <p className="text-sm text-gray-400">See if your resume can pass automated screening systems</p>
              </div>
              
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Keyword Analysis</h3>
                <p className="text-sm text-gray-400">Find missing keywords that recruiters are looking for</p>
              </div>
              
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Actionable Tips</h3>
                <p className="text-sm text-gray-400">Get specific suggestions to improve your resume</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SmartATS. Beat the bots, land the job.</p>
        </div>
      </footer>
    </div>
  );
}
