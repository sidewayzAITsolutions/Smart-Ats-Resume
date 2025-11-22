import { useState, useEffect, useCallback, useRef } from 'react';
import * as webllm from '@mlc-ai/web-llm';

interface WebLLMState {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  progress: string;
}

export function useWebLLM() {
  const [state, setState] = useState<WebLLMState>({
    isLoading: false,
    isReady: false,
    error: null,
    progress: '',
  });

  const engineRef = useRef<webllm.MLCEngine | null>(null);
  const initializingRef = useRef(false);

  // Initialize the model
  const initModel = useCallback(async () => {
    if (engineRef.current || initializingRef.current) {
      return;
    }

    initializingRef.current = true;
    setState(prev => ({ ...prev, isLoading: true, error: null, progress: 'Initializing AI model...' }));

    try {
      // Use a smaller, faster model for resume tasks
      // Phi-2 is a good balance of speed and quality for text generation
      const selectedModel = 'Phi-2-q4f16_1-MLC';

      const engine = await webllm.CreateMLCEngine(selectedModel, {
        initProgressCallback: (progress) => {
          setState(prev => ({ ...prev, progress: progress.text }));
        },
      });

      engineRef.current = engine;
      setState({
        isLoading: false,
        isReady: true,
        error: null,
        progress: 'AI model ready!',
      });
    } catch (error: any) {
      console.error('Failed to initialize WebLLM:', error);
      setState({
        isLoading: false,
        isReady: false,
        error: error.message || 'Failed to load AI model',
        progress: '',
      });
    } finally {
      initializingRef.current = false;
    }
  }, []);

  // Generate text completion
  const generateCompletion = useCallback(async (prompt: string, options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> => {
    if (!engineRef.current) {
      throw new Error('AI model not initialized. Please wait for it to load.');
    }

    try {
      const messages: webllm.ChatCompletionMessageParam[] = [
        { role: 'user', content: prompt }
      ];

      const reply = await engineRef.current.chat.completions.create({
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 800,
      });

      return reply.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Error generating completion:', error);
      throw new Error(error.message || 'Failed to generate text');
    }
  }, []);

  // Generate summary suggestions
  const generateSummary = useCallback(async (
    targetRole: string,
    industryFocus: string,
    skills: string[],
    experience: Array<{ position: string; company: string }>
  ): Promise<string[]> => {
    const prompt = `Generate 3 professional summary options for a resume based on the following information:

Target Role: ${targetRole || 'professional'}
Industry Focus: ${industryFocus || 'various industries'}
Skills: ${skills.join(', ')}
Experience: ${experience.map(exp => `${exp.position} at ${exp.company}`).join('; ')}

Each summary should be:
- 2-3 sentences long
- ATS-friendly with relevant keywords
- Highlight key achievements and skills
- Professional and impactful

Return only the 3 summaries separated by "|||" with no additional text or numbering.`;

    const completion = await generateCompletion(prompt, { temperature: 0.7, maxTokens: 800 });
    const suggestions = completion.split('|||').map(s => s.trim()).filter(s => s.length > 0);
    
    return suggestions.length > 0 ? suggestions : [completion.trim()];
  }, [generateCompletion]);

  // Generate achievement bullet points
  const generateAchievements = useCallback(async (
    position: string,
    company: string,
    description: string,
    currentAchievements: string[]
  ): Promise<string[]> => {
    const prompt = `Generate 3-5 impactful achievement bullet points for the following work experience:

Position: ${position}
Company: ${company}
Description: ${description || 'Not provided'}
Current Achievements: ${currentAchievements?.join('; ') || 'None'}

Requirements:
- Start with strong action verbs
- Include quantifiable metrics and results where possible
- Be specific and impactful
- ATS-friendly and professional
- Focus on accomplishments, not just responsibilities

Return only the bullet points, one per line, with no numbering or additional text.`;

    const completion = await generateCompletion(prompt, { temperature: 0.7, maxTokens: 600 });
    const achievements = completion
      .split('\n')
      .map(line => line.trim().replace(/^[-•*]\s*/, ''))
      .filter(line => line.length > 0)
      .slice(0, 5);
    
    return achievements;
  }, [generateCompletion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        // WebLLM doesn't have an explicit cleanup method, but we can clear the ref
        engineRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    initModel,
    generateCompletion,
    generateSummary,
    generateAchievements,
  };
}

