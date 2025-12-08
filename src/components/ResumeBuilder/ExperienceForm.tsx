// src/components/ResumeBuilder/ExperienceForm.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { Experience } from '../../types/resume';
import { Plus, Trash2, Calendar, Building, Briefcase, Star, Lightbulb, Loader, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast'; // Import toast
import { callAICompletion } from '@/utils/ai';

interface ExperienceFormProps {
  initialData: Experience[];
  onUpdate: (experience: Experience[]) => void;
  jobDescription: string;
  isProUser: boolean; // Passed from parent for premium check
  onUpgradeClick: () => void; // Callback to trigger parent's upgrade modal
}

export default function ExperienceForm({ initialData, onUpdate, jobDescription, isProUser, onUpgradeClick }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(
    initialData.length > 0 ? initialData : [createEmptyExperience()]
  );
  const [generatingAchievementIndex, setGeneratingAchievementIndex] = useState<number | null>(null);
  const [generatingBulletsIndex, setGeneratingBulletsIndex] = useState<number | null>(null);

function createEmptyExperience(): Experience {
  return {
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    keywords: []
  };
}

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | boolean | string[]
  ) => {
    const updated = experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const addExperience = () => {
    const updated = [...experiences, createEmptyExperience()];
    setExperiences(updated);
    onUpdate(updated);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const updated = experiences.filter((_, i) => i !== index);
      setExperiences(updated);
      onUpdate(updated);
    }
  };

  const addAchievement = (expIndex: number) => {
    const updated = experiences.map((exp, i) => 
      i === expIndex ? { ...exp, achievements: [...exp.achievements, ''] } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = experiences.map((exp, i) => 
      i === expIndex ? {
        ...exp,
        achievements: exp.achievements.map((ach: string, j: number) => j === achIndex ? value : ach)
      } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = experiences.map((exp, i) => 
      i === expIndex ? {
        ...exp,
        achievements: exp.achievements.filter((_: string, j: number) => j !== achIndex)
      } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  // AI Achievement Generation Function
  const generateAchievementSuggestions = useCallback(async (expIndex: number) => {
    if (!isProUser) {
      onUpgradeClick(); // Trigger parent's upgrade modal
      return;
    }

    const experience = experiences[expIndex];
    if (!experience.position || !experience.company || !experience.description) {
      toast.error("Please fill in job title, company, and job description for AI to work.");
      return;
    }

    setGeneratingAchievementIndex(expIndex);

    try {
      const prompt = `Generate 3-5 impactful, quantifiable, and ATS-friendly achievement bullet points for a resume. Focus on results using action verbs.

Job Title: ${experience.position}
Company: ${experience.company}
My Responsibilities/Summary for this role: ${experience.description}
${jobDescription ? `Target Job Description (for keywords): ${jobDescription}` : ''}

Return only bullet points starting with "- ", one per line.`;

      const completion = await callAICompletion(prompt, {
        model: 'gpt-4o-mini',
        maxTokens: 600,
        temperature: 0.7,
        debug: false,
      });

      const generatedAchievements = completion
        .split('\n')
        .map((line: string) => line.trim().replace(/^[-\u2022*]\s*/, ''))
        .filter((line: string) => line.length > 0);

      const updatedExperiences = experiences.map((exp, i) =>
        i === expIndex ? { ...exp, achievements: generatedAchievements.filter(Boolean) } : exp
      );
      setExperiences(updatedExperiences);
      onUpdate(updatedExperiences);
      toast.success('AI achievements generated!');
    } catch (err) {
      console.error('Error generating achievements:', err);
      toast.error('Failed to generate achievements. Please try again.');
    } finally {
      setGeneratingAchievementIndex(null);
    }
  }, [experiences, jobDescription, onUpdate, isProUser, onUpgradeClick]);

  // AI Bullet Points Generation Function (Premium Feature)
  const generateBulletPoints = useCallback(async (expIndex: number) => {
    // Check premium status first
    if (!isProUser) {
      onUpgradeClick(); // Trigger parent's upgrade modal
      toast.error('This feature requires a Premium subscription');
      return;
    }

    const experience = experiences[expIndex];
    
    // Validate required fields
    if (!experience.position || !experience.company) {
      toast.error('Please fill in at least the job title and company name');
      return;
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      toast.error('Please provide a target job description for tailored bullet points');
      return;
    }

    setGeneratingBulletsIndex(expIndex);

    try {
      // Build role history from all experiences
      const roleHistory = experiences.map(exp => ({
        title: exp.position,
        company: exp.company,
        duration: exp.startDate && exp.endDate 
          ? `${exp.startDate} - ${exp.endDate}` 
          : exp.current 
            ? `${exp.startDate} - Present` 
            : exp.startDate || undefined,
        responsibilities: exp.description ? [exp.description] : undefined
      })).filter(role => role.title && role.company);

      // Call the generate-bullets API
      const response = await fetch('/api/generate-bullets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: experience.position,
          jobDescription: jobDescription,
          roleHistory: roleHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate bullet points');
      }

      const data = await response.json();
      const bulletPoints: string[] = data.bulletPoints;

      if (!bulletPoints || bulletPoints.length === 0) {
        throw new Error('No bullet points generated');
      }

      // Update the experience with generated bullet points as achievements
      const updatedExperiences = experiences.map((exp, i) =>
        i === expIndex ? { ...exp, achievements: bulletPoints } : exp
      );
      
      setExperiences(updatedExperiences);
      onUpdate(updatedExperiences);
      
      toast.success(`Generated ${bulletPoints.length} tailored bullet points!`);
    } catch (err) {
      console.error('Error generating bullet points:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate bullet points';
      toast.error(errorMessage);
    } finally {
      setGeneratingBulletsIndex(null);
    }
  }, [experiences, jobDescription, onUpdate, isProUser, onUpgradeClick]);

  const actionVerbSuggestions = [
    'Achieved', 'Managed', 'Led', 'Developed', 'Implemented', 'Increased', 'Decreased',
    'Improved', 'Created', 'Built', 'Designed', 'Optimized', 'Streamlined', 'Coordinated',
    'Supervised', 'Trained', 'Mentored', 'Negotiated', 'Delivered', 'Launched'
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-pink-500 mb-2">Work Experience</h2>
          <p className="text-lg text-white">
            Add your work experience, starting with your most recent position. Focus on achievements and quantifiable results.
          </p>
        </div>
        <Button onClick={addExperience} variant="outline" className="btn-modern"> {/* Apply btn-modern */}
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-8">
        {experiences.map((experience, expIndex) => (
          <div key={experience.id} className="border border-gray-700 rounded-lg p-6 bg-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
                {experience.position || `Experience ${expIndex + 1}`}
              </h3>
              {experiences.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeExperience(expIndex)}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) => updateExperience(expIndex, 'position', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sleek-input placeholder-gray-400"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Company *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sleek-input placeholder-gray-400"
                    placeholder="e.g., Tech Company Inc."
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex gap-2 pl-10">
                    <select
                      value={experience.startDate ? experience.startDate.split('-')[1] : ''}
                      onChange={(e) => {
                        const year = experience.startDate ? experience.startDate.split('-')[0] : new Date().getFullYear().toString();
                        const month = e.target.value;
                        updateExperience(expIndex, 'startDate', month ? `${year}-${month}` : '');
                      }}
                      className="flex-1 pr-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sleek-input placeholder-gray-400"
                    >
                      <option value="">Month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    <select
                      value={experience.startDate ? experience.startDate.split('-')[0] : ''}
                      onChange={(e) => {
                        const month = experience.startDate ? experience.startDate.split('-')[1] : '';
                        const year = e.target.value;
                        updateExperience(expIndex, 'startDate', year && month ? `${year}-${month}` : '');
                      }}
                      className="flex-1 pr-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sleek-input placeholder-gray-400"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 50 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  End Date
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex gap-2 pl-10">
                      <select
                        value={experience.endDate ? experience.endDate.split('-')[1] : ''}
                        onChange={(e) => {
                          const year = experience.endDate ? experience.endDate.split('-')[0] : new Date().getFullYear().toString();
                          const month = e.target.value;
                          updateExperience(expIndex, 'endDate', month ? `${year}-${month}` : '');
                        }}
                        disabled={experience.current}
                        className="flex-1 pr-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:text-gray-400 sleek-input placeholder-gray-400"
                      >
                        <option value="">Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                      <select
                        value={experience.endDate ? experience.endDate.split('-')[0] : ''}
                        onChange={(e) => {
                          const month = experience.endDate ? experience.endDate.split('-')[1] : '';
                          const year = e.target.value;
                          updateExperience(expIndex, 'endDate', year && month ? `${year}-${month}` : '');
                        }}
                        disabled={experience.current}
                        className="flex-1 pr-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:text-gray-400 sleek-input placeholder-gray-400"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 50 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center text-sm text-white">
                    <input
                      type="checkbox"
                      checked={experience.current}
                      onChange={(e) => {
                        updateExperience(expIndex, 'current', e.target.checked);
                        if (e.target.checked) {
                          updateExperience(expIndex, 'endDate', '');
                        }
                      }}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    I currently work here
                  </label>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white">
                  Job Description
                </label>
                {/* Generate Bullet Points with AI Button - Premium Feature */}
                <Button
                  onClick={() => generateBulletPoints(expIndex)}
                  disabled={generatingBulletsIndex === expIndex}
                  size="sm"
                  variant="ghost"
                  className={`flex items-center gap-1 ${
                    isProUser 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  } px-3 py-1.5 rounded-lg transition-all duration-200`}
                >
                  {generatingBulletsIndex === expIndex ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">
                    {generatingBulletsIndex === expIndex ? 'Generating...' : 'Generate Bullet Points with AI'}
                  </span>
                  {!isProUser && <Crown className="w-3 h-3 text-amber-400 ml-1" />}
                </Button>
              </div>
              <textarea
                value={experience.description}
                onChange={(e) => updateExperience(expIndex, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sleek-input placeholder-gray-400"
                placeholder="Brief description of your role and responsibilities..."
              />
              <p className="mt-1 text-xs text-gray-400">
                Keep it concise - focus on your key responsibilities and the scope of your role
              </p>
              {/* Premium Feature Info */}
              {!isProUser && (
                <div className="mt-2 flex items-center gap-2 text-xs text-amber-400/80 bg-amber-900/20 border border-amber-700/30 rounded-lg px-3 py-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>
                    <strong>Premium Feature:</strong> Generate tailored, metric-driven bullet points based on the target job description
                  </span>
                </div>
              )}
            </div>

            {/* Key Achievements */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-white">
                  Key Achievements *
                </label>
                <div className="flex items-center gap-2">
                  {/* AI Generate Achievements Button */}
                  <Button
                    onClick={() => generateAchievementSuggestions(expIndex)}
                    disabled={generatingAchievementIndex === expIndex} // Only disable if this specific index is generating
                    size="sm"
                    variant="ghost"
                    className="flex items-center text-primary-dark-blue-600 hover:text-primary-dark-blue-800 hover:bg-primary-dark-blue-50" // Apply matte blue
                  >
                    {generatingAchievementIndex === expIndex ? (
                      <Loader className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Lightbulb className="w-4 h-4 mr-1" />
                    )}
                    AI Generate
                    {!isProUser && <span className="text-xs ml-1 text-gray-400">(Pro)</span>}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(expIndex)}
                    className="btn-modern" // Apply btn-modern
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Achievement
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {experience.achievements.map((achievement: string, achIndex: number) => (
                  <div key={achIndex} className="flex gap-3">
                    <textarea
                      value={achievement}
                      onChange={(e) => updateAchievement(expIndex, achIndex, e.target.value)}
                      rows={2}
                      className="flex-1 px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sleek-input placeholder-gray-400"
                      placeholder="• Increased sales by 25% through strategic client relationship management and cross-selling initiatives"
                    />
                    {experience.achievements.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAchievement(expIndex, achIndex)}
                        className="text-red-400 hover:text-red-300 border-red-700 hover:bg-red-900/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Achievement Tips */}
              <div className="mt-4 bg-amber-900/30 border border-amber-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-amber-300 mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Achievement Writing Tips
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-300">
                  <div>
                    <p className="font-medium mb-1">Start with action verbs:</p>
                    <div className="flex flex-wrap gap-1">
                      {actionVerbSuggestions.slice(0, 6).map(verb => (
                        <span key={verb} className="bg-amber-800/50 px-2 py-1 rounded text-xs text-amber-200">
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Include numbers:</p>
                    <ul className="space-y-1">
                      <li>• Percentages (increased by 25%)</li>
                      <li>• Dollar amounts ($50K savings)</li>
                      <li>• Time frames (within 6 months)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Tips */}
      <div className="bg-teal-900/30 border border-teal-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-teal-300 mb-3">💡 Experience Section Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <h4 className="font-medium mb-2">What ATS Systems Look For:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Relevant job titles and company names</li>
              <li>• Industry-specific keywords and skills</li>
              <li>• Clear employment dates and progression</li>
              <li>• Quantified achievements with numbers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Best Practices:</h4>
            <ul className="space-y-1 text-sm">
              <li>• List experiences in reverse chronological order</li>
              <li>• Focus on achievements, not just responsibilities</li>
              <li>• Use keywords from the job description</li>
              <li>• Keep bullet points concise but impactful</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
// You can add other resume-related types here
export interface Resume {
  experiences: Experience[];
  // ... other resume fields
}