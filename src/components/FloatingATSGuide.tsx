// FloatingATSGuide.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Search, 
  Target, 
  Zap, 
  TrendingUp, 
  Shield, 
  Clock,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  X,
  BookOpen,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const FloatingATSGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const stats = [
    { number: "90%", label: "Fortune 500 companies use ATS", icon: <Users className="w-4 h-4" /> },
    { number: "6 sec", label: "Average ATS scan time", icon: <Clock className="w-4 h-4" /> },
    { number: "75%", label: "Resumes filtered out by ATS", icon: <Shield className="w-4 h-4" /> },
    { number: "3x", label: "Higher interview rate with optimization", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const quickTips = [
    {
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      title: "Use Standard Fonts",
      description: "Stick to Arial, Calibri, or Times New Roman"
    },
    {
      icon: <Search className="w-5 h-5 text-purple-400" />,
      title: "Include Keywords",
      description: "Mirror keywords from job descriptions"
    },
    {
      icon: <Target className="w-5 h-5 text-green-400" />,
      title: "Simple Formatting",
      description: "Avoid tables, graphics, and complex layouts"
    },
    {
      icon: <Eye className="w-5 h-5 text-orange-400" />,
      title: "Use Standard Sections",
      description: "Experience, Education, Skills sections"
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      {/* Collapsed State */}
      {!isExpanded && (
        <div 
          className="bg-gradient-to-r from-teal-600 to-amber-600 text-white p-4 rounded-2xl shadow-2xl cursor-pointer hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border border-teal-500/30"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">ATS Guide</div>
              <div className="text-xs opacity-90">Quick tips to beat ATS</div>
            </div>
            <ChevronUp className="w-5 h-5 opacity-70" />
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto">
          {/* Rest of the component remains the same */}
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-amber-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white">ATS Optimization Guide</div>
                  <div className="text-xs text-white/90">Dominate the bots, land interviews</div>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content - keeping the rest of the component the same */}
          <div className="p-4 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    {stat.icon}
                    <div className="text-lg font-bold text-white">{stat.number}</div>
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-300">Quick Tips</h3>
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  {tip.icon}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{tip.title}</div>
                    <div className="text-xs text-gray-400">{tip.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-teal-600/20 to-amber-600/20 rounded-lg p-4 border border-teal-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Need more help?</div>
                  <div className="text-xs text-gray-400">Get personalized feedback that works</div>
                </div>
                <button className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Analyze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingATSGuide;
