import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Career Hub | Smart ATS Resume - Job Search Resources & Career Guides',
  description: 'Your comprehensive resource center for job search success. Access expert resume tips, interview strategies, ATS optimization guides, and career advice to help you land your dream job.',
  keywords: [
    'resume tips',
    'job search',
    'career advice',
    'interview preparation',
    'ATS optimization',
    'resume writing',
    'job hunting strategies',
    'career development',
    'professional development',
    'job seekers resources'
  ],
  openGraph: {
    title: 'The Career Hub | Smart ATS Resume',
    description: 'Expert guides, resume tips, and career resources to help you land your dream job.',
    type: 'website',
    url: 'https://smartatsresume.com/thecareerhub',
    siteName: 'Smart ATS Resume',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Career Hub | Smart ATS Resume',
    description: 'Expert guides, resume tips, and career resources to help you land your dream job.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CareerHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

