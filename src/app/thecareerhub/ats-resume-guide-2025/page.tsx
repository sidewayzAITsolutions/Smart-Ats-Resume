import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, XCircle, Zap, Download, ArrowRight } from 'lucide-react';

import { getSEOMetadata } from '@/lib/seo-config';

const seo = getSEOMetadata('ats-resume-guide-2025');

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: seo.url },
};

export default function ATSResumeGuidePage() {
  return (
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
            <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-medium">
              Resume Tips
            </span>
            <span className="text-gray-500 text-sm">• 10 min read</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            The Ultimate 2025 ATS Resume Guide
            <span className="block text-amber-400 text-2xl md:text-3xl mt-2">How to Pass Automated Resume Filters</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Over 75% of resumes get rejected automatically — not because the applicant is unqualified, but because the resume isn't formatted correctly for ATS systems.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
          
          {/* What is ATS */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-400" />
              What Is an ATS Resume?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              An ATS resume is a resume written and formatted specifically to be read by Applicant Tracking Systems — software used by employers to filter, rank, and select candidates before a human ever reviews them.
            </p>
            <p className="text-gray-300 leading-relaxed">
              If your resume doesn't align with ATS rules, you get filtered out instantly.
            </p>
          </section>

          {/* How ATS Reads */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">How ATS Systems Read Your Resume</h2>
            <p className="text-gray-300 mb-6">ATS software scans your resume for:</p>
            
            <div className="grid gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-teal-300 mb-2">1. Keywords</h3>
                <p className="text-gray-400">ATS looks for skills, tools, technologies, and verbs from the job description.</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-teal-300 mb-2">2. Job Titles</h3>
                <p className="text-gray-400">If your title doesn't match the posting, you lose ranking.</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-teal-300 mb-2">3. Section Headings</h3>
                <p className="text-gray-400">ATS understands: Experience, Work History, Education, Skills, Projects</p>
                <p className="text-red-400 text-sm mt-2">But NOT: "My Journey", "What I've Done", "Expertise Track"</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-teal-300 mb-2">4. Formatting Structure</h3>
                <p className="text-gray-400">Tables, icons, text boxes, and fancy designs confuse ATS.</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Common ATS Resume Mistakes (That Get You Rejected)</h2>
            <div className="space-y-4">
              {[
                { mistake: 'Two-column layouts', reason: 'ATS reads left-to-right. Two columns scramble the order.' },
                { mistake: 'Headers and footers', reason: 'ATS often ignores anything inside them.' },
                { mistake: 'Icons and graphics', reason: 'Your résumé might look beautiful to humans, but unreadable to machines.' },
                { mistake: '"Fluff" words', reason: 'Responsible for…, Worked on…, Helped with… — ATS prefers clear action verbs.' },
                { mistake: 'Missing keywords', reason: 'This is the MOST common rejection reason.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-950/30 border border-red-900/50 rounded-lg p-4">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-red-300">{item.mistake}</span>
                    <p className="text-gray-400 text-sm mt-1">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How to Make ATS-Friendly */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">How to Make Your Resume ATS-Friendly in 2025</h2>
            
            <div className="space-y-6">
              <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  1. Use a simple, single-column layout
                </h3>
                <p className="text-gray-300 mb-2">Preferred fonts:</p>
                <div className="flex flex-wrap gap-2">
                  {['Inter', 'Arial', 'Helvetica', 'Calibri', 'Roboto'].map(font => (
                    <span key={font} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">{font}</span>
                  ))}
                </div>
              </div>

              <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  2. Use standard section headings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-400 text-sm mb-2">✔ Good:</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>Skills</li>
                      <li>Experience</li>
                      <li>Projects</li>
                      <li>Education</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-400 text-sm mb-2">✘ Bad:</p>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>What I'm Great At</li>
                      <li>Highlights</li>
                      <li>Journey</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  3. Add job-specific keywords
                </h3>
                <p className="text-gray-300 mb-3">ATS literally looks for exact match keywords from the job description.</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Example job description: "Proficient in Excel, SQL, dashboards, reporting…"</p>
                  <p className="text-amber-300 text-sm">Your resume MUST include: Excel, SQL, Dashboards, Reporting</p>
                </div>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-200 text-sm">
                    💡 <strong>Pro tip:</strong> Not sure which keywords you're missing? 
                    <Link href="/resume-checker" className="text-amber-400 underline hover:text-amber-300 ml-1">
                      Try our free ATS Resume Checker
                    </Link> to instantly see your keyword match score.
                  </p>
                </div>
              </div>

              <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  4. Use strong action verbs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Executed', 'Led', 'Delivered', 'Developed', 'Implemented', 'Optimized'].map(verb => (
                    <span key={verb} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">{verb}</span>
                  ))}
                </div>
              </div>

              <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  5. Include metrics
                </h3>
                <div className="space-y-3">
                  <div className="bg-red-950/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm">Before: "Improved customer satisfaction."</p>
                  </div>
                  <div className="bg-green-950/30 rounded-lg p-3">
                    <p className="text-green-300 text-sm">After: "Increased satisfaction scores by 21% through improved support workflows."</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Before/After Example */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">ATS Resume Before/After Example</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6">
                <h3 className="text-red-400 font-semibold mb-4">Before (Weak):</h3>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>• Worked on backend systems</li>
                  <li>• Helped with testing</li>
                  <li>• Wrote some documentation</li>
                </ul>
              </div>
              <div className="bg-green-950/20 border border-green-700/50 rounded-xl p-6">
                <h3 className="text-green-400 font-semibold mb-4">After (ATS-Optimized):</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Developed backend APIs using Node.js and PostgreSQL, improving system performance by 19%</li>
                  <li>• Executed automated testing using Jest and Cypress, reducing bugs by 32%</li>
                  <li>• Created technical documentation supporting new engineering hires</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-3">Want to transform your resume bullets like this?</p>
              <Link 
                href="/builder" 
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors"
              >
                Build your ATS-optimized resume now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Final Checklist */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Final Checklist</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Single column',
                  'No icons',
                  'No images',
                  'Standard headings',
                  'Keyword optimized',
                  'Strong action verbs',
                  'Metrics included',
                  'Proper job title match',
                  'Saved as PDF',
                  'ATS tested'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-teal-400" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-teal-900/50 to-amber-900/50 border border-teal-500/30 rounded-2xl p-8 text-center">
            <Zap className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Test Your Resume Now</h2>
            <p className="text-gray-300 mb-6">
              Check your ATS score instantly. See keyword matches, formatting issues, and get improvement suggestions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/builder"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-semibold hover:from-teal-500 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
              >
                Check Your ATS Score
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/templates"
                className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Get ATS Templates
              </Link>
            </div>
          </section>

        </div>
      </article>
    </main>
  );
}
