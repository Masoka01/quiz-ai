import { create } from "zustand";
import type {
  QuizState,
  Topic,
  Difficulty,
  Question,
  Feedback,
  ExplanationResult,
  QuestionHistoryEntry,
} from "@/types";

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestion: null,
  userAnswer: "",
  feedback: null,
  explanation: null,
  isLoading: false,
  isCheckingAnswer: false,
  isExplaining: false,
  topic: "html",
  difficulty: "beginner",
  hasGivenUp: false,
  score: 0,
  totalAnswered: 0,
  questionHistory: [],
  error: null,

  setTopic: (topic: Topic) => set({ topic }),
  setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
  setUserAnswer: (answer: string) => set({ userAnswer: answer }),
  setCurrentQuestion: (question: Question | null) =>
    set({ currentQuestion: question }),
  setFeedback: (feedback: Feedback | null) => set({ feedback }),
  setExplanation: (explanation: ExplanationResult | null) =>
    set({ explanation }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsCheckingAnswer: (isCheckingAnswer: boolean) =>
    set({ isCheckingAnswer }),
  setIsExplaining: (isExplaining: boolean) => set({ isExplaining }),
  setHasGivenUp: (hasGivenUp: boolean) => set({ hasGivenUp }),
  setError: (error: string | null) => set({ error }),

  addToHistory: (entry: QuestionHistoryEntry) =>
    set((state) => ({
      questionHistory: [entry, ...state.questionHistory].slice(0, 20),
      totalAnswered: state.totalAnswered + 1,
    })),

  incrementScore: () =>
    set((state) => ({ score: state.score + 1 })),

  resetQuestion: () =>
    set({
      userAnswer: "",
      feedback: null,
      explanation: null,
      hasGivenUp: false,
      error: null,
      isCheckingAnswer: false,
      isExplaining: false,
    }),
}));
