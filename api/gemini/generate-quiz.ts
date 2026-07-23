import { Type } from '@google/genai';
import { getGeminiClient, generateContentWithRetry, isMissingKey, isHighDemandError } from '../../lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { subject, level, topic } = req.body || {};
    if (!subject || !level) {
      res.status(400).json({ error: 'Subject and Level are required fields.' });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Generate a quiz with exactly 5 multiple choice questions on the subject of "${subject}" at the academic level of "${level}" in Pakistan's curriculum.${topic ? ` The focus should be on the specific topic: "${topic}".` : ''}
For each question:
- Provide the question text (clear, academic).
- Provide a list of exactly 4 options.
- Identify the correct answer's 0-based index.
- Provide a detailed academic explanation in English.
- Provide a clear, supportive Urdu script explanation (اردو) explaining why the answer is correct and translating the core learning point.`;

    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'List of 5 multiple choice questions',
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: 'The MCQ question text.' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 4 options, as strings.',
              },
              correctAnswerIndex: { type: Type.INTEGER, description: 'The 0-based index of the correct option (0, 1, 2, or 3).' },
              explanationEnglish: { type: Type.STRING, description: 'Academic explanation in English.' },
              explanationUrdu: { type: Type.STRING, description: 'Supportive academic explanation in Urdu script.' },
            },
            required: ['question', 'options', 'correctAnswerIndex', 'explanationEnglish', 'explanationUrdu'],
          },
        },
        temperature: 0.2,
      },
    });

    const quizData = JSON.parse(response.text || '[]');
    res.status(200).json({ quiz: quizData });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      error: isHighDemandError(error)
        ? 'Google Gemini AI is currently experiencing high demand. Automatic retries failed. Please try again in a few moments.'
        : error.message || 'Failed to generate educational quiz',
      missingKey: isMissingKey(),
    });
  }
}
