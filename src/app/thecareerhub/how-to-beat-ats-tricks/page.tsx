import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getSEOMetadata } from '@/lib/seo-config';

const seo = getSEOMetadata('how-to-beat-ats-tricks');

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: seo.url },
};

export default function BeatAtsTricksPage() {
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

        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">How to Beat ATS: 10 Hidden Resume Tricks</h1>
        <p className="text-lg text-gray-300 mb-10">
          Applicant Tracking Systems (ATS) reject resumes for more than missing keywords. Small formatting and
          structure mistakes can prevent your content from being parsed correctly. Use these 10 fixes to reduce
          parsing errors and improve compatibility.
        </p>

        <h2 className="text-3xl font-semibold mb-6 border-b border-gray-800 pb-2">
          The 10 Critical ATS Optimization Tricks
        </h2>

        <ol className="list-decimal list-inside ml-4 space-y-6 text-gray-300">
          <li>
            <div className="font-bold text-white">Avoid text boxes, tables, and headers/footers</div>
            <p className="mt-2">
              Many ATS parsers miss text inside headers/footers, text boxes, and complex layouts. Use a clean,
              single-column document with standard spacing.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Use standard section headings</div>
            <p className="mt-2">
              Stick to headings like <strong>Work Experience</strong>, <strong>Education</strong>, and{' '}
              <strong>Skills</strong>. Creative section names increase parsing errors.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Mirror the job title exactly (if truthful)</div>
            <p className="mt-2">
              If your role aligns, match the wording from the job posting (e.g., "Senior Software Engineer"). Title
              fields tend to be heavily weighted.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Spell out acronyms once</div>
            <p className="mt-2">
              Write the full phrase first, then the acronym: <strong>Search Engine Optimization (SEO)</strong>. That
              helps you match both versions.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Use standard bullet points</div>
            <p className="mt-2">
              Avoid custom icons and symbols - parsers can convert them into unreadable characters. Use a simple
              bullet style.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Use common, system fonts</div>
            <p className="mt-2">
              Choose fonts like <strong>Arial</strong>, <strong>Calibri</strong>, or <strong>Times New Roman</strong>.
              Uncommon fonts can render oddly after parsing.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Quantify your impact</div>
            <p className="mt-2">
              Wherever possible, add metrics (numbers, %, time, scale). It improves keyword relevance and gives
              recruiters fast proof.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Place core keywords in the summary</div>
            <p className="mt-2">
              Your professional summary is high-priority content. Naturally include the top 4-6 keywords from the job
              description.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Prefer .docx unless the employer requests PDF</div>
            <p className="mt-2">
              Modern ATS can read PDFs, but .docx typically has fewer parsing edge cases. Use PDF only when asked.
            </p>
          </li>
          <li>
            <div className="font-bold text-white">Use action verbs and remove fluff</div>
            <p className="mt-2">
              Replace "Responsible for" with strong verbs like <strong>Led</strong>, <strong>Built</strong>,{' '}
              <strong>Delivered</strong>, and <strong>Drove</strong>.
            </p>
          </li>
        </ol>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-100 p-5 mt-10 rounded-xl">
          <h3 className="text-xl font-bold mb-2 text-white">Instant ATS Compatibility Check</h3>
          <p className="text-amber-100">
            Want to confirm your formatting is ATS-friendly? Run your resume through our checker and get feedback on
            structure, keyword coverage, and parsing risk.
          </p>
          <Link href="/resume-checker" className="inline-flex mt-4 font-semibold text-amber-300 hover:text-white">
            Get your free ATS score
          </Link>
        </div>
      </div>
    </main>
  );
}
