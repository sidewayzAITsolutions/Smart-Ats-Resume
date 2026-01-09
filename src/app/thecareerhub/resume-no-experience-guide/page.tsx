'use client';

import Link from 'next/link';
import { ArrowLeft, GraduationCap, CheckCircle, Lightbulb, ArrowRight, Zap, FileText } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { getSEOMetadata } from '@/lib/seo-config';

export default function ResumeNoExperiencePage() {
  const seoData = getSEOMetadata('resume-no-experience-guide');
  
  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        url={seoData.url}
      />
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative py-16 border-b border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Link 
            href="/thecareerhub" 
            className="inline-flex items-center text-amber-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Career Hub
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-medium">
              Student Guide
            </span>
            <span className="text-gray-500 text-sm">• 8 min read</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            How to Write a Resume With No Experience
            <span className="block text-emerald-400 text-2xl md:text-3xl mt-2">2025 Student & Beginner Guide</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Whether you're a student, recent graduate, or starting a new career path, you can create a powerful resume even with zero traditional work experience.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Use a Clean, ATS-Friendly Template
            </h2>
            <p className="text-gray-300 mb-4">For no-experience resumes, use this structure:</p>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <ol className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><span className="text-emerald-400">1.</span> Summary</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">2.</span> Skills</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">3.</span> Projects</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">4.</span> Education</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">5.</span> Experience (optional)</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">6.</span> Certifications</li>
              </ol>
              <p className="text-amber-400 text-sm mt-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Avoid fancy Canva designs — ATS can't read them.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Write a Strong Resume Summary
            </h2>
            
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Student Resume Summary
                </h3>
                <p className="text-gray-300 italic">
                  "Motivated and detail-oriented student with strong analytical, communication, and problem-solving skills. Experienced in completing academic projects involving research, collaboration, and data analysis. Seeking internship opportunities to contribute and learn."
                </p>
              </div>

              <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Career Changer Summary
                </h3>
                <p className="text-gray-300 italic">
                  "Dedicated professional transitioning into technology. Skilled in communication, organization, and fast learning. Completed hands-on projects demonstrating Python, SQL, and web development fundamentals."
                </p>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Build a Strong Skills Section
            </h2>
            <p className="text-gray-300 mb-4">Include 6–12 skills relevant to the job:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Communication', 'Customer Service', 'Microsoft Office', 'Google Sheets',
                'Time Management', 'Problem Solving', 'Basic SQL', 'Canva',
                'Social Media', 'Data Entry', 'Research', 'Teamwork'
              ].map(skill => (
                <span key={skill} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-amber-400 text-sm mt-4">
              Match these to the job description using keyword extraction.
            </p>
            
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-300 text-sm">
                <strong>💡 Pro Tip:</strong> Paste your resume and job description into our 
                <Link href="/resume-checker" className="underline hover:text-amber-200 mx-1">
                  free ATS checker
                </Link>
                to instantly see which keywords you're missing and which ones to add.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Add School Projects Instead of Work Experience
            </h2>
            <p className="text-gray-300 mb-4">ATS LOVES projects — they act like "experience."</p>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-amber-300 font-semibold mb-3">Project: Social Media Campaign (Class Assignment)</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Developed a 10-day posting strategy using Canva and analytics</li>
                  <li>• Increased engagement by 23% across sample accounts</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-amber-300 font-semibold mb-3">Project: Python Basics Assignment</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Built a calculator using Python functions and loops</li>
                  <li>• Demonstrated understanding of logic flow and debugging</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Convert Non-Work Experience Into Resume Bullets
            </h2>
            <p className="text-gray-300 mb-4">You HAVE experience — you just haven't written it correctly.</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-teal-300 font-semibold mb-2">Volunteer</h3>
                <p className="text-gray-400 text-sm">"Managed inventory and customer interactions at local donation center."</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-teal-300 font-semibold mb-2">Sports</h3>
                <p className="text-gray-400 text-sm">"Collaborated with teammates and maintained discipline through daily training."</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-teal-300 font-semibold mb-2">Clubs</h3>
                <p className="text-gray-400 text-sm">"Organized events attended by 50–100 students."</p>
              </div>
            </div>
          </section>

          {/* Step 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Use Strong Action Verbs
            </h2>
            <p className="text-gray-300 mb-4">Weak verbs = low ATS score. Use these instead:</p>
            <div className="flex flex-wrap gap-2">
              {['Led', 'Created', 'Coordinated', 'Analyzed', 'Designed', 'Managed', 'Supported', 'Improved'].map(verb => (
                <span key={verb} className="px-4 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-sm font-medium">
                  {verb}
                </span>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
              <p className="text-teal-300 text-sm">
                <strong>✨ Need help writing strong bullets?</strong> Our AI resume builder automatically suggests powerful action verbs and writes ATS-optimized bullet points for you.
                <Link href="/builder" className="underline hover:text-teal-200 ml-1">
                  Try the builder for free →
                </Link>
              </p>
            </div>
          </section>

          {/* Step 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">7</span>
              Format Your Resume for ATS
            </h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'No tables',
                  'No icons',
                  'Standard headings',
                  'Single-column',
                  '10–12 pt font',
                  'PDF format'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Build Your First Resume?</h2>
            <p className="text-gray-300 mb-6">
              Get a free no-experience resume template and AI-powered suggestions to make your resume stand out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/builder"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
              >
                Start Building Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/templates"
                className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700 transition-all"
              >
                Browse Templates
              </Link>
            </div>
          </section>

        </div>
      </article>
    </main>
    </>
  );
}
