'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, AlertCircle, CheckCircle, X } from 'lucide-react';

interface MetricInsight {
  label: string;
  explanation: string;
  whatsMissing: string[];
  recommendations: string[];
  examples: string[];
}

interface ATSScoreProps {
  score: number;
  breakdown?: {
    keywords: number;
    formatting: number;
    content: number;
    impact: number;
  };
  issues?: string[];
  suggestions?: string[];
  metricInsights?: {
    keywords: MetricInsight;
    formatting: MetricInsight;
    content: MetricInsight;
    impact: MetricInsight;
  };
}

const CollapsibleATSScore = ({ score, breakdown, issues = [], suggestions = [], metricInsights }: ATSScoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMetric, setOpenMetric] = useState<string | null>(null);

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500 border-green-500';
    if (score >= 60) return 'text-amber-500 border-amber-500';
    return 'text-red-500 border-red-500';
  };

  const getScoreColorBg = () => {
    if (score >= 80) return 'from-green-500/20 to-green-600/20';
    if (score >= 60) return 'from-amber-500/20 to-amber-600/20';
    return 'from-red-500/20 to-red-600/20';
  };

  const getScoreStatus = () => {
    if (score >= 80) return { text: 'Excellent', icon: CheckCircle };
    if (score >= 60) return { text: 'Good', icon: TrendingUp };
    return { text: 'Needs Work', icon: AlertCircle };
  };

  const status = getScoreStatus();

  const metricOrder: Array<keyof NonNullable<ATSScoreProps['breakdown']>> = [
    'keywords',
    'impact',
    'content',
    'formatting',
  ];

  const metricLabelOverride: Record<string, string> = {
    keywords: 'Keywords & Relevance',
    impact: 'Impact & Achievements',
    content: 'Content Depth',
    formatting: 'Formatting & Core Sections',
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Collapsed State - Circle */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`relative w-20 h-20 rounded-full border-4 ${getScoreColor()} bg-gray-900 hover:scale-110 transition-all duration-300 shadow-2xl`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}%</span>
              <span className="text-[10px] text-gray-400 block -mt-1">ATS</span>
            </div>
          </div>
          {/* Animated ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - score / 100)}`}
              className={`${getScoreColor()} transition-all duration-1000`}
            />
          </svg>
        </button>
      )}

      {/* Expanded State - Card */}
      {isExpanded && (
        <div className={`bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-96 overflow-hidden`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${getScoreColorBg()} p-6 relative`}>
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                    className={`${getScoreColor()} transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}%</span>
                    <span className="text-xs text-gray-300 block">ATS Score</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <status.icon className={`w-5 h-5 ${getScoreColor()}`} />
                  <h3 className="text-xl font-bold text-white">{status.text}</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  {score >= 80 ? 'Your resume is well-optimized for ATS!' :
                   score >= 60 ? 'Good progress, but room for improvement.' :
                   'Your resume needs optimization for ATS systems.'}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown with per-metric coaching */}
          {breakdown && (
            <div className="p-6 border-b border-gray-800">
              <h4 className="text-white font-semibold mb-4">Score Breakdown</h4>
              <div className="space-y-3">
                {metricOrder.map((metricKey) => {
                  const value = breakdown[metricKey];
                  if (typeof value !== 'number') return null;

                  const isLow = value < 60;
                  const hasInsights = metricInsights && metricInsights[metricKey];
                  const insight = hasInsights ? metricInsights![metricKey] : undefined;
                  const isOpen = openMetric === metricKey;

                  const label = insight?.label || metricLabelOverride[metricKey] || metricKey;

                  return (
                    <div key={metricKey} className="border border-gray-800/60 rounded-lg overflow-hidden bg-gray-900/60">
                      <button
                        type="button"
                        onClick={() => setOpenMetric(isOpen ? null : metricKey)}
                        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-800/70 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-sm mb-0.5">
                            <span className="text-gray-200 font-medium">
                              {label}
                            </span>
                            {isLow && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/40">
                                Needs Attention
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className={`font-semibold ${
                              value >= 80 ? 'text-green-400' :
                              value >= 60 ? 'text-amber-400' :
                              'text-red-400'
                            }`}>
                              {value}%
                            </span>
                            {insight?.explanation && (
                              <span className="truncate max-w-[180px]">
                                {insight.explanation}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                value >= 80 ? 'bg-green-500' :
                                value >= 60 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isOpen && hasInsights && insight && (
                        <div className="px-3 pb-3 pt-1 text-xs text-gray-300 space-y-2 bg-gray-900">
                          <p className="text-[11px] text-gray-400">
                            {insight.explanation}
                          </p>

                          {insight.whatsMissing && insight.whatsMissing.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-200 mb-1">What's missing</p>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-400">
                                {insight.whatsMissing.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {insight.recommendations && insight.recommendations.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-200 mb-1">How to improve</p>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-400">
                                {insight.recommendations.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {insight.examples && insight.examples.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-200 mb-1">Example bullets</p>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-400">
                                {insight.examples.slice(0, 2).map((item, idx) => (
                                  <li key={idx}>
                                    <span className="text-gray-500">"</span>
                                    {item.replace(/^"|"$/g, '')}
                                    <span className="text-gray-500">"</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Issues & Suggestions */}
          <div className="p-6 max-h-64 overflow-y-auto">
            {issues.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Issues Found
                </h4>
                <ul className="space-y-1">
                  {issues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Suggestions
                </h4>
                <ul className="space-y-1">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="p-4 bg-gray-800/50">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              <ChevronUp className="w-4 h-4" />
              Minimize
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleATSScore;