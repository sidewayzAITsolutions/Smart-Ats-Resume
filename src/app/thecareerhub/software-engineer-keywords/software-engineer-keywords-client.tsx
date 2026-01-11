'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  Code,
  Copy,
  Database,
  FileText,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

export default function SoftwareEngineerKeywordsClient() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const programmingLanguages = [
    'Python',
    'JavaScript',
    'Java',
    'C#',
    'C++',
    'TypeScript',
    'SQL',
    'Go',
    'Rust',
    'PHP',
    'Swift',
    'Kotlin',
  ];

  const frontendFrameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Svelte'];
  const backendFrameworks = ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', '.NET'];
  const databases = ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'DynamoDB'];
  const devOpsCloud = ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions'];
  const tools = ['Git', 'Jira', 'Linux', 'CI/CD', 'REST APIs', 'GraphQL'];
  const softSkills = ['Problem Solving', 'Collaboration', 'System Design', 'Debugging', 'Performance Optimization'];

  const fullKeywordBlock =
    'Python, SQL, Docker, AWS, React, Node.js, REST APIs, GitHub Actions, Agile, CI/CD, Kubernetes, TypeScript';

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
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
            Copy and paste keywords that help your resume pass ATS filters and reach human reviewers.
          </p>
        </div>
      </div>

      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-amber-300 mb-2">Why keywords matter</h2>
                <p className="text-gray-300">
                  ATS systems score keyword matches. Tailor this list to each job description to improve your match.
                </p>
              </div>
            </div>
          </div>

          <KeywordSection
            title="Programming Languages"
            icon={<Code className="w-5 h-5 text-teal-400" />}
            items={programmingLanguages}
            copied={copiedSection === 'languages'}
            onCopy={() => copyToClipboard(programmingLanguages.join(', '), 'languages')}
          />

          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <KeywordCard
              title="Frontend"
              accent="amber"
              items={frontendFrameworks}
              copied={copiedSection === 'frontend'}
              onCopy={() => copyToClipboard(frontendFrameworks.join(', '), 'frontend')}
            />
            <KeywordCard
              title="Backend"
              accent="teal"
              items={backendFrameworks}
              copied={copiedSection === 'backend'}
              onCopy={() => copyToClipboard(backendFrameworks.join(', '), 'backend')}
            />
          </div>

          <KeywordSection
            title="Databases"
            icon={<Database className="w-5 h-5 text-emerald-400" />}
            items={databases}
            copied={copiedSection === 'databases'}
            onCopy={() => copyToClipboard(databases.join(', '), 'databases')}
          />

          <KeywordSection
            title="DevOps & Cloud"
            icon={<Cloud className="w-5 h-5 text-blue-400" />}
            items={devOpsCloud}
            copied={copiedSection === 'devops'}
            onCopy={() => copyToClipboard(devOpsCloud.join(', '), 'devops')}
          />

          <KeywordSection
            title="Tools & Concepts"
            icon={<Wrench className="w-5 h-5 text-amber-400" />}
            items={tools}
            copied={copiedSection === 'tools'}
            onCopy={() => copyToClipboard(tools.join(', '), 'tools')}
          />

          <KeywordSection
            title="Soft Skills"
            icon={<Users className="w-5 h-5 text-pink-400" />}
            items={softSkills}
            copied={copiedSection === 'softskills'}
            onCopy={() => copyToClipboard(softSkills.join(', '), 'softskills')}
          />

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-white">Copy/paste keyword block</h2>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-3">Use this as a starting point, then tailor it to the job.</p>
              <div className="bg-black/40 border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-200 break-words">
                {fullKeywordBlock}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(fullKeywordBlock, 'block')}
                className="inline-flex items-center mt-4 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {copiedSection === 'block' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy block
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="bg-gradient-to-r from-teal-900/50 to-amber-900/50 border border-amber-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Want a keyword match score?</h2>
            <p className="text-gray-300 mb-6">Paste a job description and see what keywords your resume is missing.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resume-checker"
                className="px-8 py-4 bg-amber-500/20 text-amber-200 rounded-xl font-semibold border border-amber-500/30 hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                Check my resume
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/builder"
                className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700 transition-all"
              >
                Build an ATS-friendly resume
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}

function KeywordSection({
  title,
  icon,
  items,
  copied,
  onCopy,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-900/60 border border-gray-800 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {items.map((item) => (
            <span
              key={item}
              className="px-4 py-2 bg-gray-800/40 text-gray-200 border border-gray-700 rounded-lg text-sm font-medium"
            >
              {item}
            </span>
          ))}
        </div>
        <button type="button" onClick={onCopy} className="inline-flex items-center text-sm text-gray-400 hover:text-white">
          {copied ? (
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
  );
}

function KeywordCard({
  title,
  accent,
  items,
  copied,
  onCopy,
}: {
  title: string;
  accent: 'amber' | 'teal';
  items: string[];
  copied: boolean;
  onCopy: () => void;
}) {
  const accentClasses =
    accent === 'amber'
      ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
      : 'text-teal-300 bg-teal-500/10 border-teal-500/30';

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${accentClasses.split(' ')[0]}`}>{title}</h3>
        <button type="button" onClick={onCopy} className="inline-flex items-center text-sm text-gray-400 hover:text-white">
          {copied ? (
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
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`px-3 py-1.5 ${accentClasses} border rounded-lg text-sm`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
