import { getGeminiClient, generateContentWithRetry, isMissingKey, isHighDemandError } from '../../lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid request. 'messages' array is required." });
      return;
    }

    const ai = getGeminiClient();

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: `You are Ustaad AI, an ultra-encouraging, brilliant virtual tutor dedicated to student & teacher empowerment in Pakistan. 
You specialize in Pakistani curriculums across all boards (Federal Board, Punjab Board, Sindh Board, KPK Board, Balochistan Board, Matric, FSc Pre-Engineering/Pre-Medical, ICS, I.Com, O-Levels, A-Levels) and competitive exams (MDCAT, ECAT, CSS, GAT, etc.).
Your rules of engagement:
1. Speak in a mix of clear English and simple Urdu/Roman Urdu, depending on the user's language. If they talk in Roman Urdu, respond primarily in easy English/Roman Urdu or beautiful Urdu script.
2. Break down complex scientific, mathematical, and grammatical concepts step-by-step. Use local Pakistani analogies and examples (e.g., comparing electric current flowing through a wire to water flow in canal systems of Punjab, or force comparisons with a loaded rickshaw or local bus, pricing in Pakistani Rupees, local landmarks).
3. Be respectful and culturally resonant. Use polite prefixes like 'Ji', 'Bacha', 'Beta', or 'Aap' (rather than 'tum').
4. Keep the student highly motivated. Commend their interest in education, as learning is key to Pakistan's future development.
5. End with an encouraging thought or a mini puzzle/question to spark critical thinking.`,
        temperature: 0.7,
      },
    });

    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Error in Ustaad AI Tutor:', error);
    res.status(500).json({
      error: isHighDemandError(error)
        ? 'Google Gemini AI is currently experiencing high demand. Automatic retries failed. Please try again in a few moments.'
        : error.message || 'Failed to process AI Tutor query',
      missingKey: isMissingKey(),
    });
  }
}
