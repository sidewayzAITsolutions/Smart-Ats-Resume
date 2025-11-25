'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Users, Zap, Shield, Award, Globe, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe everyone deserves a fair shot at their dream job. Our AI-powered tools level the playing field.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature we build starts with understanding job seekers\' real challenges and needs.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We constantly push the boundaries of what\'s possible with AI and resume technology.',
      color: 'yellow'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is yours. We implement the highest security standards to protect your information.',
      color: 'purple'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Resumes Created' },
    { value: '85%', label: 'ATS Pass Rate' },
    { value: '10K+', label: 'Happy Users' },
    { value: '4.9', label: 'User Rating' }
  ];

  const team = [
    {
      name: 'Smart ATS Team',
      role: 'Engineering & Product',
      description: 'A dedicated team of engineers and product specialists passionate about helping job seekers succeed.'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-100 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            About Smart ATS Resume
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Empowering job seekers with AI-powered resume tools to beat Applicant Tracking Systems and land their dream jobs.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Making Job Applications <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Fairer for Everyone</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                In today's job market, over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. 
                We're on a mission to change that.
              </p>
              <p className="text-lg text-gray-600">
                Smart ATS Resume was built to give every job seeker the tools they need to create resumes that not only pass 
                ATS filters but also impress hiring managers. We combine cutting-edge AI with proven resume best practices 
                to help you stand out.
              </p>
            </div>
            <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <Award className="w-16 h-16 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Our Promise</h3>
                <p className="text-blue-100 text-lg">
                  We're committed to continuously improving our AI to help you create the most effective, 
                  ATS-optimized resumes possible. Your success is our success.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center animate-bounce-gentle">
                <Heart className="w-12 h-12 text-yellow-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Smart ATS Resume.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              const colorClasses: Record<string, { bg: string; icon: string }> = {
                blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
                green: { bg: 'bg-green-100', icon: 'text-green-600' },
                yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600' },
                purple: { bg: 'bg-purple-100', icon: 'text-purple-600' }
              };
              const colors = colorClasses[value.color];
              
              return (
                <div 
                  key={value.title}
                  className="bg-white rounded-2xl p-6 shadow-lg hover-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to maximize your job search success.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover-card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Resume Builder</h3>
              <p className="text-gray-600">
                Create professional, ATS-optimized resumes with our intelligent builder that suggests improvements in real-time.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover-card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ATS Score Analysis</h3>
              <p className="text-gray-600">
                Get instant feedback on how well your resume will perform with Applicant Tracking Systems used by top employers.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover-card animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Templates</h3>
              <p className="text-gray-600">
                Choose from a variety of professionally designed templates that are proven to work with modern ATS software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have already improved their resumes with Smart ATS Resume.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/builder" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover-lift btn-shine"
            >
              Start Building Your Resume
            </Link>
            <Link 
              href="/contact" 
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover-lift"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
