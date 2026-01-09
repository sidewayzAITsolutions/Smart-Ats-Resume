'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, XCircle, Zap, Target, Users, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative py-16 border-b border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-amber-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-sm font-medium">
              Founder's Story
            </span>
            <span className="text-gray-400 text-sm">15 min read</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Why I Built Smart ATS Resume
            <span className="block text-amber-400 text-2xl md:text-3xl mt-3">Fixing the Invisible Job Search Problem No One Talks About</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl">
            Applicant Tracking Systems (ATS) have become one of the biggest obstacles modern job seekers face. Yet most people have no idea how heavily these systems influence who gets seen, who gets rejected, and who gets hired.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              If you have ever applied to dozens of jobs and never heard back, there is a high chance an ATS filtered you out long before a human ever read your resume.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              <strong className="text-white">Smart ATS Resume was built specifically to solve this problem.</strong>
            </p>
            <p className="text-gray-400 leading-relaxed">
              This article walks through why ATS systems exist, how they impact job seekers, what the biggest resume failures are, and how Smart ATS Resume is designed to give applicants a fair chance. It also explains the technology behind the tool, the features, and the mission behind building a modern solution to an outdated, frustrating hiring pipeline.
            </p>
          </section>

          {/* The Hidden Reality */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="w-7 h-7 text-amber-400" />
              The Hidden Reality of Modern Hiring
            </h2>
            <p className="text-xl text-amber-300 font-medium mb-6">Most Resumes Are Never Seen by Humans</p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              When most people think of job applications, they imagine a recruiter or hiring manager reading through resumes manually. That reality hasn't existed for years. Over 90 percent of companies now use ATS platforms such as Workday, Taleo, Greenhouse, Lever, and iCIMS to manage applicants.
            </p>

            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-white mb-4">These systems automatically:</h3>
              <ul className="space-y-2">
                {[
                  'Parse resumes into machine-readable data',
                  'Analyze formatting and structure',
                  'Extract keywords',
                  'Compare resumes to job descriptions',
                  'Rank and filter candidates',
                  'Reject applicants automatically'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 mb-6">
              <p className="text-xl font-bold text-red-300 mb-2">
                Studies estimate that up to 75% of resumes never reach a human because of ATS filtering.
              </p>
              <p className="text-gray-400">
                This means a person can be fully qualified and still get rejected simply because their resume was not formatted or keyword-aligned correctly for the software reviewing it.
              </p>
            </div>

            <div className="text-center py-6">
              <p className="text-xl text-gray-300 italic">It's not fair.</p>
              <p className="text-xl text-gray-300 italic">It's not transparent.</p>
              <p className="text-xl text-gray-300 italic">And it leaves job seekers confused and discouraged.</p>
              <p className="text-xl text-amber-300 font-semibold mt-4">That's the core issue Smart ATS Resume was built to address.</p>
            </div>
          </section>

          {/* Why ATS Rejects */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <XCircle className="w-7 h-7 text-red-400" />
              Why ATS Systems Reject Qualified Candidates
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Most people believe they need to make their resume visually appealing. Ironically, this is one of the fastest ways to get rejected by ATS software. ATS systems are designed to read plain, structured text. They often fail when resumes include:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                'Complex formatting',
                'Columns',
                'Tables',
                'Infographics',
                'Icons',
                'Decorative fonts',
                'Unrecognized headings',
                'Unscannable layouts',
                'PDF compression issues'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
              <p className="text-lg text-amber-300 font-semibold mb-3">
                ATS software does not interpret design. It interprets raw text.
              </p>
              <p className="text-gray-300">That means:</p>
              <ul className="mt-3 space-y-2">
                <li className="text-gray-300">• A beautiful resume can fail.</li>
                <li className="text-gray-300">• A well-written resume can be misread.</li>
                <li className="text-gray-300">• A perfectly qualified applicant can be filtered out automatically.</li>
              </ul>
            </div>

            <p className="text-gray-400 leading-relaxed">
              And because companies rarely communicate ATS-based rejections, applicants often assume they weren't qualified—when in reality, their resume simply wasn't ATS-compatible.
            </p>
            <p className="text-amber-300 font-medium mt-4">
              This is the problem Smart ATS Resume solves at its foundation.
            </p>
          </section>

          {/* What Makes Smart ATS Different */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-amber-400" />
              What Makes Smart ATS Resume Different
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Most AI resume builders today generate generic rewrites or focus on creating visually appealing templates. But those templates often break ATS parsing, and the rewrites rarely match the specific job description.
            </p>

            <p className="text-lg text-amber-300 font-semibold mb-6">
              Smart ATS Resume takes a more technical and accurate approach:
            </p>

            <div className="space-y-4 mb-8">
              {[
                'It simulates how real ATS systems parse and interpret resumes.',
                'It analyzes formatting, structure, keywords, and clarity.',
                'It identifies the exact reasons an ATS would reject the resume.',
                'It provides AI-generated rewrites aligned with both the resume and the job description.',
                'It produces a highly scannable, ATS-friendly document while still improving readability for humans.'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-lg text-gray-300">
                Smart ATS Resume isn't just a tool that rewrites your resume.
              </p>
              <p className="text-xl text-white font-semibold mt-2">
                It's a tool that translates your resume into a format ATS software understands and values.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-7 h-7 text-amber-400" />
              How Smart ATS Resume Works
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-8">
              The process is simple but powerful. It is designed to guide the user from confusion to clarity in just a few minutes.
            </p>

            {/* Step 1 */}
            <div className="mb-8 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center font-bold">1</span>
                <h3 className="text-xl font-bold text-white">Upload Your Resume</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Users can upload a PDF or text-based file. Smart ATS Resume immediately analyzes:
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {['Text readability', 'Structural hierarchy', 'Headings and sections', 'Spacing and alignment', 'Date formats', 'Bullet consistency'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="w-4 h-4 text-teal-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-8 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center font-bold">2</span>
                <h3 className="text-xl font-bold text-white">Paste the Job Description</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Smart ATS Resume extracts keywords, skills, responsibilities, and required qualifications using a specialized language model. It identifies:
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {['Hard skills', 'Soft skills', 'Technical terminology', 'Role-specific phrasing', 'Experience requirements'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-8 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center font-bold">3</span>
                <h3 className="text-xl font-bold text-white">ATS Score Report</h3>
              </div>
              <p className="text-gray-300 mb-4">
                The platform generates a multi-category score showing how well your resume performs across ATS standards:
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {['ATS readability', 'Job match alignment', 'Skills and keyword match', 'Formatting compliance', 'Section structure', 'Role relevance'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="w-4 h-4 text-teal-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4 */}
            <div className="mb-8 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center font-bold">4</span>
                <h3 className="text-xl font-bold text-white">AI Rewrite Suggestions</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Smart ATS Resume generates targeted improvements including:
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {['Improved bullet points', 'Stronger action verbs', 'Role-specific keywords', 'Enhanced summaries', 'Cleaner section structures'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 mt-4 text-sm">
                Unlike generic resume builders, the rewrites are contextual, relevant, and aligned with real job requirements.
              </p>
            </div>

            {/* Step 5 */}
            <div className="mb-8 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center font-bold">5</span>
                <h3 className="text-xl font-bold text-white">Keyword Match Tool</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Users can view:
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {['Missing keywords', 'Partially matched keywords', 'Strength of alignment', 'Repetition issues', 'Keyword distribution'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <Target className="w-4 h-4 text-teal-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-amber-300 mt-4 text-sm font-medium">
                This feature alone can significantly increase interview callback rates.
              </p>
            </div>

            {/* Step 6 */}
            <div className="mb-8 bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center font-bold">6</span>
                <h3 className="text-xl font-bold text-white">Downloadable ATS-Optimized Resume</h3>
              </div>
              <p className="text-gray-300 mb-4">
                The final output is:
              </p>
              <div className="flex flex-wrap gap-3">
                {['Clean', 'Well-structured', 'Human-readable', 'Machine-readable', 'Properly formatted for ATS'].map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mt-4">
                This gives job seekers a version of their resume that will pass through initial filters and actually reach a human reviewer.
              </p>
            </div>
          </section>

          {/* The Mission */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Target className="w-7 h-7 text-amber-400" />
              The Mission Behind Smart ATS Resume
            </h2>
            
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-8 mb-6">
              <p className="text-xl text-white font-semibold text-center">
                To give job seekers control, clarity, and confidence in a hiring system that has become increasingly automated and difficult to navigate.
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              The modern job search is filled with uncertainty. Applicants often feel invisible, overlooked, or unsure what they are doing wrong. But most of these issues stem from technicalities—not their talent, potential, or experience.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              By revealing how ATS systems evaluate resumes, Smart ATS Resume empowers job seekers with transparent, actionable information that can dramatically improve their chances of success.
            </p>

            <p className="text-xl text-amber-300 font-semibold text-center">
              The belief behind this tool is that every qualified applicant deserves to be seen.
            </p>
          </section>

          {/* Who It's For */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-7 h-7 text-amber-400" />
              Who Smart ATS Resume Is Built For
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Professionals applying to competitive roles',
                'Career changers entering new fields',
                'Students and recent graduates',
                'Workers reentering the job market',
                'Anyone who wants more interview opportunities',
                'Job seekers applying through online portals'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-amber-300 font-medium text-center mt-6">
              If a company uses ATS—and most do—Smart ATS Resume becomes essential.
            </p>
          </section>

          {/* Why Now */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Why ATS Optimization Matters More Now Than Ever
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              The job market is more competitive than it has been in years. Companies often receive hundreds or thousands of applications for a single role. The ATS exists to help employers manage the volume—but this also means job seekers must adapt.
            </p>

            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-white mb-4">Key trends include:</h3>
              <ul className="space-y-2">
                {[
                  'Increased automation in hiring',
                  'Higher resume volume per job posting',
                  'AI-driven screening',
                  'Keyword-based ranking models',
                  'Standardized resume parsing'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Without ATS optimization, qualified applicants can easily be lost in the noise.
            </p>
            <p className="text-amber-300 font-semibold mt-2">
              Smart ATS Resume gives them a strategic advantage.
            </p>
          </section>

          {/* Technology */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              The Technology Behind Smart ATS Resume
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Smart ATS Resume is powered by a combination of:
            </p>

            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                'Natural language processing (NLP)',
                'Machine learning models trained on ATS behavior',
                'Keyword extraction algorithms',
                'Pattern recognition',
                'Resume structure analysis',
                'AI-powered rewriting tools',
                'Scoring heuristics based on industry standards'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed">
              This blend of technology allows the platform to act almost like a real ATS system, providing users with insights previously hidden behind corporate software.
            </p>
            <p className="text-gray-400 mt-4 italic">
              The goal is not to replace human review—it is to help applicants reach that stage.
            </p>
          </section>

          {/* Transparency */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              The Importance of Transparency in the Job Search Process
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              One of the biggest frustrations job seekers face is silence. Applications vanish with no explanation. Smart ATS Resume provides clarity:
            </p>

            <div className="space-y-3 mb-6">
              {[
                'Why a resume might be rejected',
                'How formatting impacts parsing',
                'Which keywords are essential',
                'What hiring systems look for',
                'How to structure information clearly'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-amber-300 font-medium">
              By offering transparency, Smart ATS Resume changes how applicants approach the job search, transforming guesswork into strategy.
            </p>
          </section>

          {/* Callback Rates */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              How Smart ATS Resume Can Improve Interview Callback Rates
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              ATS-optimized resumes typically receive significantly higher callback rates. This happens because:
            </p>

            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                'The resume becomes easier for software to read',
                'Keywords match more closely',
                'Formatting aligns with parsing logic',
                'Experience appears more relevant',
                'Skills are clearly recognized',
                'The document ranks higher in automated systems'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed">
              Many job seekers see improvement within days after updating their resumes using ATS-specific suggestions.
            </p>
            <p className="text-amber-300 font-semibold mt-2">
              Smart ATS Resume provides these improvements instantly.
            </p>
          </section>

          {/* Final Thoughts */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Final Thoughts: Beating the Bots and Getting Seen
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Smart ATS Resume was built to solve one of the most overlooked problems in modern hiring: the hidden barrier between talented applicants and the jobs they deserve.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              With this tool, job seekers finally gain the clarity, structure, and advantage they need to navigate a hiring environment driven by automation and volume. The goal is simple: help applicants get seen, get interviews, and ultimately get hired.
            </p>

            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
              <p className="text-xl text-white font-semibold">
                For anyone serious about improving their job search results, an ATS-optimized resume is no longer optional—it is essential.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Try Smart ATS Resume
            </h2>
            <p className="text-amber-100 mb-6 max-w-xl mx-auto">
              Start optimizing your resume today and finally get seen by recruiters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/builder"
                className="bg-gray-900/80 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 inline-flex items-center justify-center"
              >
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/templates"
                className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                View Templates
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href="https://x.com/SmartATSResume" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-amber-100 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Follow on X/Twitter
              </a>
              <a 
                href="https://flannel-jaw-9da.notion.site/smart-ats-resume" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-amber-100 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Press & Media Resources
              </a>
            </div>
          </section>

        </div>
      </article>
    </main>
  );
}
