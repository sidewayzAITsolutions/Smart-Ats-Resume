'use client';
import React, { useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import {
  ArrowRight,
  Award,
  BarChart2,
  BarChart3,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Headphones,
  Mail,
  Palette,
  Phone,
  Shield,
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
import { useRouter } from 'next/navigation';

type ATSDemoModalProps = {
  open: boolean;
  onClose: () => void;
};

const Page: React.FC = () => {
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(false);





  const WhyChooseSmartATS = {
    title: "Why SmartATS is the Future of Resume Building ",
    subtitle: "Two game-changing features that crush the competition",
    features: [
      {
        title: "Advanced ATS Scorecard",
        description: "Our proprietary ATS scoring algorithm analyzes your resume against real ATS systems used by Fortune 500 companies. You get instant feedback on keyword optimization, formatting compatibility, and section structure that guarantees your resume passes through automated screening systems.",
        icon: "📊",
        highlights: [
          "Real-time ATS compatibility scoring",
          "Keyword density analysis",
          "Format optimization recommendations",
          "Industry-specific ATS insights"
        ]
      },
      {
        title: "AI-Powered Content Generation",
        description: "We leverage cutting-edge artificial intelligence to craft compelling resume content that dominates both ATS systems and human recruiters. Our AI understands industry trends, job requirements, and recruiter preferences to make you stand out.",
        icon: "🤖",
        highlights: [
          "Intelligent bullet point generation",
          "Industry-specific language optimization",
          "Achievement quantification suggestions",
          "Personalized content recommendations"
        ]
      }
    ],
    summary: "While other resume builders waste your time with templates, SmartATS delivers results. Our ATS scorecard guarantees your resume gets past automated filters, while our AI implementation creates content that impresses human recruiters. This isn't about looking good—it's about getting hired."
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
                window.location.href = '/templates';
              } }
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
      {/* LOGO SPLASH SCREEN - ADDED HERE */}
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
        <GlobalNavigation
          showBuilderActions={false}
          showMainNav={true}
          showAuthButtons={true}
        />

        {/* Hero Section */}
        <section className="fit pt-20 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-amber-600/5 to-orange-600/10"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-700"
              >
                <source src="/smart6.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Contact Sales Button */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto flex justify-center">
            <button
              onClick={() => router.push('/contact-sales')}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <Headphones className="w-6 h-6" />
              Contact Sales
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-8 text-md text-gray-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span><strong className="text-gray-300">60%</strong> faster hiring with ATS optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span><strong className="text-gray-300">94%</strong> of recruiters rely on ATS</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-teal-400" />
                <span><strong className="text-gray-300">98.4%</strong> ATS pass rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="w-16 h-16 bg-red-900/50 rounded-2xl flex items-center justify-center mb-6">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Brutal Truth</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-red-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-gray-300">98.4% of Fortune 500 companies use ATS filters</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-red-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-gray-300">75% of qualified candidates get rejected by keyword mismatches</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-red-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-gray-300">70% of resumes get auto-rejected before human review</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-3xl transform -rotate-3"></div>
                <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="w-16 h-16 bg-green-900/50 rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Your Secret Weapon</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-gray-300">AI analyzes job descriptions to deliver perfect keyword matches</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-gray-300">Real-time ATS score with actionable improvements that work</span>
                    </li>
                    <li className="flex items-start gap-3">
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

        {/* Features Grid */}


        {/* Image and Key Stats Section */}
        <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto px-6 mb-20">
          {/* Left side - Image */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src="/4.png"
                alt="SmartATS Resume Builder Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl border border-gray-700"
              />
            </div>
          </div>

          {/* Right side - Key Stats */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-700/30 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Why SmartATS is the New Standard</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-700/30 hover:border-green-500/50 transition-colors">
                <div>
                  <div className="text-2xl font-bold text-green-400">98.4%</div>
                  <div className="text-sm text-gray-300">ATS Pass Rate</div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-900/30 to-amber-900/30 rounded-xl border border-orange-700/30 hover:border-orange-500/50 transition-colors">
                <div>
                  <div className="text-2xl font-bold text-orange-400">75%</div>
                  <div className="text-sm text-gray-300">Resumes Fail ATS</div>
                </div>
                <Target className="w-8 h-8 text-orange-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-xl border border-teal-700/30 hover:border-teal-500/50 transition-colors">
                <div>
                  <div className="text-2xl font-bold text-teal-400">10 min</div>
                  <div className="text-sm text-gray-300">Build Time</div>
                </div>
                <Clock className="w-8 h-8 text-teal-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl border border-amber-700/30 hover:border-amber-500/50 transition-colors">
                <div>
                  <div className="text-2xl font-bold text-amber-400">8+</div>
                  <div className="text-sm text-gray-300">Pro Templates</div>
                </div>
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

          {/* Comparison Table Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-orange-900/10 to-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why SmartATS Crushes
                <span className="block mt-2 bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
                  The Competition
                </span>
              </h2>
              <p className="text-xl text-gray-400 mt-4">See how we dominate the biggest names in resume building</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-6 text-gray-400 font-medium">Features</th>
                    <th className="text-center p-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-black p-2 rounded-lg">
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

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-900/30 via-amber-900/30 to-orange-800/30 border border-orange-700/50 rounded-xl">
                <Sparkles className="w-7 h-7 text-orange-400" />
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
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{WhyChooseSmartATS.title}</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">{WhyChooseSmartATS.subtitle}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {WhyChooseSmartATS.features.map((feature, idx) => (
                <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>

                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, highlightIdx) => (
                      <li key={highlightIdx} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
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
            <div className="bg-gradient-to-r from-teal-900/30 via-amber-900/30 to-orange-900/30 border border-orange-500/30 rounded-2xl p-8 text-center">
              <p className="text-lg text-gray-200 leading-relaxed max-w-4xl mx-auto">
                {WhyChooseSmartATS.summary}
              </p>
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center snap-center">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Free Plan</h3>
                <div className="text-center my-4">
                  <div className="text-5xl font-bold text-white mb-2">$0</div>
                  <div className="text-gray-400">Forever Free</div>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>1 ATS-optimized resume</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>PDF export</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Monthly Plan</h3>
                <div className="text-center my-4">
                  <div className="text-5xl font-bold text-white mb-2">$22</div>
                  <div className="text-gray-400">per month</div>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited resumes</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>AI-powered optimization</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Yearly Plan</h3>
                <div className="text-center my-4">
                  <div className="text-5xl font-bold text-white mb-2">$200</div>
                  <div className="text-gray-400 mb-1">per year</div>
                  <div className="text-teal-400 text-sm font-semibold">Save $64/year</div>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Everything in Monthly</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>2 months free</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group">
                <img
                  src="/new1.png"
                  alt="Contact Information"
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-2 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-center h-full">
                  <img
                    src="/2.png"
                    alt="SmartATS Enterprise Dashboard"
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

       {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Change Your Life Today...
            </h2>
            <p className="text-xl text-white/90 mb-8">
              75% of resumes fail ATS. You won't be one of them.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Zap className="w-5 h-5" />
                Start Building Now
              </button>

              <button
                onClick={() => router.push('/pricing')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition-all duration-200"
              >
                View Pricing
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/80 text-sm mt-6">
              No credit card required • 5 minute setup
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-900 text-gray-400 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8">
                    <img src="/horse-logo.png" alt="SmartATS Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xl font-bold text-white">SmartATS</span>
                </div>
                <p className="text-sm">Beat the bots. Land the job.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/templates" className="hover:text-orange-400 transition-colors">Templates</a></li>
                  <li><a href="/builder" className="hover:text-orange-400 transition-colors">Resume Builder</a></li>
                  <li><a href="/ats-guide" className="hover:text-orange-400 transition-colors">ATS Guide</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="hover:text-orange-400 transition-colors">About</a></li>
                  <li><a href="/pricing" className="hover:text-orange-400 transition-colors">Pricing</a></li>
                  <li><a href="/blog" className="hover:text-orange-400 transition-colors">Blog</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="hover:text-orange-400 transition-colors">Contact</a></li>
                  <li><a href="/privacypolicy" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/termsofservice" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>

                </ul>
              </div>
            </div>

            <div className="border-t border-gray-900 pt-8 text-center text-sm">
              <p>&copy; 2024 SmartATS. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Demo Modal */}
        <ATSDemoModal open={showDemoModal} onClose={() => setShowDemoModal(false)} />

      </div>
    </>

  );
}

export default Page;

