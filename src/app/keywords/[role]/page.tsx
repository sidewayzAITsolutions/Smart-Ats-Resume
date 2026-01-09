'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, CheckCircle, Sparkles, Target, Zap } from 'lucide-react';
import GlobalNavigation from '@/components/GlobalNavigation';

// Role keywords mapping - mirrors ROLE_KEYWORDS from ats-analyzer.ts
const ROLE_KEYWORDS: Record<string, string[]> = {
  'software-engineer': [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'api', 'rest', 'graphql', 'database', 'sql', 'nosql', 'mongodb', 'postgresql',
    'microservices', 'ci/cd', 'testing', 'debugging', 'performance', 'scalability'
  ],
  'product-manager': [
    'agile', 'scrum', 'roadmap', 'stakeholder', 'analytics', 'strategy',
    'leadership', 'metrics', 'kpi', 'user research', 'jira', 'confluence',
    'product lifecycle', 'go-to-market', 'roi', 'user stories', 'backlog',
    'prioritization', 'cross-functional', 'data-driven', 'customer-centric'
  ],
  'data-scientist': [
    'python', 'r', 'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'scikit-learn', 'pandas', 'numpy', 'sql', 'statistics', 'data analysis',
    'visualization', 'tableau', 'power bi', 'nlp', 'computer vision', 'model',
    'algorithm', 'prediction', 'classification', 'regression', 'neural network'
  ],
  'designer': [
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ux', 'ui',
    'prototyping', 'wireframing', 'user research', 'design systems', 'responsive',
    'mobile', 'web', 'accessibility', 'usability', 'interaction', 'visual',
    'typography', 'color theory', 'design thinking', 'user-centered'
  ],
  'marketing': [
    'seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'analytics', 'conversion',
    'roi', 'kpi', 'content marketing', 'social media', 'email marketing', 'crm',
    'salesforce', 'hubspot', 'lead generation', 'funnel', 'campaign', 'strategy',
    'brand', 'engagement', 'metrics', 'a/b testing', 'marketing automation'
  ],
  'project-manager': [
    'agile', 'scrum', 'waterfall', 'jira', 'asana', 'trello', 'gantt', 'timeline',
    'budget', 'stakeholder', 'risk management', 'resource allocation', 'pmp',
    'sprint', 'milestone', 'deliverable', 'scope', 'change management', 'communication'
  ],
  'sales': [
    'salesforce', 'crm', 'pipeline', 'quota', 'b2b', 'b2c', 'lead generation',
    'negotiation', 'closing', 'cold calling', 'account management', 'territory',
    'revenue', 'upselling', 'cross-selling', 'prospecting', 'discovery', 'demo'
  ],
  'devops-engineer': [
    'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'aws',
    'azure', 'gcp', 'linux', 'bash', 'python', 'monitoring', 'prometheus', 'grafana',
    'infrastructure as code', 'automation', 'security', 'networking', 'load balancing'
  ],
  'frontend-developer': [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'html', 'css', 'sass',
    'tailwind', 'webpack', 'vite', 'responsive design', 'accessibility', 'performance',
    'testing', 'jest', 'cypress', 'api integration', 'state management', 'git'
  ],
  'backend-developer': [
    'node.js', 'python', 'java', 'go', 'rust', 'api', 'rest', 'graphql', 'database',
    'sql', 'postgresql', 'mongodb', 'redis', 'microservices', 'docker', 'kubernetes',
    'authentication', 'security', 'performance', 'scalability', 'caching'
  ]
};

// Role display names
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  'software-engineer': 'Software Engineer',
  'product-manager': 'Product Manager',
  'data-scientist': 'Data Scientist',
  'designer': 'UX/UI Designer',
  'marketing': 'Marketing Professional',
  'project-manager': 'Project Manager',
  'sales': 'Sales Professional',
  'devops-engineer': 'DevOps Engineer',
  'frontend-developer': 'Frontend Developer',
  'backend-developer': 'Backend Developer'
};

export default function KeywordPage() {
  const params = useParams();
  const roleSlug = params.role as string;
  
  const keywords = ROLE_KEYWORDS[roleSlug] || [];
  const displayName = ROLE_DISPLAY_NAMES[roleSlug] || roleSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // If role not found, show available roles
  if (!ROLE_KEYWORDS[roleSlug]) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <GlobalNavigation showBuilderActions={false} showMainNav={true} showAuthButtons={true} />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Role Not Found</h1>
          <p className="text-gray-400 mb-8">We don't have keywords for that role yet. Try one of these:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(ROLE_KEYWORDS).map(role => (
              <Link 
                key={role}
                href={`/keywords/${role}`}
                className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-teal-500 transition-all text-white"
              >
                {ROLE_DISPLAY_NAMES[role] || role}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <GlobalNavigation showBuilderActions={false} showMainNav={true} showAuthButtons={true} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-900/50 border border-teal-700/50 rounded-full text-teal-300 text-sm mb-6">
            <Target className="w-4 h-4" />
            2025 ATS Keywords Guide
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            2025 ATS Keywords for{' '}
            <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
              {displayName}
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            These are the exact keywords that ATS systems and recruiters look for when screening {displayName.toLowerCase()} resumes in 2025.
          </p>
          
          <Link
            href="/builder"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Build {displayName} Resume
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Keywords Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              <Sparkles className="inline-block w-6 h-6 text-amber-400 mr-2" />
              Essential Keywords ({keywords.length} total)
            </h2>
            <p className="text-gray-400">Include these keywords naturally throughout your resume to maximize ATS compatibility</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {keywords.map((keyword, index) => (
              <div 
                key={keyword}
                className="group p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-teal-500/50 hover:bg-gray-800 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-200 font-medium capitalize">{keyword}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-900/50 to-gray-950/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            How to Use These Keywords Effectively
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">✅ Do This</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Integrate keywords naturally into your experience bullets</li>
                <li>• Include both technical and soft skill keywords</li>
                <li>• Use variations (e.g., "React" and "React.js")</li>
                <li>• Place high-priority keywords in your summary</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">❌ Avoid This</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Don't stuff keywords unnaturally</li>
                <li>• Don't hide keywords in white text</li>
                <li>• Don't list skills you can't demonstrate</li>
                <li>• Don't ignore context - show how you used skills</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-teal-900/30 to-amber-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Optimize Your {displayName} Resume?
          </h2>
          <p className="text-gray-300 mb-8">
            Our AI-powered builder automatically optimizes your resume with the right keywords for your target role.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <Zap className="w-5 h-5" />
              Build {displayName} Resume
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 text-white font-semibold border border-gray-700 rounded-xl hover:bg-gray-700 transition-all"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Other Roles */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-8">
            Keywords for Other Roles
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.keys(ROLE_KEYWORDS)
              .filter(role => role !== roleSlug)
              .map(role => (
                <Link
                  key={role}
                  href={`/keywords/${role}`}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-300 hover:border-teal-500 hover:text-white transition-all text-sm"
                >
                  {ROLE_DISPLAY_NAMES[role] || role}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SmartATS. Beat the bots, land the job.</p>
        </div>
      </footer>
    </div>
  );
}
