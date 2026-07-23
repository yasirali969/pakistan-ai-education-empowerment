import { Type } from '@google/genai';
import { getGeminiClient, generateContentWithRetry, isMissingKey, isHighDemandError } from '../../lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { goal } = req.body || {};
    if (!goal || goal.trim() === '') {
      res.status(400).json({ error: 'Learning goal is required to generate a path.' });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Generate a customized study roadmap or skill development pathway for a Pakistani student to achieve this goal: "${goal}".
Provide the response in the specified JSON schema, with 4 detailed sequential phases.
Include localized learning resources commonly accessible in Pakistan (such as YouTube educational channels like Sabaq Foundation, Khan Academy Urdu, TeleSchool, Allama Iqbal Open University resources, Virtual University, local board websites, or top global platforms like Coursera/W3Schools/freeCodeCamp that are widely used by Pakistani freelancers).`;

    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goalTitle: { type: Type.STRING, description: "The student's ultimate learning target." },
            estimatedCompletion: { type: Type.STRING, description: 'A realistic total timeframe (e.g., 3 months, 6 weeks).' },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER, description: 'Phase sequence (1 to 4).' },
                  title: { type: Type.STRING, description: 'Descriptive title of the study phase.' },
                  duration: { type: Type.STRING, description: 'Recommended duration for this phase (e.g. Weeks 1-2).' },
                  keyTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Key concepts or skills to master in this phase.',
                  },
                  strategy: { type: Type.STRING, description: 'Concrete advice on how to study or practice effectively.' },
                  pakistanResources: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Highly accessible digital platforms, channels, or textbooks in Pakistan.',
                  },
                },
                required: ['phaseNumber', 'title', 'duration', 'keyTopics', 'strategy', 'pakistanResources'],
              },
            },
            overallTip: { type: Type.STRING, description: 'A powerful, highly motivating summary quote or study hack in English followed by Urdu.' },
          },
          required: ['goalTitle', 'estimatedCompletion', 'phases', 'overallTip'],
        },
        temperature: 0.5,
      },
    });

    const pathData = JSON.parse(response.text || '{}');
    res.status(200).json({ roadmap: pathData });
  } catch (error: any) {
    console.error('Error building study path:', error);
    res.status(500).json({
      error: isHighDemandError(error)
        ? 'Google Gemini AI is currently experiencing high demand. Automatic retries failed. Please try again in a few moments.'
        : error.message || 'Failed to generate study roadmap',
      missingKey: isMissingKey(),
    });
  }
}
