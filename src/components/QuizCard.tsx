"use client";

import { useQuizStore } from "@/store/quizStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AnswerForm from "@/components/AnswerForm";
import FeedbackPanel from "@/components/FeedbackPanel";
import CodeBlock from "@/components/CodeBlock";
import { TOPIC_LANGUAGE_MAP } from "@/components/CodeBlock";
import type { Feedback, ExplanationResult, Topic } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

const TOPIC_LABELS: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  git: "Git",
  vercel: "Vercel",
  neovim: "Neovim",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-50 text-status-success border-status-success/30",
  intermediate: "bg-yellow-50 text-status-warning border-status-warning/30",
  advanced: "bg-red-50 text-status-error border-status-error/30",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Mahir",
};

const TYPE_LABELS: Record<string, string> = {
  "multiple-choice": "Pilihan Ganda",
  essay: "Esai",
  code: "Tantangan Coding",
};

interface QuizCardProps {
  onNextQuestion: () => void;
}

export default function QuizCard({ onNextQuestion }: QuizCardProps) {
  const currentQuestion = useQuizStore((s) => s.currentQuestion);
  const isLoading = useQuizStore((s) => s.isLoading);
  const feedback = useQuizStore((s) => s.feedback);
  const explanation = useQuizStore((s) => s.explanation);
  const hasGivenUp = useQuizStore((s) => s.hasGivenUp);

  const setFeedback = useQuizStore((s) => s.setFeedback);
  const setExplanation = useQuizStore((s) => s.setExplanation);
  const setIsCheckingAnswer = useQuizStore((s) => s.setIsCheckingAnswer);
  const setIsExplaining = useQuizStore((s) => s.setIsExplaining);
  const setHasGivenUp = useQuizStore((s) => s.setHasGivenUp);
  const setError = useQuizStore((s) => s.setError);
  const userAnswer = useQuizStore((s) => s.userAnswer);
  const isCheckingAnswer = useQuizStore((s) => s.isCheckingAnswer);
  const isExplaining = useQuizStore((s) => s.isExplaining);
  const addToHistory = useQuizStore((s) => s.addToHistory);
  const incrementScore = useQuizStore((s) => s.incrementScore);

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    setIsCheckingAnswer(true);
    setError(null);

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion, userAnswer }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memeriksa jawaban.");
        return;
      }

      const fb: Feedback = data.feedback;
      setFeedback(fb);

      if (fb.isCorrect || fb.score >= 80) {
        incrementScore();
      }

      addToHistory({
        question: currentQuestion,
        userAnswer,
        feedback: fb,
        hasGivenUp: false,
        timestamp: Date.now(),
      });
    } catch {
      setError("Kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const handleGiveUp = async () => {
    if (!currentQuestion) return;
    setIsExplaining(true);
    setHasGivenUp(true);
    setError(null);

    try {
      const res = await fetch("/api/explain-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memuat penjelasan.");
        return;
      }

      const exp: ExplanationResult = data.explanation;
      setExplanation(exp);

      addToHistory({
        question: currentQuestion,
        userAnswer,
        feedback: null,
        hasGivenUp: true,
        timestamp: Date.now(),
      });
    } catch {
      setError("Kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsExplaining(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-surface border-border">
        <CardHeader className="pb-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-pill" />
            <Skeleton className="h-6 w-20 rounded-pill" />
            <Skeleton className="h-6 w-28 rounded-pill" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-3/5" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  const language = TOPIC_LANGUAGE_MAP[currentQuestion.topic as Topic] || "javascript";

  return (
    <div className="space-y-4">
      <Card className="bg-surface border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs font-medium border-border text-muted">
              {TOPIC_LABELS[currentQuestion.topic] || currentQuestion.topic}
            </Badge>
            <span
              className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                DIFFICULTY_COLORS[currentQuestion.difficulty]
              }`}
            >
              {DIFFICULTY_LABELS[currentQuestion.difficulty]}
            </span>
            <Badge variant="secondary" className="text-xs">
              {TYPE_LABELS[currentQuestion.type]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base font-medium leading-relaxed text-foreground">
            {currentQuestion.question}
          </p>

          {currentQuestion.codeSnippet && (
            <CodeBlock code={currentQuestion.codeSnippet} language={language} />
          )}

          <AnswerForm
            question={currentQuestion}
            onSubmit={handleSubmitAnswer}
            onGiveUp={handleGiveUp}
          />
        </CardContent>
      </Card>

      {(feedback || explanation) && (
        <FeedbackPanel onNextQuestion={onNextQuestion} />
      )}
    </div>
  );
}
