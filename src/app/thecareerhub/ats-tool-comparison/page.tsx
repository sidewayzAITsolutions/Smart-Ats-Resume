import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getSEOMetadata } from '@/lib/seo-config';

const seo = getSEOMetadata('ats-tool-comparison');

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: seo.url },
};

export default function AtsComparisonPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/thecareerhub"
          className="inline-flex items-center text-amber-300 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Career Hub
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          ATS Tool Comparison: What Actually Matters for Getting Interviews
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          Many resume tools look impressive, but not all of them produce resumes that parse cleanly in Applicant
          Tracking Systems. Use this checklist to compare tools based on ATS outcomes, not aesthetics.
        </p>

        <h2 className="text-3xl font-semibold mt-10 mb-4 border-b border-gray-800 pb-2">
          Feature Comparison: ATS Compatibility and Practical Output
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Smart ATS Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Typical Resume Tool
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Parsing-safe layout</td>
                <td className="px-6 py-4 text-emerald-300">Single-column, ATS-friendly structure by default.</td>
                <td className="px-6 py-4 text-gray-300">May use columns/icons that reduce readability.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Keyword alignment</td>
                <td className="px-6 py-4 text-emerald-300">Helps you identify missing keywords from the job post.</td>
                <td className="px-6 py-4 text-gray-300">May rely on generic suggestions instead of job-specific gaps.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Bullet point strength</td>
                <td className="px-6 py-4 text-emerald-300">Encourages metrics and strong action verbs.</td>
                <td className="px-6 py-4 text-gray-300">Often focuses on tone/grammar over impact and specificity.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Export reliability</td>
                <td className="px-6 py-4 text-emerald-300">Exports that preserve text and structure.</td>
                <td className="px-6 py-4 text-gray-300">Some exports introduce layout artifacts that hurt parsing.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-semibold mt-10 mb-4 border-b border-gray-800 pb-2">The Verdict</h2>
        <p className="text-gray-300 mb-8">
          If your priority is getting hired, choose a tool that prioritizes ATS readability: standard headings,
          single-column layout, and job-specific keyword coverage.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/resume-checker"
            className="px-6 py-4 bg-amber-500/20 text-amber-200 rounded-xl font-semibold border border-amber-500/30 hover:bg-amber-500/30 transition-all text-center"
          >
            Check your ATS score
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-4 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700 transition-all text-center"
          >
            See pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
