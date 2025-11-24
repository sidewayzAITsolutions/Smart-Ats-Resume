'use client';

import React from 'react';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import BusinessCard from '@/components/BusinessCard';
import GlobalNavigation from '@/components/GlobalNavigation';

export default function ContactSalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Navigation */}
      <GlobalNavigation
        showBuilderActions={false}
        showMainNav={true}
        showAuthButtons={true}
      />
      
      {/* Header Section */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/enterprise"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Enterprise
          </Link>
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Our Sales Team
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with our enterprise team to explore tailored solutions that enhance your organization's recruitment capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Business Card Section */}
      <div className="px-6 pb-20">
        <BusinessCard />
      </div>

      {/* Additional Information Section */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What to Expect When You Contact Us
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Initial Consultation
                </h3>
                <p className="text-gray-300 text-sm">
                  We'll assess your recruitment objectives and identify opportunities for optimization.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Custom Proposal
                </h3>
                <p className="text-gray-300 text-sm">
                  Receive a comprehensive solution proposal with transparent pricing aligned to your organization's scale.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Implementation
                </h3>
                <p className="text-gray-300 text-sm">
                  Our specialists ensure smooth deployment and provide thorough training for immediate productivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
