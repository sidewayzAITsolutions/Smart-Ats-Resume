import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, BarChart2, CheckCircle, XCircle } from 'lucide-react'; // Assuming lucide-react for icons

interface CompetitiveATSAnalyzerProps {
  resumeText: string;
  jobDescription: string;
  onAnalyze: (score: number, feedback: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const CompetitiveATSAnalyzer: React.FC<CompetitiveATSAnalyzerProps> = ({
  resumeText,
  jobDescription,
  onAnalyze,
  onLoadingChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ score: number; feedback: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performATSAnalysis = async () => {
    setIsLoading(true);
    onLoadingChange(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const prompt = `Analyze the following resume against the job description. Provide an ATS compatibility score (0-100) and detailed feedback on how to improve the resume for better ATS matching. Focus on keywords, formatting, and sections.
      Resume: "${resumeText}"
      Job Description: "${jobDescription}"
      
      Provide the response in JSON format with two fields: "score" (number) and "feedback" (string).`;

      const apiKey = ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "score": { "type": "NUMBER" },
              "feedback": { "type": "STRING" }
            },
            "propertyOrdering": ["score", "feedback"]
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

        if (typeof parsedResult.score === 'number' && typeof parsedResult.feedback === 'string') {
          setAnalysisResult(parsedResult);
          onAnalyze(parsedResult.score, parsedResult.feedback);
        } else {
          setError("Invalid AI response format.");
        }
      } else {
        setError("No analysis found from AI.");
      }
    } catch (err: any) {
      console.error('Error performing ATS analysis:', err);
      setError(`Failed to perform ATS analysis: ${err.message}`);
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Competitive ATS Analyzer</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Get an ATS compatibility score and detailed feedback by analyzing your resume against a job description.
      </p>

      <Button
        onClick={performATSAnalysis}
        disabled={isLoading || !resumeText || !jobDescription}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Sparkles className="animate-spin mr-2" size={18} /> Analyzing...
          </>
        ) : (
          <>
            <BarChart2 className="mr-2" size={18} /> Analyze Resume
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {analysisResult && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <h4 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">Analysis Result:</h4>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold mr-2 text-gray-900 dark:text-white">ATS Score:</span>
            <span className={`text-2xl font-extrabold ${analysisResult.score >= 70 ? 'text-green-600' : analysisResult.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {analysisResult.score}/100
            </span>
            {analysisResult.score >= 70 ? (
              <CheckCircle className="ml-2 text-green-600" size={20} />
            ) : (
              <XCircle className="ml-2 text-red-600" size={20} />
            )}
          </div>
          <h5 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-1">Feedback:</h5>
          <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300 whitespace-pre-wrap">
            {analysisResult.feedback}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompetitiveATSAnalyzer;
