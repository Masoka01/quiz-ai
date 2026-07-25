export type Topic = "html" | "css" | "javascript" | "git" | "vercel";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type QuestionType = "multiple-choice" | "essay" | "code";

export interface Choice {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  choices?: Choice[];
  correctAnswer: string;
  explanation: string;
}

export interface Feedback {
  isCorrect: boolean;
  score: number; // 0-100
  explanation: string;
  whatWentWrong?: string;
  correctAnswer?: string;
  suggestions?: string;
}

export interface ExplanationResult {
  correctAnswer: string;
  detailedExplanation: string;
  keyConceptsExplained: string;
  codeExample?: string;
}

export interface QuestionHistoryEntry {
  question: Question;
  userAnswer: string;
  feedback: Feedback | null;
  hasGivenUp: boolean;
  timestamp: number;
}

export interface QuizState {
  currentQuestion: Question | null;
  userAnswer: string;
  feedback: Feedback | null;
  explanation: ExplanationResult | null;
  isLoading: boolean;
  isCheckingAnswer: boolean;
  isExplaining: boolean;
  topic: Topic;
  difficulty: Difficulty;
  hasGivenUp: boolean;
  score: number;
  totalAnswered: number;
  questionHistory: QuestionHistoryEntry[];
  error: string | null;

  // Actions
  setTopic: (topic: Topic) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setUserAnswer: (answer: string) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setFeedback: (feedback: Feedback | null) => void;
  setExplanation: (explanation: ExplanationResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsCheckingAnswer: (checking: boolean) => void;
  setIsExplaining: (explaining: boolean) => void;
  setHasGivenUp: (gaveUp: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (entry: QuestionHistoryEntry) => void;
  resetQuestion: () => void;
  incrementScore: () => void;
}
