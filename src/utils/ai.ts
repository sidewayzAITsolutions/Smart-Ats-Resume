// utils/ai.ts
import { createClient } from '@/lib/supabase/client';

declare global {
  interface Window {
    claude?: {
      complete?: (prompt: string) => Promise<string>;
      // ...other properties if needed
    };
  }
}

interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  debug?: boolean;
  skipCache?: boolean; // Option to bypass cache
}

interface CachedAIResponse {
  id: string;
  prompt_hash: string;
  model: string;
  response: string;
  created_at: string;
  expires_at: string;
}

// AI Response Caching - 30 day cache with Supabase
const CACHE_DURATION_DAYS = 30;

// Generate a hash of the prompt for cache lookup
function generatePromptHash(prompt: string, model: string): string {
  // Use a simple hash for browser compatibility
  const combined = `${prompt}|${model}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Check cache for existing response
async function getCachedResponse(promptHash: string, model: string): Promise<string | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('ai_cache')
      .select('response, expires_at')
      .eq('prompt_hash', promptHash)
      .eq('model', model)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Check if cache has expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      // Cache expired, delete it
      await supabase
        .from('ai_cache')
        .delete()
        .eq('prompt_hash', promptHash)
        .eq('model', model);
      return null;
    }
    
    console.log('🎯 AI Cache hit! Returning cached response');
    return data.response;
  } catch (error) {
    console.warn('Cache lookup failed, proceeding without cache:', error);
    return null;
  }
}

// Save response to cache
async function cacheResponse(promptHash: string, model: string, response: string): Promise<void> {
  try {
    const supabase = createClient();
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CACHE_DURATION_DAYS);
    
    await supabase
      .from('ai_cache')
      .upsert({
        prompt_hash: promptHash,
        model,
        response,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      }, {
        onConflict: 'prompt_hash,model'
      });
    
    console.log('💾 AI response cached successfully');
  } catch (error) {
    console.warn('Failed to cache AI response:', error);
    // Don't throw - caching failure shouldn't break the app
  }
}

export async function callAICompletion(
  prompt: string, 
  options: AICompletionOptions = {}
): Promise<string> {
  const { model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 500, debug = false, skipCache = false } = options;

  // Check cache first (unless skipped)
  const promptHash = generatePromptHash(prompt, model);
  
  if (!skipCache) {
    const cachedResponse = await getCachedResponse(promptHash, model);
    if (cachedResponse) {
      if (debug) console.log('🎯 Returning cached AI response');
      return cachedResponse;
    }
  }

  if (debug) {
    console.log('🤖 AI Completion Request:', {
      prompt: prompt.substring(0, 100) + '...',
      model,
      temperature,
      maxTokens,
      cacheSkipped: skipCache
    });
  }

  try {
    // If window.claude is available (in builder environment with Claude access)
    if (typeof window !== 'undefined' && window.claude?.complete) {
      if (debug) console.log('🔮 Using window.claude.complete');
      const result = await window.claude.complete(prompt);
      if (debug) console.log('✅ Claude completion successful:', result.substring(0, 100) + '...');
      
      // Cache the response
      if (!skipCache) {
        await cacheResponse(promptHash, model, result);
      }
      
      return result;
    }

    // Fallback to your AI API endpoint
    if (debug) console.log('🌐 Using API endpoint: /api/ai/complete');
    
    const response = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        temperature,
        maxTokens,
      }),
    });

    if (debug) {
      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP error! status: ${response.status}` };
      }

      if (debug) {
        console.error('❌ API Error Response:', errorData);
      }

      throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (debug) {
      console.log('📦 API Response Data:', {
        hasCompletion: !!data.completion,
        completionLength: data.completion?.length || 0,
        completion: data.completion?.substring(0, 100) + '...'
      });
    }

    const completion = data.completion || data.message || '';
    
    if (!completion) {
      throw new Error('No completion text received from AI service');
    }

    // Cache the successful response
    if (!skipCache) {
      await cacheResponse(promptHash, model, completion);
    }

    if (debug) console.log('✅ AI completion successful');
    return completion;

  } catch (error) {
    console.error('❌ AI completion error:', error);
    
    if (debug) {
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }

    // Provide user-friendly error messages
    let userMessage = 'Failed to generate AI completion';
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        userMessage = 'Please log in to use AI features';
      } else if (error.message.includes('limit reached')) {
        userMessage = 'Daily AI limit reached. Upgrade to Premium for unlimited access.';
      } else if (error.message.includes('API key')) {
        userMessage = 'AI service temporarily unavailable. Please try again later.';
      } else if (error.message.includes('Failed to fetch')) {
        userMessage = 'Network error. Please check your connection and try again.';
      }
    }

    throw new Error(userMessage);
  }
}

// Specific function for generating resume summaries
export async function generateResumeSummary(resumeData: { personal?: any; experience?: any; skills?: string[]; education?: any; targetRole?: string }, options: AICompletionOptions = {}): Promise<string[]> {
  const prompt = `Generate 3 different professional summary options for a resume based on this information:

Personal: ${JSON.stringify(resumeData.personal)}
Experience: ${JSON.stringify(resumeData.experience)}
Skills: ${resumeData.skills?.join(', ') || 'Not specified'}
Education: ${JSON.stringify(resumeData.education)}
Target Role: ${resumeData.targetRole || 'Not specified'}

Requirements:
- Each summary should be 2-3 sentences
- Focus on achievements and value proposition  
- Use action-oriented language
- Tailor to the target role if specified
- Make each option distinct (achievement-focused, skills-focused, leadership-focused)
- Format as "Option 1: [summary text]" on separate lines

Generate 3 professional summary options:`;

  try {
    const response = await fetch('/api/ai/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        experience: resumeData.experience,
        skills: resumeData.skills,
        education: resumeData.education,
        role: resumeData.targetRole
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Summary generation error:', error);
    
    // Fallback: try the generic completion
    try {
      const completion = await callAICompletion(prompt, options);
      const summaries = completion
        .split('\n')
        .filter(line => line.trim().match(/^Option \d+:/))
        .map(line => line.replace(/^Option \d+:\s*/, '').trim())
        .filter(text => text.length > 10);
      
      return summaries.length > 0 ? summaries : [completion];
    } catch {
      throw new Error('Failed to generate summary options');
    }
  }
}

// Function to test AI connectivity
export async function testAIConnection(): Promise<{ success: boolean; service: string; error?: string }> {
  try {
    console.log('🧪 Testing AI connection...');
    
    const testPrompt = "Say 'AI connection successful' if you can read this.";
    const result = await callAICompletion(testPrompt, { debug: true });
    
    console.log('✅ AI test successful:', result);
    
    // Determine which service responded
    let service = 'unknown';
    if (typeof window !== 'undefined' && window.claude?.complete) {
      service = 'claude';
    } else {
      service = 'api';
    }
    
    return { 
      success: true, 
      service
    };
  } catch (error) {
    console.error('❌ AI test failed:', error);
    return { 
      success: false, 
      service: 'none',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to check API configuration
export async function checkAIConfiguration(): Promise<{
  hasOpenAI: boolean;
  hasHuggingFace: boolean;
  hasClaudeAccess: boolean;
  recommendations: string[];
}> {
  const hasClaudeAccess = typeof window !== 'undefined' && !!window.claude?.complete;
  
  // Check if we can reach the API to test keys
  let hasOpenAI = false;
  let hasHuggingFace = false;
  
  try {
    const response = await fetch('/api/ai/config-check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      hasOpenAI = data.hasOpenAI;
      hasHuggingFace = data.hasHuggingFace;
    }
  } catch (error) {
    console.error('Failed to check AI configuration:', error);
  }

  const recommendations = [];
  
  if (!hasOpenAI && !hasHuggingFace && !hasClaudeAccess) {
    recommendations.push('Set up at least one AI service: Add OPENAI_API_KEY or HUGGINGFACE_API_KEY to your environment variables');
  }
  
  if (!hasOpenAI) {
    recommendations.push('For best results, add OPENAI_API_KEY to your .env.local file');
  }
  
  if (!hasHuggingFace) {
    recommendations.push('Add HUGGINGFACE_API_KEY as a backup AI service');
  }

  return {
    hasOpenAI,
    hasHuggingFace,
    hasClaudeAccess,
    recommendations
  };
}
