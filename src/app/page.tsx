"use client";

import { useCallback } from "react";
import { useQuizStore } from "@/store/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuizCard from "@/components/QuizCard";
import TopicSelector from "@/components/TopicSelector";
import DifficultySelector from "@/components/DifficultySelector";
import { Sparkles, Trophy, Square } from "lucide-react";
import type { Question } from "@/types";

export default function Home() {
  const isLoading = useQuizStore((s) => s.isLoading);
  const currentQuestion = useQuizStore((s) => s.currentQuestion);
  const score = useQuizStore((s) => s.score);
  const totalAnswered = useQuizStore((s) => s.totalAnswered);
  const error = useQuizStore((s) => s.error);

  const setIsLoading = useQuizStore((s) => s.setIsLoading);
  const setCurrentQuestion = useQuizStore((s) => s.setCurrentQuestion);
  const setError = useQuizStore((s) => s.setError);
  const resetQuestion = useQuizStore((s) => s.resetQuestion);

  const generateQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    resetQuestion();
    setCurrentQuestion(null);

    const state = useQuizStore.getState();
    const previousQuestions = state.questionHistory
      .filter((entry) => entry.question.topic === state.topic)
      .slice(0, 10)
      .map((entry) => ({
        question: entry.question.question,
        topic: entry.question.topic,
      }));

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: state.topic,
          difficulty: state.difficulty,
          previousQuestions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat soal.");
        return;
      }

      const question: Question = data.question;
      setCurrentQuestion(question);
    } catch {
      setError("Kesalahan jaringan. Periksa koneksi dan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, resetQuestion, setCurrentQuestion]);

  const handleNextQuestion = useCallback(() => {
    generateQuestion();
  }, [generateQuestion]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <nav className="nav-bar flex items-center justify-between px-6">
        <div
          className="mx-auto flex w-full items-center justify-between"
          style={{ maxWidth: "1280px" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💻</span>
            <span className="text-sm font-semibold text-foreground">
              CodeQuiz AI
            </span>
          </div>

          {totalAnswered > 0 && (
            <div className="flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-sm border-border">
              <Trophy className="h-3.5 w-3.5 text-[#f59e0b]" />
              <span className="font-semibold text-foreground">{score}</span>
              <span className="text-muted">/</span>
              <span className="text-muted">{totalAnswered}</span>
            </div>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-8">
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-status-error/30 bg-red-50 px-4 py-3 text-sm text-status-error">
            <span>{error}</span>
            <button
              onClick={() => useQuizStore.getState().setError(null)}
              className="ml-4 hover:opacity-70 text-status-error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Controls bar */}
        <div className="flex items-center gap-3 mb-8">
          <TopicSelector compact />
          <DifficultySelector compact />
          <Button
            onClick={generateQuestion}
            disabled={isLoading}
            className="gap-2 bg-primary hover:bg-primary-hover text-primary-foreground border-0"
          >
            <Sparkles className="h-4 w-4" />
            {currentQuestion ? "Soal Baru" : "Buat Soal"}
          </Button>
          {currentQuestion && (
            <Button
              onClick={() => {
                resetQuestion();
                setCurrentQuestion(null);
              }}
              variant="outline"
              size="icon"
              className="border-border text-muted"
            >
              <Square className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!currentQuestion && !isLoading && (
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground font-display">
              Belajar coding dengan{" "}
              <span className="text-primary">kuis AI</span>
            </h1>
            <p className="mt-3 text-base text-muted max-w-md mx-auto">
              Pilih topik dan tingkat kesulitan di atas, lalu tekan Buat Soal
              untuk memulai.
            </p>
            <Button
              onClick={generateQuestion}
              className="mt-6 gap-2 bg-primary hover:bg-primary-hover text-primary-foreground border-0"
              size="lg"
            >
              <Sparkles className="h-5 w-5" />
              Buat Soal Pertama
            </Button>
          </div>
        )}

        {(currentQuestion || isLoading) && (
          <QuizCard onNextQuestion={handleNextQuestion} />
        )}
      </main>
    </div>
  );
}
