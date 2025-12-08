'use client';
import React from 'react';

interface Company {
  name: string;
  logo: string;
  altText: string;
}

const TrustBar: React.FC = () => {
  const companies: Company[] = [
    {
      name: 'Google',
      logo: '🔍',
      altText: 'Google'
    },
    {
      name: 'Amazon',
      logo: '📦',
      altText: 'Amazon'
    },
    {
      name: 'Microsoft',
      logo: '💻',
      altText: 'Microsoft'
    },
    {
      name: 'Apple',
      logo: '🍎',
      altText: 'Apple'
    },
    {
      name: 'Meta',
      logo: '🌐',
      altText: 'Meta'
    },
    {
      name: 'Tesla',
      logo: '⚡',
      altText: 'Tesla'
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-r from-gray-900/80 via-gray-800/50 to-gray-900/80 border-y border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Job seekers powered by Smart ATS work at:
          </h3>
          <p className="text-gray-400 text-sm md:text-base">
            Trusted by professionals aiming for top-tier companies
          </p>
        </div>

        {/* Companies Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {companies.map((company, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-amber-500/50 hover:bg-gray-900/80 transition-all duration-300 cursor-default animate-fade-in-up hover-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Logo/Icon */}
              <div className="text-5xl md:text-6xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                {company.logo}
              </div>

              {/* Company Name */}
              <span className="text-gray-300 font-semibold text-sm md:text-base group-hover:text-amber-400 transition-colors duration-300 text-center">
                {company.name}
              </span>

              {/* Hover Effect - Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-orange-500/10 group-hover:to-amber-500/5 rounded-xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom Stat */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-amber-900/30 border border-amber-700/50 rounded-lg hover:border-amber-500/70 transition-all duration-300">
            <span className="text-amber-300 font-semibold">
              ✨ Used by professionals across <strong className="text-amber-400">500+ Fortune companies</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
