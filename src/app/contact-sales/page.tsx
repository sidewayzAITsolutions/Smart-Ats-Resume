'use client';

import React from 'react';

import { ArrowLeft, Mail, Phone, Calendar, MessageCircle, Users, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
            href="/"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Our Sales Team
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to take your resume to the next level? Our team is here to help you find the perfect plan for your career goals.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Options Section */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Contact */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-300 mb-4">Get a response within 24 hours</p>
              <a 
                href="mailto:sales@smartatsresume.com" 
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                sales@smartatsresume.com
              </a>
            </div>

            {/* Schedule Call */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 bg-teal-600/20 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Schedule a Call</h3>
              <p className="text-gray-300 mb-4">Book a free consultation</p>
              <a 
                href="mailto:sales@smartatsresume.com?subject=Schedule a Call" 
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
              >
                Request a callback
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Contact Us Section */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            How We Can Help You
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Plan Selection</h3>
              <p className="text-gray-400 text-sm">
                Not sure which plan fits your needs? We'll help you choose the right features for your job search.
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Premium Features</h3>
              <p className="text-gray-400 text-sm">
                Learn about our advanced AI tools, unlimited resume builds, and priority support options.
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Custom Solutions</h3>
              <p className="text-gray-400 text-sm">
                Need something specific? We're happy to discuss custom pricing for teams or special requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What to Expect Section */}
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
                  Quick Response
                </h3>
                <p className="text-gray-300 text-sm">
                  We'll respond to your inquiry within 24 hours with personalized recommendations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Tailored Advice
                </h3>
                <p className="text-gray-300 text-sm">
                  Get expert guidance on maximizing your ATS score and landing more interviews.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Pressure
                </h3>
                <p className="text-gray-300 text-sm">
                  We're here to help, not sell. Ask questions and explore options at your own pace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl p-8 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 mb-6">
              Create your ATS-optimized resume today and start landing more interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/builder"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all"
              >
                <Zap className="w-5 h-5" />
                Start Building Free
              </Link>
              <Link 
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
