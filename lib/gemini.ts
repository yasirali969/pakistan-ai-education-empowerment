import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error(
        'GEMINI_API_KEY environment variable is not configured. Please set it in Vercel Project Settings > Environment Variables.'
      );
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Retry helper for handling transient 503 / UNAVAILABLE / Rate limit errors
// with exponential backoff & fallback models
export async function generateContentWithRetry(ai: GoogleGenAI, params: any) {
  const modelsToTry = [params.model || 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errString = String(err?.message || err);
        const isTransient =
          errString.includes('503') ||
          errString.includes('UNAVAILABLE') ||
          errString.includes('high demand') ||
          errString.includes('429') ||
          errString.includes('RESOURCE_EXHAUSTED') ||
          errString.includes('fetch failed');

        if (!isTransient) {
          throw err;
        }

        const delay = Math.min(600 * Math.pow(2.2, attempt), 3500);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  throw lastError;
}

export function isMissingKey() {
  return !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY';
}

export function isHighDemandError(error: any) {
  const msg = String(error?.message || error);
  return msg.includes('503') || msg.includes('high demand');
}
