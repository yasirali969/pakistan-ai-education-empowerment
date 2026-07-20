import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Pakistan AI Education Empowerment API is active." });
});

// API Key Check Helper
app.get("/api/check-key", (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = !!apiKey && apiKey !== "MY_GEMINI_API_KEY";
  res.json({ configured: isConfigured });
});

// 1. AI Tutor (Ustaad AI) chat endpoint
app.post("/api/gemini/tutor", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid request. 'messages' array is required." });
      return;
    }

    const ai = getGeminiClient();

    // Map the incoming chat messages to the format required by the Google GenAI SDK
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in Ustaad AI Tutor:", error);
    res.status(500).json({ 
      error: error.message || "Failed to process AI Tutor query",
      missingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});

// 2. Curricular Quiz Simulator
app.post("/api/gemini/generate-quiz", async (req, res) => {
  try {
    const { subject, level, topic } = req.body;
    if (!subject || !level) {
      res.status(400).json({ error: "Subject and Level are required fields." });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Generate a quiz with exactly 5 multiple choice questions on the subject of "${subject}" at the academic level of "${level}" in Pakistan's curriculum.${topic ? ` The focus should be on the specific topic: "${topic}".` : ""}
For each question:
- Provide the question text (clear, academic).
- Provide a list of exactly 4 options.
- Identify the correct answer's 0-based index.
- Provide a detailed academic explanation in English.
- Provide a clear, supportive Urdu script explanation (اردو) explaining why the answer is correct and translating the core learning point.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 5 multiple choice questions",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The MCQ question text." },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options, as strings."
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "The 0-based index of the correct option (0, 1, 2, or 3)." },
              explanationEnglish: { type: Type.STRING, description: "Academic explanation in English." },
              explanationUrdu: { type: Type.STRING, description: "Supportive academic explanation in Urdu script." }
            },
            required: ["question", "options", "correctAnswerIndex", "explanationEnglish", "explanationUrdu"]
          }
        },
        temperature: 0.2 // Lower temperature for factual accuracy
      }
    });

    const quizData = JSON.parse(response.text || "[]");
    res.json({ quiz: quizData });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate educational quiz",
      missingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});

// 3. Tarjuma & Conceptual Explainer (Bilingual Term Explainer)
app.post("/api/gemini/translate-explain", async (req, res) => {
  try {
    const { englishText } = req.body;
    if (!englishText || englishText.trim() === "") {
      res.status(400).json({ error: "No text provided for explanation." });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `The user wants a detailed translation and conceptual explanation of this academic text/term: "${englishText}".
Perform the following tasks and output them in the specified JSON structure:
1. Translate the key text/term into beautiful, clear Urdu script (اردو).
2. Provide a transliterated Roman Urdu translation so it is easy to read aloud.
3. Provide a simple, intuitive conceptual breakdown of what it means (in plain English).
4. Provide a list of 2 or 3 highly relatable real-world Pakistani analogies or scenarios that make this academic concept crystal clear (e.g. comparing kinetic energy to a speeding motorbike on Shahrah-e-Faisal, or photosynthesis to cooking roti in a tandoor using solar heat, etc.).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urduTranslation: { type: Type.STRING, description: "Beautiful Urdu script (اردو) translation." },
            romanUrduTranslation: { type: Type.STRING, description: "Transliterated Roman Urdu phonetic pronunciation/translation." },
            conceptualExplanation: { type: Type.STRING, description: "Simple, friendly conceptual explanation in English." },
            pakistaniExamples: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Relatable Pakistani analogies or real-world examples." 
            }
          },
          required: ["urduTranslation", "romanUrduTranslation", "conceptualExplanation", "pakistaniExamples"]
        },
        temperature: 0.4
      }
    });

    const explanationData = JSON.parse(response.text || "{}");
    res.json({ data: explanationData });
  } catch (error: any) {
    console.error("Error in bilingual explainer:", error);
    res.status(500).json({ 
      error: error.message || "Failed to translate and explain concept",
      missingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});

// 4. Personalized Study Roadmaps & Skill Pathways
app.post("/api/gemini/study-path", async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal || goal.trim() === "") {
      res.status(400).json({ error: "Learning goal is required to generate a path." });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Generate a customized study roadmap or skill development pathway for a Pakistani student to achieve this goal: "${goal}".
Provide the response in the specified JSON schema, with 4 detailed sequential phases.
Include localized learning resources commonly accessible in Pakistan (such as YouTube educational channels like Sabaq Foundation, Khan Academy Urdu, TeleSchool, Allama Iqbal Open University resources, Virtual University, local board websites, or top global platforms like Coursera/W3Schools/freeCodeCamp that are widely used by Pakistani freelancers).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goalTitle: { type: Type.STRING, description: "The student's ultimate learning target." },
            estimatedCompletion: { type: Type.STRING, description: "A realistic total timeframe (e.g., 3 months, 6 weeks)." },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER, description: "Phase sequence (1 to 4)." },
                  title: { type: Type.STRING, description: "Descriptive title of the study phase." },
                  duration: { type: Type.STRING, description: "Recommended duration for this phase (e.g. Weeks 1-2)." },
                  keyTopics: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Key concepts or skills to master in this phase." 
                  },
                  strategy: { type: Type.STRING, description: "Concrete advice on how to study or practice effectively." },
                  pakistanResources: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Highly accessible digital platforms, channels, or textbooks in Pakistan." 
                  }
                },
                required: ["phaseNumber", "title", "duration", "keyTopics", "strategy", "pakistanResources"]
              }
            },
            overallTip: { type: Type.STRING, description: "A powerful, highly motivating summary quote or study hack in English followed by Urdu." }
          },
          required: ["goalTitle", "estimatedCompletion", "phases", "overallTip"]
        },
        temperature: 0.5
      }
    });

    const pathData = JSON.parse(response.text || "{}");
    res.json({ roadmap: pathData });
  } catch (error: any) {
    console.error("Error building study path:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate study roadmap",
      missingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});


// Serve static frontend files
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for Development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static build from /dist in Production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupViteOrStatic().catch(err => {
  console.error("Failed to start server:", err);
});
