'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Award,
  BarChart2,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  X,
  Zap,
} from 'lucide-react';

import GlobalNavigation from '@/components/GlobalNavigation';
import LogoSplashScreen from '@/components/LogoSplashScreen';
import ResumeUploadSection from '@/components/ResumeUploadSection';
import TrustBar from '@/components/TrustBar';
import SprintBanner from '@/components/SprintBanner';

type ATSDemoModalProps = {
  open: boolean;
  onClose: () => void;
};

const Page: React.FC = () => {
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const navigateTo = (path: string) => router.push(path);

  const WhyChooseSmartATS = {
    title: "Why SmartATS is the Future of Resume Building",
    subtitle: "The game-changing feature that crushes the competition",
    features: [
      {
        title: "Advanced ATS Scorecard",
        description:
          "Our proprietary ATS scoring algorithm analyzes your resume against real ATS systems used by Fortune 500 companies. You get instant feedback on keyword optimization, formatting compatibility, and section structure that guarantees your resume passes through automated screening systems.",
        icon: "📊",
        highlights: [
          "Real-time ATS compatibility scoring",
          "Keyword density analysis",
          "Format optimization recommendations",
          "Industry-specific ATS insights",
        ],
      },
    ],
    summary:
      "While other resume builders waste your time with templates, SmartATS delivers results. Our ATS scorecard guarantees your resume gets past automated filters, while our AI implementation creates content that impresses human recruiters. This isn't about looking good—it's about getting hired.",
  };

  const ATSDemoModal = ({ open, onClose }: ATSDemoModalProps) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-600/20 to-amber-600/20 rounded-full blur-3xl"></div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Live ATS Analysis Demo</h2>

            <div className="bg-gradient-to-br from-teal-900/50 to-amber-900/50 border border-teal-700/50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-200">ATS Score</span>
                <div className="flex items-center gap-2">
                  <div className="text-4xl font-bold text-teal-400">94</div>
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Keyword Match</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-gradient-to-r from-teal-500 to-amber-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">92%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Format Compatibility</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-[96%] h-full bg-gradient-to-r from-teal-500 to-amber-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">96%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Readability Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-gradient-to-r from-teal-500 to-amber-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">94%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-300">Resume Optimized!</p>
                  <p className="text-sm text-green-400 mt-1">Your resume scored above the 75% threshold - you're ready to dominate submissions!</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigateTo('/templates');
              }}
              className="w-full bg-gradient-to-r from-teal-600 to-amber-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Start Building Your ATS-Dominating Resume
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* LOGO SPLASH SCREEN */}
      <LogoSplashScreen />

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden relative">
        {/* Background Logo - Large and Faded */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-5">
            <img src="/horse-logo.png" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-96 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-float"></div>
        </div>

        {/* Global Navigation */}
        <GlobalNavigation showBuilderActions={false} showMainNav={true} showAuthButtons={true} />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-900/50 to-amber-900/50 border border-teal-700/50 rounded-full mb-8 animate-bounce-slow">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium text-gray-300">Enterprise-Grade ATS Optimization</span>
            </div>

            <h1 className="text-8xl md:text-12xl lg:text-15xl font-bold text-white mb-12 leading-tight" style={{ textShadow: '0 0 20px #fbff00ff, 0 0 40px #00c7b3ff, 0 0 60px #00c7b3ff' }}>
              Smart ATS<br />
              Resume
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                type="button"
                onClick={() => navigateTo('/login')}
                className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Build Your Resume Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform gap-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 bg-gray-800 text-gray-200 font-semibold rounded-xl border-2 border-gray-700 hover:border-teal-500 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-4"
              >
                <BarChart2 className="w-5 h-5" />
                See ATS Analysis Demo
              </button>
            </div>

            <p className="text-xl md:text-4xl text-red-400 mb-12 max-w-5xl mx-auto leading-relaxed">
              <span className="font-bold text-gray-200">Beat The Bots</span>
              <span className="font-bold text-red-500"> Land The Job</span>
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-md text-gray-500">
              <div className="flex flex-wrap items-center justify-center gap-8 text md text-gray-500">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-7 h-7 text-green-400" />
                  <span><strong className="text-gray-300">60%</strong> faster hiring with ATS optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-7 h-7 text-amber-400" />
                  <span><strong className="text-gray-300">94%</strong> of recruiters rely on ATS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group animate-fade-in-up stagger-1">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl hover-card group-hover:border-red-700/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-red-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-800/60 transition-all duration-300">
                    <X className="w-8 h-8 text-red-400 group-hover:rotate-90 transition-transform duration-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Brutal Truth</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <div className="w-5 h-5 bg-red-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-gray-300">98.4% of Fortune 500 companies use ATS filters</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <div className="w-5 h-5 bg-red-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-gray-300">75% of qualified candidates get rejected by keyword mismatches</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <div className="w-5 h-5 bg-red-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-gray-300">70% of resumes get auto-rejected before human review</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative group animate-fade-in-up stagger-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500"></div>
                <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl hover-card group-hover:border-green-700/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-800/60 transition-all duration-300">
                    <CheckCircle className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Your Secret Weapon</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <div className="w-5 h-5 bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-gray-300">AI analyzes job descriptions to deliver perfect keyword matches</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <div className="w-5 h-5 bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-gray-300">Real-time ATS score with actionable improvements that work</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <div className="w-5 h-5 bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-gray-300">Proven templates that dominate all major ATS systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar - Company Logos */}
        <TrustBar />

        {/* Resume Upload Section */}
        <ResumeUploadSection />

        {/* Image Section */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <div className="flex items-center justify-center animate-fade-in-up stagger-1">
            <div className="relative img-zoom rounded-2xl overflow-hidden group">
              <img src="/4.png" alt="SmartATS Resume Builder Dashboard" className="w-full h-auto rounded-2xl shadow-2xl border border-gray-700 group-hover:border-teal-500/50 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Comparison Table Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-orange-900/10 to-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Smart ATS vs.
                <span className="block mt-2 bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent animated-gradient-text">
                  The Competition
                </span>
              </h2>
              <p className="text-xl text-gray-400 mt-4">See how we match up the biggest names in resume building</p>
            </div>

            <div className="overflow-x-auto animate-fade-in-up stagger-2">
              <table className="w-full bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 hover:border-gray-700 transition-colors duration-300">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-6 text-gray-400 font-medium">Features</th>
                    <th className="text-center p-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-black p-2 rounded-lg hover:scale-110 transition-transform duration-300">
                          <img src="/horse-logo.png" alt="SmartATS Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <span className="text-white font-bold">SmartATS</span>
                        <span className="text-green-400 text-sm">$22/mo</span>
                      </div>
                    </th>
                    <th className="text-center p-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-300">Resume.io</span>
                        <span className="text-gray-500 text-sm">$24.95/mo</span>
                      </div>
                    </th>
                    <th className="text-center p-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-300">Zety</span>
                        <span className="text-gray-500 text-sm">$23.70/mo</span>
                      </div>
                    </th>
                    <th className="text-center p-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-300">Jobscan</span>
                        <span className="text-gray-500 text-sm">$49.95/mo</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 text-gray-300">Real-Time ATS Scoring</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><X className="w-6 h-6 text-red-400 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 text-gray-300">All Templates ATS-Optimized</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><span className="text-yellow-400">Only 4</span></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 text-gray-300">Keyword Optimization</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><span className="text-yellow-400">Basic</span></td>
                    <td className="p-6 text-center"><span className="text-yellow-400">Basic</span></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 text-gray-300">Free Downloads</td>
                    <td className="p-6 text-center"><span className="text-green-400">3 Free</span></td>
                    <td className="p-6 text-center"><span className="text-yellow-400">TXT only</span></td>
                    <td className="p-6 text-center"><X className="w-6 h-6 text-red-400 mx-auto" /></td>
                    <td className="p-6 text-center"><span className="text-yellow-400">5 scans/mo</span></td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 text-gray-300">No Hidden Fees</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><span className="text-red-400">Auto-renewal</span></td>
                    <td className="p-6 text-center"><span className="text-red-400">Auto-renewal</span></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 text-gray-300">AI-Powered Suggestions</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 text-gray-300">Value for Money</td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-green-400 text-green-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[...Array(2)].map((_, i) => (
                          <Star key={i + 3} className="w-5 h-5 text-gray-600" />
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[...Array(2)].map((_, i) => (
                          <Star key={i + 3} className="w-5 h-5 text-gray-600" />
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(2)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[...Array(3)].map((_, i) => (
                          <Star key={i + 2} className="w-5 h-5 text-gray-600" />
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-12 text-center animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-900/30 via-amber-900/30 to-orange-800/30 border border-orange-700/50 rounded-xl hover:border-orange-500/70 hover:scale-105 transition-all duration-300 cursor-default">
                <Sparkles className="w-7 h-7 text-orange-400 animate-pulse" />
                <p className="text-orange-300 font-medium">
                  SmartATS SAVES you TIME and DOLLARS while delivering the BEST Quality! <span className="text-orange-400 font-bold">30% more</span> value than competitors
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose SmartATS */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-white mb-4">{WhyChooseSmartATS.title}</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">{WhyChooseSmartATS.subtitle}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {WhyChooseSmartATS.features.map((feature, idx) => (
                <div key={idx} className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 hover-card transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>

                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, highlightIdx) => (
                      <li key={highlightIdx} className="flex items-center gap-3 text-gray-300 hover:translate-x-2 transition-transform duration-300">
                        <div className="w-2 h-2 bg-teal-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-5">
                <img src="/Donkey.png" alt="" className="w-12 h-12 object-contain" />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-teal-900/30 via-amber-900/30 to-orange-900/30 border border-orange-500/30 rounded-2xl p-8 text-center animate-fade-in-up hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
              <p className="text-lg text-gray-200 leading-relaxed max-w-4xl mx-auto">
                {WhyChooseSmartATS.summary}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center snap-center">
              {/* Free Plan Card */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 hover-card transition-all duration-500 animate-fade-in-up relative overflow-hidden">
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-orange-500/10 group-hover:to-amber-500/5 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
                    <DollarSign className="w-7 h-7 text-white group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">Free Plan</h3>
                  <div className="text-center my-4">
                    <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">$0</div>
                    <div className="text-gray-400">Forever Free</div>
                  </div>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[0ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>1 ATS-optimized resume</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[50ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Basic templates</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[100ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>PDF export</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[150ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Monthly Plan Card */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 hover-card transition-all duration-500 animate-fade-in-up stagger-1 relative overflow-hidden">
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-orange-500/10 group-hover:to-amber-500/5 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
                    <DollarSign className="w-7 h-7 text-white group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">Monthly Plan</h3>
                  <div className="text-center my-4">
                    <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">$22</div>
                    <div className="text-gray-400">per month</div>
                  </div>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[0ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Unlimited resumes</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[50ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Premium templates</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[100ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>AI-powered optimization</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[150ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[200ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Cancel anytime</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Yearly Plan Card */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 hover-card transition-all duration-500 animate-fade-in-up stagger-2 relative overflow-hidden">
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-orange-500/10 group-hover:to-amber-500/5 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
                    <DollarSign className="w-7 h-7 text-white group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">Yearly Plan</h3>
                  <div className="text-center my-4">
                    <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">$200</div>
                    <div className="text-gray-400 mb-1">per year</div>
                    <div className="text-teal-400 text-sm font-semibold animate-pulse">Save $64/year</div>
                  </div>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[0ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Everything in Monthly</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[50ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>2 months free</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[100ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[150ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Custom branding</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-[200ms]">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span>Dedicated support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Card */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 hover-card transition-all duration-500 animate-fade-in-up stagger-3 overflow-hidden">
                <div className="img-zoom rounded-lg overflow-hidden">
                  <img
                    src="/new1.png"
                    alt="Contact Information"
                    className="w-full h-auto rounded-lg group-hover:brightness-110 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Dashboard Image Card */}
              <div className="md:col-span-2 lg:col-span-2 group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 hover-card transition-all duration-500 animate-fade-in-up stagger-4 overflow-hidden">
                <div className="flex items-center justify-center h-full img-zoom rounded-xl overflow-hidden">
                  <img
                    src="/2.png"
                    alt="SmartATS Dashboard"
                    className="w-full h-auto rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-amber-500/20 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Hub Section */}
        <section className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <BookOpen className="w-4 h-4" />
                  Free Resources
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  The Career Hub
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Your go-to resource center for job search success. Access expert guides,
                  resume tips, interview strategies, and career advice — all designed to help
                  you stand out and land your dream job.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    Expert resume writing guides & ATS tips
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    Interview preparation strategies
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    Career transition & job search advice
                  </li>
                </ul>
                <Link
                  href="/thecareerhub"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-emerald-500 transition-all duration-300 hover-lift group"
                >
                  Explore Career Hub
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Preview Cards */}
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-2">
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-amber-300" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">Resume Tips</h4>
                  <p className="text-xs text-gray-400">Beat ATS systems with proven strategies</p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-teal-500/50 transition-all">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-3">
                    <User className="w-5 h-5 text-teal-300" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">Interview Prep</h4>
                  <p className="text-xs text-gray-400">Ace your interviews with confidence</p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
                    <Target className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">Job Search</h4>
                  <p className="text-xs text-gray-400">Strategic job hunting guides</p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-purple-500/50 transition-all">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-300" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">Career Advice</h4>
                  <p className="text-xs text-gray-400">Navigate your career path</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-amber-600 to-orange-600 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_transparent_50%,_rgba(0,0,0,0.3)_100%)]"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
              Change Your Life Today...
            </h2>
            <p className="text-xl text-white/90 mb-8 animate-fade-in-up stagger-1">
              75% of resumes fail ATS. You won't be one of them.
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up stagger-2">
              <button
                onClick={() => router.push('/login')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:shadow-2xl hover:shadow-white/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 btn-shine"
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                Start Building Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={() => router.push('/pricing')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 hover:shadow-lg transition-all duration-300"
              >
                View Pricing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Product Hunt & Uneed Badges - moved directly under the primary CTA and slightly larger */}
            <div className="flex justify-center items-center gap-6 mt-6 mb-2 flex-wrap animate-fade-in-up">
              <a
                href="https://www.producthunt.com/products/smart-ats-resume?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-smart-ats-resume"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-95 transition-opacity"
                aria-label="Product Hunt - Smart ATS Resume"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1043803&theme=light&t=1764512215784"
                  alt="Smart ATS Resume on Product Hunt"
                  style={{ width: 280, height: 64 }}
                  width={280}
                  height={64}
                />
              </a>

              <a
                href="https://www.uneed.best/tool/smart-ats-resume"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-95 transition-opacity"
                aria-label="Uneed - Smart ATS Resume"
              >
                <img
                  src="https://www.uneed.best/EMBED1.png"
                  alt="Uneed Embed Badge"
                  style={{ width: 180, height: 64 }}
                />
              </a>
            </div>

            <p className="text-white/80 text-sm mt-6 animate-fade-in-up">
              No credit card required • 5 minute setup
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 bg-black border-t border-gray-900 text-gray-400 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4 group">
                  <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                    <img src="/horse-logo.png" alt="SmartATS Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xl font-bold text-white">SmartATS</span>
                </div>
                <p className="text-sm">Beat the bots. Land the job.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/pricing" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">Pricing</Link></li>
                  <li><Link href="/ats-guide" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">ATS Guide</Link></li>
                  <li><Link href="/thecareerhub" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">Career Hub</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">About</Link></li>
                  <li><Link href="/blog" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">Blog</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/contact" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">Contact</Link></li>
                  <li><Link href="/privacypolicy" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">Privacy Policy</Link></li>
                  <li><Link href="/termsofservice" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-900 pt-8 text-center text-sm">
              <p>&copy; 2025 SmartATS. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Demo Modal */}
        <ATSDemoModal open={showDemoModal} onClose={() => setShowDemoModal(false)} />
      </div>
    </>
  );
};

export default Page;
