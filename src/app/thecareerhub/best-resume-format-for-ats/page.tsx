import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getSEOMetadata } from '@/lib/seo-config';

const seo = getSEOMetadata('best-resume-format-for-ats');

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: seo.url },
};

export default function BestFormatPage() {
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
          The Definitive Guide to the Best Resume Format to Pass ATS in 2025
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          In 2025, most companies use an Applicant Tracking System (ATS). Your resume format is the first hurdle.
          Choosing the wrong one is a fast way to get filtered out before a human even sees your application.
          Below is a practical breakdown of the most common formats and which one is safest for ATS parsing.
        </p>
      
      <h2 className="text-3xl font-semibold mt-10 mb-4 border-b border-gray-800 pb-2">
        The Three Primary Resume Formats (ATS Pros and Cons)
      </h2>
      
      <h3 className="text-2xl font-medium mt-6 mb-3">1. Reverse-Chronological Format</h3>
      <p className="text-gray-300 mb-4">
        This is the gold standard and remains the most ATS-friendly format. It lists your professional history
        starting with your most recent role. ATS systems are programmed to read dates and job titles sequentially.
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-300 mb-6 space-y-1">
        <li><strong>Pros:</strong> ATS is designed for this structure, clear career progression, easy for recruiters to scan.</li>
        <li><strong>Cons:</strong> Highlights gaps in employment.</li>
        <li><strong>Verdict:</strong> Highly recommended. Best for job seekers with steady career paths.</li>
      </ul>

      <h3 className="text-2xl font-medium mt-6 mb-3">2. Functional (Skill-Based) Format</h3>
      <p className="text-gray-300 mb-4">
        This format de-emphasizes dates and organizes your document around skill sets. While great for career changers, it confuses the sequential logic of most ATS software.
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-300 mb-6 space-y-1">
        <li><strong>Pros:</strong> Masks career gaps, highlights transferable skills.</li>
        <li><strong>Cons:</strong> ATS struggles to map skills to timelines; often flagged as incomplete or intentionally deceptive.</li>
        <li><strong>Verdict:</strong> Avoid. It often leads to lower ATS match confidence.</li>
      </ul>

      <h3 className="text-2xl font-medium mt-6 mb-3">3. Combination (Hybrid) Format</h3>
      <p className="text-gray-300 mb-4">
        The combination format includes a skills summary at the top (functional element) followed by a full reverse-chronological work history. When done correctly, this can be effective.
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-300 mb-8 space-y-1">
        <li><strong>Pros:</strong> Leverages a robust skills section while retaining chronological history.</li>
        <li><strong>Cons:</strong> Can become too long; risky if the formatting is overly complex.</li>
        <li><strong>Verdict:</strong> Use with caution. Only use if the layout is explicitly ATS-optimized.</li>
      </ul>
      
      <h2 className="text-3xl font-semibold mt-10 mb-4 border-b border-gray-800 pb-2">
        The ATS-Proof Solution: Simple Reverse-Chronological
      </h2>
      <p className="text-gray-300 mb-6">
        The safest resume format for ATS is a simple, single-column, reverse-chronological layout. It avoids complex
        columns, graphics, or tables that confuse parsers, allowing the ATS to extract your data accurately.
      </p>
      
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-100 p-5 mt-8 rounded-xl">
        <h3 className="text-xl font-bold mb-2 text-white">Actionable Step: Guarantee the Format</h3>
        <p className="text-amber-100">
          Don&apos;t risk manual formatting errors. Our builder uses ATS-safe layouts and checks your ATS score.
        </p>
        <Link href="/builder" className="inline-flex mt-4 font-semibold text-amber-300 hover:text-white">
          Start building your ATS-proof resume
        </Link>
      </div>
      </div>
    </main>
  );
}
