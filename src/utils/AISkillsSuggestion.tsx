import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AISkillsSuggestionProps {
  targetRole: string;
  currentSkills: string[];
  onAddSkills: (skills: string[]) => void;
  isPremium: boolean;
}

export default function AISkillsSuggestion({ 
  targetRole, 
  currentSkills, 
  onAddSkills,
  isPremium 
}: AISkillsSuggestionProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const generateSkillSuggestions = async () => {
    if (!isPremium) {
      toast.error('AI Skills is a premium feature. Please upgrade to access.');
      return;
    }

    if (!targetRole) {
      toast.error('Please enter a target job role first');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Suggest 10 skills that would make a resume stronger for this target role. Include both technical and soft skills.

Target Role: ${targetRole}
Current Skills: ${currentSkills.join(', ') || 'None'}

Return the skills as a comma-separated list with no explanations.`;

      const response = await fetch('/api/ai/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate skill suggestions');
      }

      const json = await response.json();
      const completion: string = json.completion || '';

      const rawSkills = completion
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);

      const newSuggestions = rawSkills.filter(
        (skill) =>
          !currentSkills.some(
            (current) => current.toLowerCase() === skill.toLowerCase()
          )
      );

      setSuggestions(newSuggestions);
      setShowSuggestions(true);

      if (newSuggestions.length === 0) {
        toast('No new skill suggestions available for this role');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate skill suggestions');
    } finally {
      setLoading(false);
    }
  };

  const addSuggestedSkill = (skill: string) => {
    onAddSkills([skill]);
    setSuggestions(prev => prev.filter(s => s !== skill));
    toast.success(`Added "${skill}" to your skills`);
  };

  const addAllSuggestions = () => {
    onAddSkills(suggestions);
    toast.success(`Added ${suggestions.length} skills`);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={generateSkillSuggestions}
        disabled={loading || !isPremium}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
          isPremium
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>AI Suggest Skills</span>
            {!isPremium && <span className="text-xs">(Premium)</span>}
          </>
        )}
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-300">AI-Suggested Skills for {targetRole}:</p>
            <button
              onClick={addAllSuggestions}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((skill, index) => (
              <button
                key={index}
                onClick={() => addSuggestedSkill(skill)}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors text-sm"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
