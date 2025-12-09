'use client';

import React from 'react';
import { Zap, Clock, Sparkles, ArrowRight, Rocket, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const SprintBanner: React.FC = () => {
  return (
    <section className="py-12 px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-orange-900/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-0 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/95 to-gray-900/90 border-2 border-amber-500/50 rounded-3xl p-8 md:p-10 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:border-amber-400/70 transition-all duration-500">
          
          {/* Limited Time Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold rounded-full animate-pulse shadow-lg shadow-red-500/30">
              <Clock className="w-4 h-4" />
              LIMITED TIME OFFER
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                7-Day Sprint
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-bold text-gray-200">
                Full Premium Access
              </span>
            </h2>

            {/* Price */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-gray-500 line-through text-2xl">$22</div>
              <div className="flex items-baseline">
                <span className="text-6xl md:text-7xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  $9
                </span>
                <span className="text-gray-400 ml-2 text-lg">for 7 days</span>
              </div>
            </div>

            {/* Value Props */}
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Get <strong className="text-amber-400">everything you need</strong> to land your dream job in just one week. 
              No commitment. No risk. Just results.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '🎯', text: 'Unlimited Resumes' },
                { icon: '🤖', text: 'AI Optimization' },
                { icon: '📊', text: 'ATS Scoring' },
                { icon: '✨', text: 'Premium Templates' },
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-amber-500/50 transition-all duration-300"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm text-gray-300 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link 
              href="/pricing?plan=sprint"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-orange-500/40 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 animate-pulse hover:animate-none"
            >
              <Rocket className="w-6 h-6 group-hover:animate-bounce" />
              Start Your 7-Day Sprint
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>

            {/* Trust Elements */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No auto-renewal tricks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SprintBanner;
