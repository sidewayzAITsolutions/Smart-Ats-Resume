// SEO Configuration for all pages
// Centralized SEO metadata management

export interface SEOMetadata {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  ogImage?: string;
}

// SEO metadata for all pages
const seoMap: Record<string, SEOMetadata> = {
  // Main pages
  'home': {
    title: 'Smart ATS Resume - AI-Powered Resume Builder & ATS Optimizer',
    description: 'Build ATS-optimized resumes with AI. Get higher ATS scores, beat applicant tracking systems, and land more interviews with our intelligent resume builder.',
    url: '/',
    keywords: ['ATS resume', 'resume builder', 'AI resume', 'ATS optimization'],
  },
  'ats-guide': {
    title: 'ATS Resume Guide - How to Beat Applicant Tracking Systems | Smart ATS',
    description: 'Complete guide to understanding and beating Applicant Tracking Systems. Learn ATS-friendly formatting, keyword optimization, and resume best practices.',
    url: '/ats-guide',
    keywords: ['ATS guide', 'applicant tracking system', 'ATS resume tips', 'beat ATS'],
  },
  'pricing': {
    title: 'Pricing - Smart ATS Resume Plans & Features',
    description: 'Choose the perfect plan for your job search. Free and premium options available with AI-powered resume analysis and optimization.',
    url: '/pricing',
  },
  'templates': {
    title: 'Resume Templates - ATS-Optimized Professional Designs | Smart ATS',
    description: 'Browse our collection of ATS-friendly resume templates. Professional designs optimized for applicant tracking systems.',
    url: '/templates',
    keywords: ['resume templates', 'ATS templates', 'professional resume'],
  },
  'builder': {
    title: 'Resume Builder - Create Your ATS-Optimized Resume | Smart ATS',
    description: 'Build your perfect resume with our AI-powered resume builder. Get real-time ATS scoring and optimization suggestions.',
    url: '/builder',
  },
  'resume-checker': {
    title: 'Resume Checker - Free ATS Score Analysis | Smart ATS',
    description: 'Check your resume against ATS systems for free. Get instant feedback on formatting, keywords, and optimization opportunities.',
    url: '/resume-checker',
    keywords: ['resume checker', 'ATS score', 'resume analysis'],
  },
  
  // The Career Hub pages
  'thecareerhub': {
    title: 'The Career Hub - Resume Tips & Career Guides | Smart ATS',
    description: 'Your destination for career advice, resume tips, and job search strategies. Expert guides to help you land your dream job.',
    url: '/thecareerhub',
    keywords: ['career hub', 'resume tips', 'career advice', 'job search'],
  },
  'ats-resume-guide-2025': {
    title: 'The Ultimate 2025 ATS Resume Guide | Smart ATS',
    description: 'Learn how to pass ATS systems and get your resume noticed. Over 75% of resumes get rejected automatically. Master keyword optimization, formatting, and ATS best practices.',
    url: '/thecareerhub/ats-resume-guide-2025',
    keywords: ['ATS resume 2025', 'ATS guide', 'resume optimization'],
  },
  'how-to-beat-ats-tricks': {
    title: 'How to Beat ATS: Insider Tricks & Tips | Smart ATS',
    description: 'Discover proven strategies and insider tricks to beat applicant tracking systems. Get your resume past the ATS and into human hands.',
    url: '/thecareerhub/how-to-beat-ats-tricks',
    keywords: ['beat ATS', 'ATS tricks', 'ATS tips'],
  },
  'best-resume-format-for-ats': {
    title: 'Best Resume Format for ATS Systems | Smart ATS',
    description: 'Learn the best resume format that passes ATS screening. Chronological, functional, or hybrid - find out which format works best.',
    url: '/thecareerhub/best-resume-format-for-ats',
    keywords: ['resume format', 'ATS format', 'best resume format'],
  },
  'resume-no-experience-guide': {
    title: 'How to Write a Resume with No Experience | Smart ATS',
    description: 'Create a compelling resume even without work experience. Tips for students, career changers, and entry-level job seekers.',
    url: '/thecareerhub/resume-no-experience-guide',
    keywords: ['no experience resume', 'entry level resume', 'first resume'],
  },
  'ats-tool-comparison': {
    title: 'ATS Tool Comparison - Best Resume Checkers Reviewed | Smart ATS',
    description: 'Compare the top ATS resume checking tools. Unbiased reviews and comparisons to help you choose the right tool for your job search.',
    url: '/thecareerhub/ats-tool-comparison',
    keywords: ['ATS tools', 'resume checker comparison', 'ATS software'],
  },
  'software-engineer-keywords': {
    title: 'Software Engineer Resume Keywords for ATS | Smart ATS',
    description: 'Essential keywords for software engineer resumes. Optimize your tech resume with industry-specific terms that pass ATS screening.',
    url: '/thecareerhub/software-engineer-keywords',
    keywords: ['software engineer resume', 'tech resume keywords', 'developer resume'],
  },

  // Legal pages
  'privacypolicy': {
    title: 'Privacy Policy | Smart ATS Resume',
    description: 'Learn how Smart ATS Resume protects your privacy and handles your personal data, including our AI data processing practices.',
    url: '/privacypolicy',
  },
  'termsofservice': {
    title: 'Terms of Service | Smart ATS Resume',
    description: 'Read the terms and conditions for using Smart ATS Resume, including our AI-powered features and data processing policies.',
    url: '/termsofservice',
  },

  // Other pages
  'about': {
    title: 'About Smart ATS Resume - Our Mission & Team',
    description: 'Learn about Smart ATS Resume and our mission to help job seekers create ATS-optimized resumes that land interviews.',
    url: '/about',
  },
  'contact': {
    title: 'Contact Us | Smart ATS Resume',
    description: 'Get in touch with the Smart ATS Resume team. We\'re here to help with your resume and job search questions.',
    url: '/contact',
  },
  'for-universities': {
    title: 'Smart ATS for Universities - Campus Career Services',
    description: 'Partner with Smart ATS to provide your students with AI-powered resume optimization tools. Boost career outcomes.',
    url: '/for-universities',
  },
  'keywords': {
    title: 'Resume Keywords by Industry | Smart ATS',
    description: 'Find the right keywords for your resume by industry and job title. Optimize for ATS with our keyword database.',
    url: '/keywords',
  },
};

/**
 * Get SEO metadata for a specific page
 * @param slug - The page identifier (e.g., 'ats-guide', 'thecareerhub')
 * @returns SEOMetadata object with title, description, and url
 */
export function getSEOMetadata(slug: string): SEOMetadata {
  // Return metadata for the slug, or provide sensible defaults
  return seoMap[slug] || {
    title: 'Smart ATS Resume - AI-Powered Resume Builder',
    description: 'Build ATS-optimized resumes with AI. Get higher ATS scores and land more interviews.',
    url: `/${slug}`,
  };
}

/**
 * Get all SEO metadata entries
 * @returns Record of all SEO metadata
 */
export function getAllSEOMetadata(): Record<string, SEOMetadata> {
  return seoMap;
}

/**
 * Check if a page has custom SEO metadata defined
 * @param slug - The page identifier
 * @returns boolean indicating if custom metadata exists
 */
export function hasCustomSEO(slug: string): boolean {
  return slug in seoMap;
}
