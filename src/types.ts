export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanationEnglish: string;
  explanationUrdu: string;
}

export interface BilingualExplanation {
  urduTranslation: string;
  romanUrduTranslation: string;
  conceptualExplanation: string;
  pakistaniExamples: string[];
}

export interface StudyPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  keyTopics: string[];
  strategy: string;
  pakistanResources: string[];
}

export interface StudyRoadmap {
  goalTitle: string;
  estimatedCompletion: string;
  phases: StudyPhase[];
  overallTip: string;
}

export type ActiveTool = "dashboard" | "tutor" | "quiz" | "translator" | "roadmap";
