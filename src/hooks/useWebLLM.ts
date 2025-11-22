// Note: WebLLM has been completely removed in favor of OpenAI API.
// This file is deprecated and should not be imported.
// All AI features now use OpenAI via /api/ai endpoints.

export function useWebLLM() {
  throw new Error(
    'WebLLM has been removed. All AI features now use OpenAI. ' +
    'Please use callAICompletion from @/utils/ai instead.'
  );
}
