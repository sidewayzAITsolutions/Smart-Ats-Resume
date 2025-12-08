'use client';

import Link from 'next/link';
import { ArrowLeft, Code, Copy, Check, Database, Cloud, Wrench, Users, Zap, ArrowRight, FileText, Terminal } from 'lucide-react';
import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { getSEOMetadata } from '@/lib/seo-config';

export default function SoftwareEngineerKeywordsPage() {
  const seoData = getSEOMetadata('software-engineer-keywords');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const programmingLanguages = [
    'Python', 'JavaScript', 'Java', 'C#', 'C++', 'TypeScript', 'SQL', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin'
  ];

  const frontendFrameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Svelte'];
  const backendFrameworks = ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', '.NET'];

  const databases = ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'DynamoDB'];

  const devOpsCloud = ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions'];

  const tools = ['Git', 'Jira', 'Linux', 'CI/CD', 'REST APIs', 'GraphQL'];

  const softSkills = ['Problem Solving', 'Collaboration', 'System Design', 'Debugging', 'Performance Optimization'];

  const fullKeywordBlock = 'Python, SQL, Docker, AWS, React, Node.js, REST APIs, GitHub Actions, Agile, CI/CD, Kubernetes, TypeScript';

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
          
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-full text-sm font-medium">
              ATS Keywords
            </span>
            <span className="text-gray-400 text-sm">5 min read</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-teal-200 to-amber-200 bg-clip-text text-transparent">
            100+ ATS Keywords for Software Engineers in 2025
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl">
            The complete copy & paste list of keywords that will get your resume past ATS systems and in front of recruiters.
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Warning Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-amber-300 mb-2">Why Keywords Matter</h3>
                <p className="text-gray-300">
                  If you're applying for software engineering jobs, your resume <strong className="text-white">MUST</strong> contain the right ATS keywords, or you'll be filtered out automatically before a human ever sees your application.
                </p>
              </div>
            </div>
          </div>

          {/* Programming Languages */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Programming Languages</h2>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {programmingLanguages.map((lang) => (
                  <span key={lang} className="px-4 py-2 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-lg text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(programmingLanguages.join(', '), 'languages')}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                {copiedSection === 'languages' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy all
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Frameworks & Libraries */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Frameworks & Libraries</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Frontend */}
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-amber-300 mb-4">Frontend</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {frontendFrameworks.map((fw) => (
                    <span key={fw} className="px-3 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-sm">
                      {fw}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(frontendFrameworks.join(', '), 'frontend')}
                  className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {copiedSection === 'frontend' ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Backend */}
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-teal-300 mb-4">Backend</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {backendFrameworks.map((fw) => (
                    <span key={fw} className="px-3 py-1.5 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-lg text-sm">
                      {fw}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(backendFrameworks.join(', '), 'backend')}
                  className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {copiedSection === 'backend' ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Databases */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Databases</h2>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {databases.map((db) => (
                  <span key={db} className="px-4 py-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg text-sm font-medium">
                    {db}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(databases.join(', '), 'databases')}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                {copiedSection === 'databases' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy all
                  </>
                )}
              </button>
            </div>
          </section>

          {/* DevOps & Cloud */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">DevOps & Cloud</h2>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {devOpsCloud.map((tool) => (
                  <span key={tool} className="px-4 py-2 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-lg text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(devOpsCloud.join(', '), 'devops')}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                {copiedSection === 'devops' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy all
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Tools */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Tools</h2>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {tools.map((tool) => (
                  <span key={tool} className="px-4 py-2 bg-orange-500/10 text-orange-300 border border-orange-500/30 rounded-lg text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(tools.join(', '), 'tools')}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                {copiedSection === 'tools' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy all
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Soft Skills */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Soft Skills for Software Engineers</h2>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {softSkills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-pink-500/10 text-pink-300 border border-pink-500/30 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(softSkills.join(', '), 'softskills')}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                {copiedSection === 'softskills' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy all
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Before/After Example */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Example ATS-Optimized Resume Bullets</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Before */}
              <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 text-xs font-bold">✕</span>
                  </div>
                  <span className="font-semibold text-red-400">Before</span>
                </div>
                <p className="text-gray-400 italic">
                  "Worked on backend services."
                </p>
              </div>

              {/* After */}
              <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-xs font-bold">✓</span>
                  </div>
                  <span className="font-semibold text-green-400">After</span>
                </div>
                <p className="text-gray-300">
                  "Developed <span className="text-teal-300 font-medium">RESTful APIs</span> using <span className="text-teal-300 font-medium">Node.js</span> and <span className="text-teal-300 font-medium">PostgreSQL</span>, improving request handling time by <span className="text-amber-300 font-medium">22%</span>."
                </p>
              </div>
            </div>
          </section>

          {/* Copy/Paste Block */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Copy & Paste: Full Keyword Block</h2>
            
            <div className="bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-500/30 rounded-xl p-6">
              <p className="text-lg text-white font-mono mb-4 leading-relaxed">
                {fullKeywordBlock}
              </p>
              <button
                onClick={() => copyToClipboard(fullKeywordBlock, 'fullblock')}
                className="inline-flex items-center px-4 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors"
              >
                {copiedSection === 'fullblock' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied to clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Full Block
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Pro Tip */}
          <section className="mb-12">
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-teal-300 mb-4">💡 Pro Tip: Tailor Keywords to Each Job</h3>
              <p className="text-gray-300 mb-4">
                Don't just copy-paste the same keywords for every application. Each job description contains specific keywords the ATS is looking for.
              </p>
              <p className="text-gray-300">
                <strong className="text-white">The fastest way?</strong> Paste any job description into SmartATSResume.com and it automatically extracts the exact skills you need to add to your resume.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Put These Keywords to Work
            </h2>
            <p className="text-amber-100 mb-6 max-w-xl mx-auto">
              Build an ATS-optimized resume in minutes with our AI-powered builder that automatically includes the right keywords.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </section>

        </div>
      </article>
    </main>
    </>
  );
}
