"use client";

import { useCallback } from "react";
import { useQuizStore } from "@/store/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QuizCard from "@/components/QuizCard";
import TopicSelector from "@/components/TopicSelector";
import DifficultySelector from "@/components/DifficultySelector";
import {
  Sparkles,
  Trophy,
  Zap,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Square,
} from "lucide-react";
import type { Question } from "@/types";

const TOPICS = [
  { emoji: "🌐", name: "HTML" },
  { emoji: "🎨", name: "CSS" },
  { emoji: "🟨", name: "JavaScript" },
  { emoji: "🌿", name: "Git" },
  { emoji: "▲", name: "Vercel" },
];

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5 text-orange-500" />,
    title: "Soal buatan AI",
    description:
      "Setiap soal itu unik, dibuat khusus untuk topik dan tingkat kesulitan yang kamu pilih.",
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-orange-500" />,
    title: "Feedback instan",
    description:
      "Kirim jawaban dan dapatkan penjelasan detail tentang apa yang benar, salah, dan kenapa.",
  },
  {
    icon: <BookOpen className="h-5 w-5 text-orange-500" />,
    title: "Belajar dengan menyerah",
    description:
      "Buntu? Tekan 'Saya Menyerah' untuk mendapatkan penjelasan lengkap.",
  },
];

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
    <div className="min-h-screen" style={{ backgroundColor: "#fcfaf7" }}>
      {/* Shell Header */}
      <header className="shell-header px-6 py-3">
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: "1400px" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">💻</span>
            <span className="font-bold">CodeQuiz AI</span>
            <Badge
              className="text-[10px] ml-2 border-0"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.60)",
              }}
            >
              Llama 3.3 via Groq
            </Badge>
          </div>

          {totalAnswered > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
            >
              <Trophy className="h-3.5 w-3.5" style={{ color: "#ffb74d" }} />
              <span className="font-semibold">{score}</span>
              <span style={{ color: "rgba(255,255,255,0.40)" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.60)" }}>
                {totalAnswered}
              </span>
            </div>
          )}
        </div>
      </header>

      <main
        className="mx-auto px-6 py-8 grid lg:grid-cols-[320px_1fr] gap-8"
        style={{ maxWidth: "1400px" }}
      >
        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="bg-white border-0 shadow-subtle">
            <CardContent className="pt-5 space-y-4">
              <TopicSelector />
              <DifficultySelector />

              <Button
                onClick={generateQuestion}
                disabled={isLoading}
                className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white border-0"
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
                  className="w-full gap-2 border-[#e3e0dd]"
                  style={{ color: "#797067" }}
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </CardContent>
          </Card>

          {totalAnswered > 0 && (
            <Card className="bg-white border-0 shadow-subtle">
              <CardContent className="pt-5">
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: "#797067" }}
                >
                  Statistik sesi
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#797067" }}>Benar</span>
                    <span className="font-semibold" style={{ color: "#00c758" }}>
                      {score}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#797067" }}>Dijawab</span>
                    <span className="font-semibold" style={{ color: "#423d38" }}>
                      {totalAnswered}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#797067" }}>Akurasi</span>
                    <span className="font-semibold" style={{ color: "#423d38" }}>
                      {Math.round((score / totalAnswered) * 100)}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden mt-2"
                    style={{ backgroundColor: "#edebe9" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(score / totalAnswered) * 100}%`,
                        backgroundColor: "#00c758",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!currentQuestion && (
            <Card className="bg-white border-0 shadow-subtle">
              <CardContent className="pt-5">
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: "#797067" }}
                >
                  Topik tersedia
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <span
                      key={t.name}
                      className="inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium"
                      style={{
                        borderColor: "#e3e0dd",
                        backgroundColor: "#ffffff",
                        color: "#423d38",
                      }}
                    >
                      <span>{t.emoji}</span>
                      {t.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>

        {/* Main content */}
        <section className="space-y-4 min-w-0">
          {error && (
            <div
              className="rounded-lg px-4 py-3 text-sm flex items-center justify-between"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
              }}
            >
              <span>{error}</span>
              <button
                onClick={() => useQuizStore.getState().setError(null)}
                className="ml-4 hover:opacity-70"
                style={{ color: "#dc2626" }}
              >
                ✕
              </button>
            </div>
          )}

          {!currentQuestion && !isLoading && (
            <div className="space-y-8">
              {/* Hero / Empty State */}
              <Card className="bg-white border-0 shadow-subtle">
                <CardContent className="py-16 text-center space-y-5">
                  <div className="text-6xl">🎯</div>
                  <h1
                    className="text-4xl font-bold tracking-tight"
                    style={{ color: "#423d38" }}
                  >
                    Belajar coding dengan{" "}
                    <span style={{ color: "#fe6e00" }}>kuis AI</span>
                  </h1>
                  <p
                    className="text-base max-w-lg mx-auto leading-relaxed"
                    style={{ color: "#797067" }}
                  >
                    Pilih topik dan tingkat kesulitan dari sidebar, lalu tekan
                    &quot;Buat Soal&quot; untuk memulai.
                  </p>
                  <Button
                    onClick={generateQuestion}
                    className="gap-2 mt-2 bg-orange-500 hover:bg-orange-600 text-white border-0"
                    size="lg"
                  >
                    <Sparkles className="h-5 w-5" />
                    Buat Soal Pertama
                  </Button>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4">
                {FEATURES.map((f) => (
                  <Card
                    key={f.title}
                    className="bg-white border-0 shadow-subtle"
                  >
                    <CardContent className="pt-6 space-y-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: "#fff7ed" }}
                      >
                        {f.icon}
                      </div>
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: "#423d38" }}
                      >
                        {f.title}
                      </h3>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "#797067" }}
                      >
                        {f.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(currentQuestion || isLoading) && (
            <QuizCard onNextQuestion={handleNextQuestion} />
          )}
        </section>
      </main>
    </div>
  );
}
