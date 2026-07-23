import { Type } from '@google/genai';
import { getGeminiClient, generateContentWithRetry, isMissingKey, isHighDemandError } from '../../lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { englishText } = req.body || {};
    if (!englishText || englishText.trim() === '') {
      res.status(400).json({ error: 'No text provided for explanation.' });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `The user wants a detailed translation and conceptual explanation of this academic text/term: "${englishText}".
Perform the following tasks and output them in the specified JSON structure:
1. Translate the key text/term into beautiful, clear Urdu script (اردو).
2. Provide a transliterated Roman Urdu translation so it is easy to read aloud.
3. Provide a simple, intuitive conceptual breakdown of what it means (in plain English).
4. Provide a list of 2 or 3 highly relatable real-world Pakistani analogies or scenarios that make this academic concept crystal clear (e.g. comparing kinetic energy to a speeding motorbike on Shahrah-e-Faisal, or photosynthesis to cooking roti in a tandoor using solar heat, etc.).`;

    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urduTranslation: { type: Type.STRING, description: 'Beautiful Urdu script (اردو) translation.' },
            romanUrduTranslation: { type: Type.STRING, description: 'Transliterated Roman Urdu phonetic pronunciation/translation.' },
            conceptualExplanation: { type: Type.STRING, description: 'Simple, friendly conceptual explanation in English.' },
            pakistaniExamples: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Relatable Pakistani analogies or real-world examples.',
            },
          },
          required: ['urduTranslation', 'romanUrduTranslation', 'conceptualExplanation', 'pakistaniExamples'],
        },
        temperature: 0.4,
      },
    });

    const explanationData = JSON.parse(response.text || '{}');
    res.status(200).json({ data: explanationData });
  } catch (error: any) {
    console.error('Error in bilingual explainer:', error);
    res.status(500).json({
      error: isHighDemandError(error)
        ? 'Google Gemini AI is currently experiencing high demand. Automatic retries failed. Please try again in a few moments.'
        : error.message || 'Failed to translate and explain concept',
      missingKey: isMissingKey(),
    });
  }
}
