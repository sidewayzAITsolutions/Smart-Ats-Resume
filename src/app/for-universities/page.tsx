'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, Calendar, GraduationCap, Users, TrendingUp, Award, Building, CheckCircle, Zap, BookOpen, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import GlobalNavigation from '@/components/GlobalNavigation';
import toast from 'react-hot-toast';

export default function ForUniversitiesPage() {
  const [formData, setFormData] = useState({
    universityName: '',
    contactName: '',
    email: '',
    phone: '',
    numberOfStudents: '',
    department: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In production, this would send to your sales CRM
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'university_partnership'
        })
      });
      
      if (response.ok) {
        toast.success('Thank you! Our university partnerships team will contact you within 24 hours.');
        setFormData({
          universityName: '',
          contactName: '',
          email: '',
          phone: '',
          numberOfStudents: '',
          department: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please email us at universities@smartatsresume.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { value: '85%', label: 'Average Student Placement Rate Increase', icon: TrendingUp },
    { value: '50+', label: 'University Partners Nationwide', icon: Building },
    { value: '100K+', label: 'Students Helped Land Jobs', icon: Users },
    { value: '4.9/5', label: 'Average Satisfaction Rating', icon: Award }
  ];

  const features = [
    {
      title: 'Bulk Student Licenses',
      description: 'Provide every student in your career center with unlimited access to AI-powered resume optimization.',
      icon: Users
    },
    {
      title: 'Admin Dashboard',
      description: 'Track student engagement, completion rates, and success metrics with our comprehensive analytics.',
      icon: BarChart3
    },
    {
      title: 'LMS Integration',
      description: 'Seamlessly integrate with Canvas, Blackboard, Moodle, and other learning management systems.',
      icon: BookOpen
    },
    {
      title: 'Custom Branding',
      description: 'White-label the platform with your university logo, colors, and career center branding.',
      icon: GraduationCap
    },
    {
      title: 'Dedicated Support',
      description: 'Priority support channel with dedicated account manager for your institution.',
      icon: Zap
    },
    {
      title: 'Workshops & Training',
      description: 'Free training sessions for career counselors and workshop materials for students.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Navigation */}
      <GlobalNavigation
        showBuilderActions={false}
        showMainNav={true}
        showAuthButtons={true}
      />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                University Partnerships
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Boost Your Students&apos;{' '}
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Placement Rates
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Partner with Smart ATS Resume to give your students the competitive edge they need. 
                Our AI-powered platform helps students create ATS-optimized resumes that get noticed by employers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contact-form"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule a Demo
                </a>
                <a 
                  href="mailto:universities@smartatsresume.com"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all text-lg"
                >
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50"
                >
                  <stat.icon className="w-8 h-8 text-amber-400 mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Universities Choose Us */}
      <div className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Top Universities Choose Smart ATS Resume
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Empower your career center with enterprise-grade tools designed specifically for academic institutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Career Centers Nationwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                &quot;Our placement rate increased by 23% after implementing Smart ATS Resume. Students love how easy it is to optimize their resumes.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <div className="text-white font-medium">Dr. Jennifer Davis</div>
                  <div className="text-gray-500 text-sm">Career Center Director, State University</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                &quot;The admin dashboard gives us incredible insights into how students are engaging with resume building. Game changer for our programs.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  MP
                </div>
                <div>
                  <div className="text-white font-medium">Mark Peterson</div>
                  <div className="text-gray-500 text-sm">Associate Dean, Tech Institute</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                &quot;We&apos;ve integrated Smart ATS Resume into our Professional Development curriculum. Students graduate with polished, ATS-ready resumes.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SC
                </div>
                <div>
                  <div className="text-white font-medium">Sarah Chen</div>
                  <div className="text-gray-500 text-sm">Career Services Manager, Business School</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Flexible Pricing for Every Institution
            </h2>
            <p className="text-xl text-gray-400">
              Volume discounts available for large universities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-2">Small</h3>
              <p className="text-gray-400 mb-4">Up to 500 students</p>
              <div className="text-3xl font-bold text-white mb-4">
                $2,500<span className="text-lg text-gray-400">/year</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Full platform access
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Basic analytics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Email support
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-b from-amber-600/20 to-orange-600/20 rounded-2xl p-6 border-2 border-amber-500/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-600 rounded-full text-sm font-medium text-white">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Medium</h3>
              <p className="text-gray-400 mb-4">501 - 5,000 students</p>
              <div className="text-3xl font-bold text-white mb-4">
                $7,500<span className="text-lg text-gray-400">/year</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Everything in Small
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Admin dashboard
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  LMS integration
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Priority support
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-4">5,000+ students</p>
              <div className="text-3xl font-bold text-white mb-4">
                Custom
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Everything in Medium
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Custom branding
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Dedicated account manager
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  On-site training
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact-form" className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your University Partnership
            </h2>
            <p className="text-xl text-gray-400">
              Fill out the form below and we&apos;ll get back to you within 24 hours
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  University Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.universityName}
                  onChange={(e) => setFormData(prev => ({ ...prev, universityName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="e.g., State University"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="you@university.edu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Students *
                </label>
                <select
                  required
                  value={formData.numberOfStudents}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfStudents: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select range...</option>
                  <option value="1-500">1 - 500</option>
                  <option value="501-1000">501 - 1,000</option>
                  <option value="1001-5000">1,001 - 5,000</option>
                  <option value="5001-10000">5,001 - 10,000</option>
                  <option value="10001+">10,001+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="e.g., Career Services"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                How can we help?
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Tell us about your goals and how we can support your students..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request Partnership Information'}
            </button>
          </form>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl p-8 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions? We&apos;re Here to Help
            </h2>
            <p className="text-gray-300 mb-6">
              Reach out to our university partnerships team directly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:universities@smartatsresume.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all"
              >
                <Mail className="w-5 h-5" />
                universities@smartatsresume.com
              </a>
              <a 
                href="tel:+18005551234"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
              >
                1-800-555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
