/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Globe, 
  Compass, 
  Send, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  AlertTriangle, 
  Bookmark, 
  Award, 
  MapPin, 
  ChevronRight,
  BookMarked,
  Layout,
  Clock,
  ExternalLink,
  Search,
  Check,
  User,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Message, 
  QuizQuestion, 
  BilingualExplanation, 
  StudyRoadmap, 
  ActiveTool 
} from "./types";

export default function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("dashboard");
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const [isLoadingKey, setIsLoadingKey] = useState(true);

  // Stats / Progress saved in LocalStorage
  const [quizHighScores, setQuizHighScores] = useState<{ [subject: string]: number }>(() => {
    const saved = localStorage.getItem("pak_ai_quiz_scores");
    return saved ? JSON.parse(saved) : {};
  });
  const [savedTerms, setSavedTerms] = useState<Array<{ term: string; translation: string; date: string }>>(() => {
    const saved = localStorage.getItem("pak_ai_saved_terms");
    return saved ? JSON.parse(saved) : [];
  });
  const [savedRoadmaps, setSavedRoadmaps] = useState<Array<StudyRoadmap>>(() => {
    const saved = localStorage.getItem("pak_ai_saved_roadmaps");
    return saved ? JSON.parse(saved) : [];
  });

  // Verify backend & Gemini API Key state
  useEffect(() => {
    async function checkKey() {
      try {
        const res = await fetch("/api/check-key");
        const data = await res.json();
        setApiKeyConfigured(data.configured);
      } catch (err) {
        console.error("Failed to check API Key configuration:", err);
        setApiKeyConfigured(false);
      } finally {
        setIsLoadingKey(false);
      }
    }
    checkKey();
  }, []);

  // Utility to update local storage
  const saveHighScore = (subject: string, score: number) => {
    const updated = { ...quizHighScores, [subject]: Math.max(quizHighScores[subject] || 0, score) };
    setQuizHighScores(updated);
    localStorage.setItem("pak_ai_quiz_scores", JSON.stringify(updated));
  };

  const saveTerm = (term: string, translation: string) => {
    if (savedTerms.some(t => t.term.toLowerCase() === term.toLowerCase())) return;
    const updated = [...savedTerms, { term, translation, date: new Date().toLocaleDateString() }];
    setSavedTerms(updated);
    localStorage.setItem("pak_ai_saved_terms", JSON.stringify(updated));
  };

  const removeTerm = (term: string) => {
    const updated = savedTerms.filter(t => t.term !== term);
    setSavedTerms(updated);
    localStorage.setItem("pak_ai_saved_terms", JSON.stringify(updated));
  };

  const saveRoadmap = (roadmap: StudyRoadmap) => {
    if (savedRoadmaps.some(r => r.goalTitle.toLowerCase() === roadmap.goalTitle.toLowerCase())) return;
    const updated = [roadmap, ...savedRoadmaps];
    setSavedRoadmaps(updated);
    localStorage.setItem("pak_ai_saved_roadmaps", JSON.stringify(updated));
  };

  const deleteRoadmap = (goalTitle: string) => {
    const updated = savedRoadmaps.filter(r => r.goalTitle !== goalTitle);
    setSavedRoadmaps(updated);
    localStorage.setItem("pak_ai_saved_roadmaps", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 font-sans flex flex-col">
      
      {/* 1. Header Banner & API Status Indicator */}
      <header className="bg-[#0D1017] text-white border-b border-slate-800/80 relative overflow-hidden shadow-lg">
        {/* Abstract design element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTool("dashboard")}>
            <div className="p-3 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif tracking-tight text-white">Ustaad <span className="text-emerald-500 italic font-normal">AI</span></h1>
                <span className="text-xs bg-emerald-950/50 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-900/50">
                  پاکستان اے آئی
                </span>
              </div>
              <p className="text-sm text-slate-400">Pakistan AI Education Empowerment Portal</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* API Status Indicator */}
            {isLoadingKey ? (
              <div className="flex items-center gap-2 bg-[#11141B] px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                Checking System Status...
              </div>
            ) : apiKeyConfigured ? (
              <div className="flex items-center gap-2 bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-900/30 text-xs text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                AI Services: Ready
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-900/30 text-xs text-red-400 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>AI Key Missing (Use Settings &gt; Secrets)</span>
              </div>
            )}

            {/* Navigation tabs */}
            <div className="bg-[#11141B] p-1 rounded-xl border border-slate-800 flex">
              <button 
                onClick={() => setActiveTool("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTool === "dashboard" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-400 hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTool("tutor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTool === "tutor" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-400 hover:text-white"
                }`}
              >
                Ustaad Tutor
              </button>
              <button 
                onClick={() => setActiveTool("quiz")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTool === "quiz" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-400 hover:text-white"
                }`}
              >
                Quiz Simulator
              </button>
              <button 
                onClick={() => setActiveTool("translator")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTool === "translator" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-400 hover:text-white"
                }`}
              >
                Tarjuma Explainer
              </button>
              <button 
                onClick={() => setActiveTool("roadmap")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTool === "roadmap" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-400 hover:text-white"
                }`}
              >
                Safar Roadmaps
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Warning notification if key is missing */}
        {!isLoadingKey && !apiKeyConfigured && (
          <div className="mb-6 bg-amber-950/20 border border-amber-900/50 rounded-xl p-4 flex gap-3 items-start shadow-md animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-200 text-sm">Gemini API Key is Required for AI Features</h4>
              <p className="text-xs text-amber-400/80 mt-1">
                This full-stack application relies on Google Gemini AI to generate curricula, explain terms in Urdu, simulate board exams, and build customized pathways. To activate these features, open the <strong className="text-amber-200 font-bold">Settings &gt; Secrets</strong> menu in the AI Studio UI and configure <code className="bg-amber-900/30 border border-amber-800/40 px-1 py-0.5 rounded text-amber-300 font-mono text-[11px]">GEMINI_API_KEY</code>.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTool === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-[#0D1017] to-[#11141B] border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-5">
                  <BookOpen className="w-80 h-80 transform translate-x-20 translate-y-20 rotate-12 text-emerald-500" />
                </div>
                <div className="relative z-10 max-w-3xl space-y-4">
                  <span className="inline-block px-3 py-1 bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded">
                    <Sparkles className="w-3.5 h-3.5 mr-1 inline-block align-text-top" /> Empowering the Next Generation of Pakistani Tech
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-light font-serif tracking-tight leading-tight text-white">
                    Bridging the <span className="italic text-emerald-500 font-normal">Global Divide</span> with Local AI Intelligence.
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    Welcome to the specialized portal tailored for Pakistani academic curriculums and skill building. Ustaad AI bridges the gap between traditional learning and localized, bilingual AI mentorship, covering board exams, university entrance preparation, and vocational freelance digital pathways.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4">
                    <button 
                      onClick={() => setActiveTool("tutor")}
                      className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950/20 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Talk to Ustaad AI</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTool("quiz")}
                      className="px-6 py-3 bg-transparent border border-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-xs sm:text-sm cursor-pointer"
                    >
                      Try Board Mock Quiz
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Core Features Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Tutor Card */}
                <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-[#0D1017] text-emerald-400 border border-slate-800 rounded-lg flex items-center justify-center font-bold">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-light font-serif text-white text-lg flex items-center gap-1.5">
                        Ustaad AI Tutor
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        A personalized smart tutor aligned with Federal, Punjab, Sindh, KPK, and Balochistan curriculum boards. Explains concepts step-by-step with local examples in English, Urdu, and Roman Urdu.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTool("tutor")}
                    className="mt-6 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Start Tutoring</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quiz Card */}
                <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-[#0D1017] text-indigo-400 border border-slate-800 rounded-lg flex items-center justify-center font-bold">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-light font-serif text-white text-lg flex items-center gap-1.5">
                        Exam Quiz Prep
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        Generate full 5-question multiple choice tests for Matric, FSc, MDCAT, ECAT, or CSS. Features interactive answers and bilingual academic explanations in both English and Urdu script.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTool("quiz")}
                    className="mt-6 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Simulate Exam</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Explainer Card */}
                <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-[#0D1017] text-amber-400 border border-slate-800 rounded-lg flex items-center justify-center font-bold">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-light font-serif text-white text-lg flex items-center gap-1.5">
                        Bilingual Tarjuma
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        Struggling with high-level academic textbooks written in English? Insert scientific terms to obtain beautiful Urdu translations, phonetic Roman Urdu, and highly relatable local analogies.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTool("translator")}
                    className="mt-6 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Explain Concept</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Roadmaps Card */}
                <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-[#0D1017] text-sky-400 border border-slate-800 rounded-lg flex items-center justify-center font-bold">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-light font-serif text-white text-lg flex items-center gap-1.5">
                        Safar Study Roadmaps
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        Design detailed 4-phase learning roadmaps for board studies, CSS prep, or digital skills (such as freelancing, Python, coding). Suggests free local channels and portals like Sabaq Foundation.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTool("roadmap")}
                    className="mt-6 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Design Pathway</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Local stats / saved items section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Quiz High Scores Leaderboard */}
                <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm space-y-4">
                  <h3 className="font-light font-serif text-white text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Your Quiz Performance
                  </h3>
                  {Object.keys(quizHighScores).length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No quizzes taken yet. High scores will appear here!
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {Object.entries(quizHighScores).map(([subj, score]) => (
                        <div key={subj} className="flex justify-between items-center bg-[#0D1017] p-2.5 rounded-lg border border-slate-800 text-xs">
                          <span className="font-medium text-slate-300 capitalize">{subj} Quiz</span>
                          <span className="bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-900/30">
                            {score} / 5 Correct
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Bilingual Glossary */}
                <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm space-y-4">
                  <h3 className="font-light font-serif text-white text-base flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-amber-500" />
                    Saved Bilingual Glossary
                  </h3>
                  {savedTerms.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No terms explained & saved yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {savedTerms.map(t => (
                        <div key={t.term} className="flex justify-between items-center bg-[#0D1017] p-2.5 rounded-lg border border-slate-800 text-xs">
                          <div>
                            <span className="font-semibold text-white block">{t.term}</span>
                            <span className="text-slate-400 italic block mt-0.5">{t.translation}</span>
                          </div>
                          <button 
                            onClick={() => removeTerm(t.term)} 
                            className="text-red-400 hover:text-red-300 text-[10px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Safar Milestones */}
                <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm space-y-4">
                  <h3 className="font-light font-serif text-white text-base flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-sky-500" />
                    Saved Study Roadmaps
                  </h3>
                  {savedRoadmaps.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No roadmaps designed yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {savedRoadmaps.map(r => (
                        <div key={r.goalTitle} className="flex justify-between items-center bg-[#0D1017] p-2.5 rounded-lg border border-slate-800 text-xs">
                          <div className="truncate pr-2">
                            <span className="font-semibold text-white block truncate">{r.goalTitle}</span>
                            <span className="text-slate-400 block mt-0.5">{r.estimatedCompletion} study time</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={() => {
                                // Load this roadmap directly in roadmap view
                                setActiveTool("roadmap");
                              }} 
                              className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => deleteRoadmap(r.goalTitle)} 
                              className="text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          )}

          {/* TUTOR TOOL COMPONENT */}
          {activeTool === "tutor" && <TutorTool apiKeyConfigured={apiKeyConfigured} />}

          {/* QUIZ TOOL COMPONENT */}
          {activeTool === "quiz" && <QuizTool apiKeyConfigured={apiKeyConfigured} onSaveScore={saveHighScore} />}

          {/* TRANSLATOR TOOL COMPONENT */}
          {activeTool === "translator" && <TranslatorTool apiKeyConfigured={apiKeyConfigured} onSaveTerm={saveTerm} savedTerms={savedTerms} />}

          {/* ROADMAP TOOL COMPONENT */}
          {activeTool === "roadmap" && <RoadmapTool apiKeyConfigured={apiKeyConfigured} onSaveRoadmap={saveRoadmap} savedRoadmaps={savedRoadmaps} />}

        </AnimatePresence>
      </main>

      <footer className="bg-[#0D1017] text-slate-500 text-xs py-6 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-slate-400 font-medium">Ustaad AI Portal (پاکستان اے آئی تعلیمی ترقی)</p>
          <p>Supporting UN Sustainable Development Goal 4 (Quality Education) across Pakistan.</p>
          <p className="text-[10px] text-slate-600">Powered by server-side Google Gemini Models in AI Studio.</p>
        </div>
      </footer>

    </div>
  );
}

/* ==========================================================================
   TUTOR TOOL (USTAAD AI CHAT)
   ========================================================================== */
function TutorTool({ apiKeyConfigured }: { apiKeyConfigured: boolean | null }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const defaultMsg: Message = {
      id: "welcome-msg",
      role: "model",
      content: "Assalam-o-Alaikum! 🇵🇰\n\nI am **Ustaad AI**, your personalized tutor. I can explain any subject of the Pakistani board curriculum (Matric, FSc, O/A Levels) or assist you with CSS, GAT, MDCAT, and general study skills. \n\nI can converse in **English**, **Urdu (اردو)**, or **Roman Urdu**. What would you like to study today? Feel free to ask a question or use one of the quick prompts below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    return [defaultMsg];
  });
  
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const presetPrompts = [
    { label: "FSc Physics: Newton's Laws", text: "Explain Newton's Laws of Motion in simple Urdu with local Pakistani transport examples (like buses or motorbikes)." },
    { label: "Matric Math: Quadratic Eq", text: "Give a step-by-step solved explanation of how to solve a quadratic equation using factorization." },
    { label: "CSS: Agriculture Economy", text: "Discuss the key challenges facing Pakistan's agriculture sector and three actionable solutions for CSS essay preparation." },
    { label: "Roman Urdu Biology: Cells", text: "Mijhay Roman Urdu mein cell biology aur mitochondria ka function asaan tarika se samjha dein." }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
      });

      const data = await response.json();
      if (response.ok) {
        const modelMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "model",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, modelMsg]);
      } else {
        throw new Error(data.error || "Failed to receive response");
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: "model",
        content: `⚠️ **Error Processing Request**: ${err.message || "An unexpected error occurred."}\n\n*Please verify that the server is active and the Gemini API key is configured correctly in the secrets panel.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your learning conversation with Ustaad AI?")) {
      setMessages([
        {
          id: "welcome-msg",
          role: "model",
          content: "Assalam-o-Alaikum! I have cleared our previous notes. What new academic topic shall we explore together?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <motion.div
      key="tutor"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6"
    >
      {/* Sidebar with helpful tips and presets */}
      <div className="lg:col-span-1 space-y-5">
        <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-light font-serif text-sm">Learning Guides</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Our virtual tutor adapts to your style. Speak naturally. You can ask for calculations, request lists of historical events, translate essays, or run grammar exercises for English board exams.
          </p>
          <div className="mt-4 border-t border-slate-800 pt-3 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Board Coverage</span>
            <div className="flex flex-wrap gap-1.5">
              {["BISE Federal", "BISE Punjab", "BISE Sindh", "MDCAT", "CSS Prep"].map(tag => (
                <span key={tag} className="bg-[#0D1017] text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Bilingual Assistant</span>
          <p className="text-slate-400 text-xs leading-relaxed">
            Feel free to toggle between English script and complete Urdu script. Ustaad AI reads both smoothly and provides detailed answers.
          </p>
          <div className="mt-3 p-3 bg-emerald-950/20 rounded-lg border border-emerald-900/40">
            <p className="font-urdu text-sm text-emerald-400 leading-normal text-right">
              استاد اے آئی سے ریاضی، طبیعیات، اور انگریزی کی تیاری کے لیے سوالات پوچھیں۔
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-3 flex flex-col bg-[#11141B] rounded-xl border border-slate-800/80 shadow-sm h-[600px] overflow-hidden">
        {/* Chat Title bar */}
        <div className="bg-[#0D1017] border-b border-slate-800/80 px-4 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
            <div>
              <h3 className="font-light font-serif text-white text-sm flex items-center gap-1.5">
                Ustaad AI Mentor Chat
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">Curriculum Aligned Agent</p>
            </div>
          </div>
          <button 
            onClick={handleClearChat}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/50 transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation flow */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-[#080A0E]">
          
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-950/20' 
                    : 'bg-[#0D1017] text-slate-200 border border-slate-800/80 rounded-tl-none font-sans'
                }`}>
                  {m.role === 'model' && m.content.includes("**") ? (
                    // Very simple custom bolding and lists parsing for clean markdown-like look
                    m.content.split("\n").map((line, i) => {
                      let formatted = line;
                      // Replace bold markdown with strong tag equivalent in standard text
                      // Let's keep it simple or split parts
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      const matches = line.match(boldRegex);
                      if (matches) {
                        return (
                           <p key={i} className={`min-h-[1.2em] ${line.trim().startsWith('*') ? 'pl-2' : ''}`} style={{ direction: line.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr' }}>
                            {line.split('**').map((part, index) => index % 2 === 1 ? <strong key={index} className="font-bold text-white">{part}</strong> : part)}
                          </p>
                        );
                      }
                      
                      const isUrdu = line.match(/[\u0600-\u06FF]/);
                      return (
                        <p 
                          key={i} 
                          className={`min-h-[1.2em] ${isUrdu ? 'font-urdu text-sm leading-loose text-right py-0.5' : ''} ${line.trim().startsWith('*') ? 'pl-2 text-slate-300 font-medium' : ''}`}
                          style={{ direction: isUrdu ? 'rtl' : 'ltr' }}
                        >
                          {line}
                        </p>
                      );
                    })
                  ) : (
                    m.content.split("\n").map((line, i) => {
                      const isUrdu = line.match(/[\u0600-\u06FF]/);
                      return (
                        <p 
                          key={i} 
                          className={`${isUrdu ? 'font-urdu text-sm leading-loose text-right py-0.5 text-emerald-400' : ''}`}
                          style={{ direction: isUrdu ? 'rtl' : 'ltr' }}
                        >
                          {line}
                        </p>
                      );
                    })
                  )}
                </div>
                <span className="text-[9px] text-slate-500 block px-1 text-right">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-[#0D1017] border border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <span className="text-xs text-slate-400 italic">Ustaad AI is thinking</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Presets Tray */}
        <div className="p-3 bg-[#0D1017] border-t border-slate-800/80 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Suggested Topics</span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {presetPrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => handleSendMessage(p.text)}
                disabled={isLoading || !apiKeyConfigured}
                className="bg-[#11141B] hover:bg-[#161B22] border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-colors flex items-center gap-1.5 disabled:opacity-50 shrink-0 font-medium cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* TextInput Box */}
        <div className="p-3 bg-[#11141B] border-t border-slate-800/80 shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={apiKeyConfigured ? "Ask Ustaad AI a question (e.g. 'Solve x^2 - 5x + 6 = 0')" : "AI is unavailable. Please configure your API key."}
              disabled={isLoading || !apiKeyConfigured}
              className="flex-1 bg-[#0D1017] border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-60"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isLoading || !apiKeyConfigured}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center shrink-0 disabled:bg-slate-800 disabled:text-slate-600 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   QUIZ TOOL (BOARD EXAM MCQ GENERATOR)
   ========================================================================== */
interface QuizToolProps {
  apiKeyConfigured: boolean | null;
  onSaveScore: (subject: string, score: number) => void;
}
function QuizTool({ apiKeyConfigured, onSaveScore }: QuizToolProps) {
  const [subject, setSubject] = useState("Mathematics");
  const [level, setLevel] = useState("FSc Pre-Engineering");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);

    try {
      const res = await fetch("/api/gemini/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, level, topic })
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.quiz) && data.quiz.length > 0) {
        setQuizQuestions(data.quiz);
      } else {
        throw new Error(data.error || "Invalid response format from server");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Could not generate mock test. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null || isAnswerSubmitted) return;
    
    setIsAnswerSubmitted(true);
    const correctIndex = quizQuestions[currentQuestionIndex].correctAnswerIndex;
    if (selectedAnswerIndex === correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished, save high score!
      onSaveScore(subject.toLowerCase(), score + (selectedAnswerIndex === quizQuestions[currentQuestionIndex].correctAnswerIndex ? 1 : 0));
      setCurrentQuestionIndex(quizQuestions.length); // Trigger end screen state
    }
  };

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm">
        <h3 className="text-lg font-light font-serif text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Bilingual Board MCQ Test Simulator
        </h3>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          Configure and simulate a real 5-question test matching local Pakistani board standards. Questions are generated dynamically with detailed academic explanations in English and beautiful Urdu script.
        </p>
      </div>

      {/* Quiz Config Setup */}
      {quizQuestions.length === 0 && currentQuestionIndex === 0 && (
        <div className="bg-[#11141B] rounded-xl p-6 border border-slate-800/80 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Subject</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0D1017] border border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none transition-all cursor-pointer"
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Islamiat</option>
                <option>Pakistan Studies</option>
                <option>Computer Science</option>
                <option>General CSS Preparation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Target Exam / Board</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-[#0D1017] border border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none transition-all cursor-pointer"
              >
                <option>Matric (BISE Board)</option>
                <option>FSc Pre-Engineering</option>
                <option>FSc Pre-Medical</option>
                <option>O-Levels (CAIE)</option>
                <option>A-Levels (CAIE)</option>
                <option>MDCAT (National Entrance)</option>
                <option>ECAT (Engineering Entrance)</option>
                <option>CSS (Central Superior Services)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Specific Topic (Optional)</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Thermodynamics, Algebra, Cell Division"
                className="w-full bg-[#0D1017] border border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading || !apiKeyConfigured}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all shadow-md shadow-indigo-950/20 flex items-center gap-2 disabled:bg-slate-800 disabled:text-slate-600 cursor-pointer"
            >
              {isLoading ? "Compiling Mock Exam..." : "Generate Custom Test"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 animate-pulse font-medium">Ustaad AI is formulating high-quality boards MCQs. Please wait...</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-xs flex gap-2 items-center">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Interactive Active Question Board */}
      {quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length && (
        <div className="bg-[#11141B] rounded-xl p-6 border border-slate-800/80 shadow-sm space-y-6">
          {/* Progress bar */}
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>MCQ Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            <span>Current Score: {score} / {quizQuestions.length}</span>
          </div>
          <div className="w-full bg-[#0D1017] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question text */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">Exam Question</span>
            <h4 className="text-sm sm:text-base font-light font-serif text-white leading-relaxed">
              {quizQuestions[currentQuestionIndex].question}
            </h4>
          </div>

          {/* Choice options */}
          <div className="grid grid-cols-1 gap-2.5">
            {quizQuestions[currentQuestionIndex].options.map((opt, i) => {
              const isSelected = selectedAnswerIndex === i;
              const isCorrect = quizQuestions[currentQuestionIndex].correctAnswerIndex === i;
              
              let cardStyle = "bg-[#0D1017] border-slate-800 hover:bg-[#161B22] text-slate-300";
              if (isSelected && !isAnswerSubmitted) {
                cardStyle = "bg-indigo-950/30 border-indigo-500/70 text-indigo-200 font-semibold";
              } else if (isAnswerSubmitted) {
                if (isCorrect) {
                  cardStyle = "bg-emerald-950/30 border-emerald-500/70 text-emerald-200 font-semibold";
                } else if (isSelected) {
                  cardStyle = "bg-red-950/30 border-red-500/70 text-red-200 font-semibold";
                } else {
                  cardStyle = "bg-[#0D1017]/50 border-slate-900 text-slate-500";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between group cursor-pointer ${cardStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#11141B] border border-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswerSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Action trigger button */}
          <div className="flex justify-end pt-2 border-t border-slate-800/80">
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedAnswerIndex === null}
                onClick={handleSubmitAnswer}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition-all cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentQuestionIndex === quizQuestions.length - 1 ? "Finish Test" : "Next Question"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dual Bilingual Explanation */}
          {isAnswerSubmitted && (
            <div className="bg-[#0D1017] rounded-xl p-5 border border-slate-800/60 mt-4 space-y-4 animate-fade-in text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-indigo-400 border-b border-slate-800/80 pb-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h5 className="font-light font-serif text-white">Concept Explanation / تفصیلی وضاحت</h5>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">English Explainer</span>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {quizQuestions[currentQuestionIndex].explanationEnglish}
                  </p>
                </div>
                
                <div className="space-y-1.5 md:border-l md:border-slate-800 md:pl-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono text-right md:text-left">اردو تشریح</span>
                  <p className="font-urdu text-sm text-slate-300 leading-loose text-right" style={{ direction: 'rtl' }}>
                    {quizQuestions[currentQuestionIndex].explanationUrdu}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz Finish Screen */}
      {quizQuestions.length > 0 && currentQuestionIndex >= quizQuestions.length && (
        <div className="bg-[#11141B] rounded-xl p-8 border border-slate-800/80 shadow-sm text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#0D1017] text-indigo-400 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner font-bold">
            🏆
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xl font-light font-serif text-white">Quiz Completed Successfully!</h4>
            <p className="text-xs text-slate-500 capitalize font-mono">Board Prep Scorecard</p>
          </div>

          <div className="bg-[#0D1017] rounded-xl p-5 border border-slate-800/60 max-w-xs mx-auto animate-fade-in">
            <span className="text-slate-500 text-[10px] font-bold uppercase block font-mono tracking-wider">Your Score</span>
            <span className="text-3xl font-black text-indigo-400 block mt-1">{score} / {quizQuestions.length}</span>
            <span className="text-xs font-semibold text-emerald-400 block mt-2">
              {score >= 4 ? "Excellent Job! Shabash! 🎉" : score >= 3 ? "Good Attempt! Kamyaabi durr nahi! 👍" : "Keep learning, practice makes perfect!"}
            </span>
          </div>

          <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
            Your high score has been saved locally on this browser. You can configure and generate another test at any time!
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setQuizQuestions([]);
                setCurrentQuestionIndex(0);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all shadow-md shadow-indigo-950/20 cursor-pointer"
            >
              Take Another Test
            </button>
            <button
              onClick={() => setQuizQuestions([])}
              className="bg-transparent border border-slate-700 text-white font-bold text-xs py-2.5 px-6 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ==========================================================================
   TRANSLATOR TOOL (BILINGUAL TEXTBOOK CONCEPT EXPLAINER)
   ========================================================================== */
interface TranslatorToolProps {
  apiKeyConfigured: boolean | null;
  onSaveTerm: (term: string, translation: string) => void;
  savedTerms: Array<{ term: string; translation: string; date: string }>;
}
function TranslatorTool({ apiKeyConfigured, onSaveTerm, savedTerms }: TranslatorToolProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BilingualExplanation | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTranslateExplain = async (textToQuery: string) => {
    if (!textToQuery.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");
    setResult(null);

    try {
      const res = await fetch("/api/gemini/translate-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ englishText: textToQuery })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setResult(data.data);
        onSaveTerm(textToQuery, data.data.urduTranslation);
        setInputText("");
      } else {
        throw new Error(data.error || "Failed to analyze terminal concept");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to process translation inquiry.");
    } finally {
      setIsLoading(false);
    }
  };

  const sampleTerms = ["Centripetal Force", "Mitosis", "Inflation", "Cryptocurrency", "Neural Networks"];

  return (
    <motion.div
      key="translator"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6"
    >
      {/* Sidebar glossary list */}
      <div className="lg:col-span-1 space-y-5">
        <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm">
          <h3 className="font-light font-serif text-white text-sm flex items-center gap-2 mb-3">
            <BookMarked className="w-5 h-5 text-amber-400" />
            Quick Glossary
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            English curriculum books can sometimes be intimidating. Translate difficult vocabulary and terms to understand them in simple language.
          </p>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sample Terms</span>
            <div className="flex flex-col gap-1">
              {sampleTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTranslateExplain(term)}
                  disabled={isLoading || !apiKeyConfigured}
                  className="text-left w-full bg-[#0D1017] hover:bg-[#161B22] border border-slate-800/80 hover:border-slate-700 p-2 rounded-lg text-xs transition-colors flex justify-between items-center text-slate-300 disabled:opacity-50 cursor-pointer"
                >
                  <span className="font-medium truncate">{term}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main interaction board */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Input Card */}
        <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-light font-serif text-white text-base flex items-center gap-1.5">
              <Globe className="w-5 h-5 text-amber-400" />
              Bilingual Academic Concept Explainer (ترجمہ اور تصور)
            </h3>
            <p className="text-slate-400 text-xs">
              Input any English academic term, scientific vocabulary, or paragraph to obtain deep Urdu breakdown and analogies.
            </p>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Photosynthesis, Kinetic Energy, Scarcity, Database Index..."
              disabled={isLoading || !apiKeyConfigured}
              className="flex-1 bg-[#0D1017] border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-60 placeholder:text-slate-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTranslateExplain(inputText);
              }}
            />
            <button
              onClick={() => handleTranslateExplain(inputText)}
              disabled={!inputText.trim() || isLoading || !apiKeyConfigured}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 px-5 rounded-lg transition-all shadow-md shadow-amber-950/20 shrink-0 flex items-center justify-center disabled:bg-slate-800 disabled:text-slate-600 cursor-pointer"
            >
              {isLoading ? "Analyzing..." : "Explain Concept"}
            </button>
          </div>

          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 animate-pulse font-medium">Ustaad AI is preparing Urdu translations and local explanations...</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-xs flex gap-2 items-center">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Results layout */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Urdu Translations Card */}
            <div className="md:col-span-1 bg-gradient-to-b from-amber-950/40 to-amber-900/40 border border-amber-900/30 rounded-xl p-5 text-white shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Bilingual Translation</span>
                
                <div className="space-y-2 text-right">
                  <span className="text-xs text-slate-400 block font-sans">اردو رسم الخط (Urdu Script)</span>
                  <p className="font-urdu text-2xl font-bold leading-normal pt-1 text-amber-400" style={{ direction: 'rtl' }}>
                    {result.urduTranslation}
                  </p>
                </div>
              </div>

              <div className="border-t border-amber-900/40 pt-4 space-y-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-mono">Roman Urdu Transliteration</span>
                <p className="text-xs italic font-medium text-slate-200">
                  "{result.romanUrduTranslation}"
                </p>
              </div>
            </div>

            {/* English Explanatory Bento */}
            <div className="md:col-span-2 bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-200 border-b border-slate-800/80 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h4 className="font-light font-serif text-white text-sm">Simple Conceptual Definition</h4>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {result.conceptualExplanation}
                </p>
              </div>

              <div className="bg-[#0D1017] rounded-xl p-4 border border-slate-800/60 space-y-3 mt-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">Relatable Pakistani Analogy</span>
                <div className="space-y-2">
                  {result.pakistaniExamples.map((ex, i) => (
                    <div key={i} className="flex gap-2 items-start text-xs text-slate-300 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </motion.div>
  );
}

/* ==========================================================================
   ROADMAP TOOL (SAFAR LEARNING PATHWAY DESIGNER)
   ========================================================================== */
interface RoadmapToolProps {
  apiKeyConfigured: boolean | null;
  onSaveRoadmap: (roadmap: StudyRoadmap) => void;
  savedRoadmaps: Array<StudyRoadmap>;
}
function RoadmapTool({ apiKeyConfigured, onSaveRoadmap, savedRoadmaps }: RoadmapToolProps) {
  const [goalText, setGoalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<StudyRoadmap | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedPhases, setCompletedPhases] = useState<{ [phaseNum: number]: boolean }>({});

  const handleGenerateRoadmap = async (targetGoal: string) => {
    if (!targetGoal.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");
    setRoadmap(null);
    setCompletedPhases({});

    try {
      const res = await fetch("/api/gemini/study-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: targetGoal })
      });
      const data = await res.json();
      if (res.ok && data.roadmap) {
        setRoadmap(data.roadmap);
        onSaveRoadmap(data.roadmap);
        setGoalText("");
      } else {
        throw new Error(data.error || "Failed to formulate roadmap schedule");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to connect to AI study path creator.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePhaseCheckbox = (phaseNumber: number) => {
    setCompletedPhases(prev => ({
      ...prev,
      [phaseNumber]: !prev[phaseNumber]
    }));
  };

  const presetGoals = [
    "Prepare for MDCAT Biology in 2 months",
    "Master CSS Essay Writing & Pakistan Affairs",
    "Learn WordPress & Freelancing on Fiverr",
    "Prepare for BISE Punjab Matric Mathematics board"
  ];

  return (
    <motion.div
      key="roadmap"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6"
    >
      {/* Sidebar preset pathways */}
      <div className="lg:col-span-1 space-y-5">
        <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm">
          <h3 className="font-light font-serif text-white text-sm flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-sky-400" />
            Safar Syllabus Planner
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Set clear learning milestones. Generate optimized study roadmaps with resources like Teleschool, local syllabus boards, or online portals.
          </p>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Popular Study Targets</span>
            <div className="flex flex-col gap-1.5">
              {presetGoals.map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenerateRoadmap(g)}
                  disabled={isLoading || !apiKeyConfigured}
                  className="text-left w-full bg-[#0D1017] hover:bg-[#161B22] border border-slate-800/80 hover:border-slate-700 p-2 rounded-lg text-xs transition-all flex items-start gap-1 text-slate-300 disabled:opacity-50 cursor-pointer font-medium leading-tight"
                >
                  <Plus className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved roadmaps quick retrieval */}
        {savedRoadmaps.length > 0 && (
          <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Load Saved Pathway</span>
            <div className="space-y-1.5">
              {savedRoadmaps.slice(0, 3).map((r) => (
                <button
                  key={r.goalTitle}
                  onClick={() => {
                    setRoadmap(r);
                    setCompletedPhases({});
                  }}
                  className="w-full text-left bg-[#0D1017] hover:bg-[#161B22] p-2 rounded-lg text-[11px] font-medium border border-slate-800 transition-all text-slate-300 block truncate cursor-pointer"
                >
                  {r.goalTitle}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main roadmap timeline visualizer */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Goal input card */}
        <div className="bg-[#11141B] rounded-xl p-5 border border-slate-800/80 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-light font-serif text-white text-base flex items-center gap-1.5">
              <Compass className="w-5 h-5 text-sky-400" />
              Safar Study Schedule & Skill Roadmap Builder
            </h3>
            <p className="text-slate-400 text-xs">
              What exam or digital skill are you aiming to master? Specify your goal below to obtain a structured 4-phase program.
            </p>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. Master React JS for Upwork freelancing, FSc Physics paper in 30 days..."
              disabled={isLoading || !apiKeyConfigured}
              className="flex-1 bg-[#0D1017] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-60 placeholder:text-slate-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerateRoadmap(goalText);
              }}
            />
            <button
              onClick={() => handleGenerateRoadmap(goalText)}
              disabled={!goalText.trim() || isLoading || !apiKeyConfigured}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2 px-5 rounded-lg transition-all shadow-md shadow-sky-950/20 shrink-0 flex items-center justify-center disabled:bg-slate-800 disabled:text-slate-600 cursor-pointer"
            >
              {isLoading ? "Designing..." : "Create Schedule"}
            </button>
          </div>

          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 animate-pulse font-medium">Ustaad AI is modeling your custom roadmap phases and finding free resources...</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-xs flex gap-2 items-center">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Roadmap visual timeline */}
        {roadmap && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-900/40 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block font-mono">Custom study Roadmap</span>
                <h4 className="text-base sm:text-lg font-light font-serif">{roadmap.goalTitle}</h4>
              </div>
              <div className="shrink-0 bg-[#0D1017]/50 px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs text-center">
                <span className="text-[10px] text-sky-400 block font-mono uppercase tracking-wider">Duration</span>
                <span className="font-bold">{roadmap.estimatedCompletion}</span>
              </div>
            </div>

            {/* Timelines Cards */}
            <div className="relative border-l-2 border-slate-800/80 ml-4 pl-6 space-y-8 py-2">
              {roadmap.phases.map((phase) => {
                const isCompleted = !!completedPhases[phase.phaseNumber];
                return (
                  <div key={phase.phaseNumber} className="relative">
                    
                    {/* Timeline Node Icon/Dot */}
                    <button 
                      onClick={() => togglePhaseCheckbox(phase.phaseNumber)}
                      className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                        isCompleted 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : "bg-[#11141B] border-sky-500/50 text-sky-400 hover:bg-sky-950/40"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{phase.phaseNumber}</span>}
                    </button>

                    {/* Phase content Card */}
                    <div className={`bg-[#11141B] rounded-xl p-5 border shadow-sm transition-all space-y-4 ${
                      isCompleted ? "border-emerald-950/50 bg-emerald-950/10 opacity-75" : "border-slate-800/80 hover:border-sky-500/50"
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Phase {phase.phaseNumber}</span>
                          <h5 className="font-light font-serif text-white text-sm sm:text-base">{phase.title}</h5>
                        </div>
                        <span className="bg-sky-950/30 text-sky-400 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono self-start sm:self-center border border-sky-900/30">
                          {phase.duration}
                        </span>
                      </div>

                      {/* Key Syllabus Topics */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Topics to Cover</span>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.keyTopics.map((topic, index) => (
                            <span key={index} className="bg-[#0D1017] text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-800/60">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Detailed strategy */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Study Strategy</span>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                          {phase.strategy}
                        </p>
                      </div>

                      {/* Locally Targeted Educational Portals in Pakistan */}
                      <div className="bg-sky-950/20 rounded-lg p-3.5 border border-sky-900/40 space-y-2">
                        <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block font-mono">Recommended Pakistani Study Channels / Portals</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {phase.pakistanResources.map((res, i) => (
                            <div key={i} className="flex gap-1.5 items-start text-xs text-slate-300">
                              <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                              <span>{res}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivational summary tip */}
            <div className="bg-emerald-950/20 rounded-xl p-5 border border-emerald-900/50 flex gap-3.5 items-start shadow-sm">
              <span className="text-2xl mt-0.5 shrink-0">💡</span>
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">Ustaad Study Hack</span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {roadmap.overallTip}
                </p>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
