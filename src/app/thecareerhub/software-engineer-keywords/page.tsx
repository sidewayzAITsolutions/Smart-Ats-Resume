import type { Metadata } from 'next';

import { getSEOMetadata } from '@/lib/seo-config';

import SoftwareEngineerKeywordsClient from './software-engineer-keywords-client';

const seo = getSEOMetadata('software-engineer-keywords');

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: seo.url },
};

export default function SoftwareEngineerKeywordsPage() {
  return <SoftwareEngineerKeywordsClient />;
}
