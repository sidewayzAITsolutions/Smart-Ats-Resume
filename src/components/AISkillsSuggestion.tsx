import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles } from 'lucide-react'; // Assuming lucide-react for icons

interface AISkillsSuggestionProps {
    currentSkills: string[];https://gemini.google.com/u/2/app/509c8652e835a4ed
    jobDescription: string;
    onAddSkills: (skills: string[]) => void;
    onLoadingChange: (isLoading: boolean) => void;
}

const AISkillsSuggestion: React.FC<AISkillsSuggestionProps> = ({
    currentSkills,
    jobDescription,
    onAddSkills,
    onLoadingChange,
}) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAISuggestions = async () => {
        setIsLoading(true);
        onLoadingChange(true);
        setError(null);
        try {
            const prompt = `Given the following current skills: "${currentSkills.join(', ')}" and job description: "${jobDescription}", suggest 5-10 relevant skills that are missing from the current skills but present in the job description or highly relevant to it. Provide the skills as a comma-separated list.`;

            const apiKey = ""; // Canvas will provide this at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "suggestedSkills": {
                                type: "ARRAY",
                                items: { "type": "STRING" }
                            }
                        },
                        "propertyOrdering": ["suggestedSkills"]
                    }
                }
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${errorData.error.message || response.statusText}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonString = result.candidates[0].content.parts[0].text;
                const parsedResult = JSON.parse(jsonString);
                const newSuggestions = parsedResult.suggestedSkills.filter(
                    (skill: string) => !currentSkills.includes(skill.trim())
                );
                setSuggestions(newSuggestions);
            } else {
                setError("No suggestions found from AI.");
            }
        } catch (err: any) {
            console.error('Error fetching AI suggestions:', err);
            setError(`Failed to fetch AI suggestions: ${err.message}`);
        } finally {
            setIsLoading(false);
            onLoadingChange(false);
        }
    };

    const handleAddAll = () => {
        onAddSkills(suggestions);
        setSuggestions([]); // Clear suggestions after adding
    };

    return (
        <div className= "p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700" >
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white" > AI Skill Suggestions < /h3>
            < p className = "text-sm text-gray-600 dark:text-gray-400 mb-4" >
                Click the button below to get AI - powered skill suggestions based on your current skills and the job description.
      < /p>

                    < Button
    onClick = { fetchAISuggestions }
    disabled = { isLoading || !jobDescription
}
className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
    >
{
    isLoading?(
          <>
    <Sparkles className="animate-spin mr-2" size = { 18} /> Generating...
</>
        ) : (
    <>
    <Sparkles className= "mr-2" size = { 18} /> Get AI Skill Suggestions
        < />
        )}
</Button>

{
    error && (
        <p className="text-red-500 text-sm mt-2" > { error } < /p>
      )
}

{
    suggestions.length > 0 && (
        <div className="mt-4" >
            <h4 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200" > Suggested Skills: </h4>
                < div className = "flex flex-wrap gap-2 mb-4" >
                {
                    suggestions.map((skill, index) => (
                        <span
                key= { index }
                className = "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200"
                        >
                        { skill }
                        < /span>
                    ))
                }
                    < /div>
                    < Button
    onClick = { handleAddAll }
    className = "w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
        Add All Suggested Skills
            < /Button>
            < /div>
      )
}
</div>
  );
};

export default AISkillsSuggestion;
