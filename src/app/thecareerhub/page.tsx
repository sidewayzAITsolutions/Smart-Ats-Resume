import type { Metadata } from 'next';

import { getSEOMetadata } from '@/lib/seo-config';

import CareerHubClient, { type CareerHubArticle } from './_components/CareerHubClient';

const seo = getSEOMetadata('thecareerhub');

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: {
    canonical: seo.url,
  },
};

const articles: CareerHubArticle[] = [
  {
    id: 1,
    title: 'The Ultimate ATS Resume Guide 2025',
    description:
      'Master Applicant Tracking Systems with our comprehensive guide. Learn exactly how ATS works, why resumes get rejected, and the proven strategies to get past the bots.',
    category: 'Resume Tips',
    categoryColor: 'amber',
    icon: 'FileText',
    slug: 'ats-resume-guide-2025',
  },
  {
    id: 2,
    title: 'How to Write a Resume With No Experience',
    description:
      'A complete guide for students, recent graduates, and career changers. Learn how to build a compelling resume even when you have little to no work experience.',
    category: 'Career Advice',
    categoryColor: 'teal',
    icon: 'GraduationCap',
    slug: 'resume-no-experience-guide',
  },
  {
    id: 3,
    title: '100+ ATS Keywords for Software Engineers',
    description:
      'The definitive copy & paste list of 2025 software engineering keywords. Programming languages, frameworks, DevOps tools, and more to get past ATS filters.',
    category: 'ATS Keywords',
    categoryColor: 'emerald',
    icon: 'Code',
    slug: 'software-engineer-keywords',
  },
  {
    id: 4,
    title: 'Best Resume Format to Pass ATS in 2025',
    description:
      'Chronological, functional, or hybrid? Learn which resume format is most ATS-friendly and how to choose the right structure for your situation.',
    category: 'Resume Tips',
    categoryColor: 'amber',
    icon: 'FileText',
    slug: 'best-resume-format-for-ats',
  },
  {
    id: 5,
    title: 'How to Beat ATS: 10 Hidden Resume Tricks',
    description:
      'Avoid formatting traps, use the right headings, and optimize for parsing. These practical tricks help your resume survive ATS filters.',
    category: 'ATS Tips',
    categoryColor: 'purple',
    icon: 'Target',
    slug: 'how-to-beat-ats-tricks',
  },
  {
    id: 6,
    title: 'ATS Tool Comparison: Which Resume Checker Is Best?',
    description:
      'Compare ATS resume checking tools and see what matters most: parsing accuracy, keyword match, and actionable feedback.',
    category: 'Tools',
    categoryColor: 'teal',
    icon: 'Lightbulb',
    slug: 'ats-tool-comparison',
  },
];

export default function CareerHubPage() {
  return <CareerHubClient articles={articles} />;
}

