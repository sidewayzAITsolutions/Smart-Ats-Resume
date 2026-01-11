'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  FileText,
  GraduationCap,
  Lightbulb,
  Target,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export type CareerHubArticle = {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryColor: 'amber' | 'teal' | 'emerald' | 'purple';
  icon:
    | 'FileText'
    | 'GraduationCap'
    | 'Code'
    | 'Target'
    | 'Lightbulb'
    | 'BookOpen';
  slug: string;
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/30' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
};

const iconMap = {
  FileText,
  GraduationCap,
  Code,
  Target,
  Lightbulb,
  BookOpen,
} as const;

export default function CareerHubClient({ articles }: { articles: CareerHubArticle[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All Resources');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.category)));
    return ['All Resources', ...unique];
  }, [articles]);

  const visibleArticles = useMemo(() => {
    if (activeCategory === 'All Resources') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [activeCategory, articles]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative py-20 border-b border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-amber-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold animate-fade-in-up">The Career Hub</h1>
          </div>
          <p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Your comprehensive resource center for job search success. Expert guides, resume tips,
            interview strategies, and career advice to help you land your dream job.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <section className="py-8 px-4 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={
                    isActive
                      ? 'px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium border border-amber-500/30 hover:bg-amber-500/30 transition-colors'
                      : 'px-4 py-2 bg-gray-800/50 text-gray-400 rounded-full text-sm font-medium border border-gray-700 hover:bg-gray-800 hover:text-white transition-colors'
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleArticles.map((article, index) => {
              const Icon = iconMap[article.icon];
              const colors = categoryColors[article.categoryColor];
              return (
                <article
                  key={article.slug}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300 group animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <span
                      className={`px-3 py-1 ${colors.bg} ${colors.text} ${colors.border} border rounded-full text-xs font-medium`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 mb-6 flex-grow">{article.description}</p>
                  <Link
                    href={`/thecareerhub/${article.slug}`}
                    className="inline-flex items-center text-amber-300 hover:text-amber-200 font-medium group/link"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-orange-600 border-t border-amber-500/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build Your Perfect Resume?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Put these tips into action with our AI-powered resume builder. Create an ATS-optimized resume in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className="bg-gray-900/80 text-white px-8 py-4 rounded-xl font-semibold border border-white/10 hover:bg-gray-900 transition-all duration-300 hover-lift"
            >
              Start Building Now
            </Link>
            <Link
              href="/templates"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 hover-lift"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
