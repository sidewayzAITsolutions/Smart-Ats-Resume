import { NextResponse } from 'next/server';

import { getAllSEOMetadata } from '@/lib/seo-config';

function normalizePath(path: string): string {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export async function GET() {
  const baseUrl = 'https://smartatsresume.com';
  const now = new Date().toISOString();

  const entries = Object.values(getAllSEOMetadata())
    .map((m) => normalizePath(m.url))
    .filter(Boolean);

  const uniquePaths = Array.from(new Set(entries));

  const urlsXml = uniquePaths
    .map((p) => {
      const loc = `${baseUrl}${p === '/' ? '' : p}`;
      return `  <url><loc>${loc}</loc><lastmod>${now}</lastmod></url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
