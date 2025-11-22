// src/components/Builder/sections/SummaryForm.tsx
'use client';

import React, { useState } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { callAICompletion } from '@/utils/ai';

interface SummaryFormProps {
  data: string;
  onChange: (summary: string) => void;
  jobTitle?: string;
}

export default function SummaryForm({ data, onChange, jobTitle }: SummaryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(data.length);

  const handleChange = (value: string) => {
    // Enforce 500 character limit
    const truncated = value.slice(0, 500);
    onChange(truncated);
    setCharCount(truncated.length);
  };

  const generateAISummary = async () => {
    if (!jobTitle) {
      toast.error('Please add a job title first');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional summary for a resume for someone with the job title: "${jobTitle}".

      The summary should be:
      - 2-4 sentences long
      - Highlight key strengths and experience relevant to the role
      - Use professional language
      - Include relevant keywords for ATS optimization
      - MUST be under 500 characters

      Return only the summary text, no additional formatting.`;

      const summary = await callAICompletion(prompt, {
        temperature: 0.7,
        maxTokens: 200,
      });

      if (!summary || summary.trim().length === 0) {
        throw new Error('No summary was generated');
      }

      // Enforce 500 character limit
      const truncatedSummary = summary.trim().slice(0, 500);
      handleChange(truncatedSummary);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Failed to generate summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Tips for a great summary:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep it concise (2-4 sentences)</li>
              <li>Highlight your key strengths and experience</li>
              <li>Tailor it to the job you're applying for</li>
              <li>Use keywords from the job description</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
          <button type="button"
            onClick={generateAISummary}
            disabled={isGenerating || !jobTitle}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <textarea
          value={data}
          onChange={(e) => handleChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
        />

        <div className="mt-1 text-sm text-gray-500 text-right">{charCount} / 500 characters</div>
      </div>

      {!jobTitle && (
        <p className="text-sm text-amber-600">💡 Add a job title in Personal Info to enable AI summary generation</p>
      )}
    </div>
  );
}

