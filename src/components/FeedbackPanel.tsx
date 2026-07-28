"use client";

import { useQuizStore } from "@/store/quizStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CodeBlock from "@/components/CodeBlock";
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import type { Topic } from "@/types";
import { TOPIC_LANGUAGE_MAP } from "@/components/CodeBlock";

interface FeedbackPanelProps {
  onNextQuestion: () => void;
}

export default function FeedbackPanel({ onNextQuestion }: FeedbackPanelProps) {
  const feedback = useQuizStore((s) => s.feedback);
  const explanation = useQuizStore((s) => s.explanation);
  const hasGivenUp = useQuizStore((s) => s.hasGivenUp);
  const currentQuestion = useQuizStore((s) => s.currentQuestion);

  if (!feedback && !explanation) return null;

  const language = currentQuestion
    ? TOPIC_LANGUAGE_MAP[currentQuestion.topic as Topic] || "javascript"
    : "javascript";

  return (
    <div className="space-y-4">
      {/* Answer Feedback */}
      {feedback && !hasGivenUp && (
        <Card
          className="border-0 shadow-subtle"
          style={{
            backgroundColor: feedback.isCorrect
              ? "#f0fdf4"
              : feedback.score >= 60
              ? "#fefce8"
              : "#fef2f2",
          }}
        >
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center gap-3">
              {feedback.isCorrect ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#00c758" }} />
              ) : feedback.score >= 60 ? (
                <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#edb200" }} />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#fb2c36" }} />
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ color: "#423d38" }}>
                  {feedback.isCorrect
                    ? "Benar!"
                    : feedback.score >= 60
                    ? "Sebagian benar"
                    : "Kurang tepat"}
                </span>
                <Badge
                  variant={
                    feedback.score >= 80
                      ? "default"
                      : feedback.score >= 60
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {feedback.score}/100
                </Badge>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "#423d38" }}>
              {feedback.explanation}
            </p>

            {feedback.whatWentWrong && (
              <div
                className="rounded-md border p-3"
                style={{
                  backgroundColor: "rgba(255,255,255,0.70)",
                  borderColor: "#fecaca",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#dc2626" }}>
                  Yang salah
                </p>
                <p className="text-sm" style={{ color: "#423d38" }}>{feedback.whatWentWrong}</p>
              </div>
            )}

            {feedback.correctAnswer && (
              <div
                className="rounded-md border p-3"
                style={{
                  backgroundColor: "rgba(255,255,255,0.70)",
                  borderColor: "#bbf7d0",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#16a34a" }}>
                  Jawaban benar
                </p>
                <p className="text-sm font-mono" style={{ color: "#423d38" }}>{feedback.correctAnswer}</p>
              </div>
            )}

            {feedback.suggestions && (
              <div
                className="rounded-md p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.70)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#797067" }}>
                  Tips
                </p>
                <p className="text-sm" style={{ color: "#797067" }}>{feedback.suggestions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Give Up Explanation */}
      {explanation && hasGivenUp && (
        <Card
          className="border-0 shadow-subtle"
          style={{ backgroundColor: "#eff6ff", borderLeft: "4px solid #3080ff" }}
        >
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#3080ff" }} />
              <span className="font-semibold" style={{ color: "#423d38" }}>Ini jawabannya</span>
            </div>

            <div
              className="rounded-md border p-3"
              style={{
                backgroundColor: "rgba(255,255,255,0.80)",
                borderColor: "#bfdbfe",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#2563eb" }}>
                Jawaban benar
              </p>
              <p className="text-sm font-medium" style={{ color: "#423d38" }}>{explanation.correctAnswer}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#797067" }}>
                Penjelasan detail
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#423d38" }}>
                {explanation.detailedExplanation}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#797067" }}>
                Konsep kunci
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#423d38" }}>
                {explanation.keyConceptsExplained}
              </p>
            </div>

            {explanation.codeExample && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#797067" }}>
                  Contoh kode
                </p>
                <CodeBlock code={explanation.codeExample} language={language} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Desktop: full-width button */}
      <div className="hidden md:block">
        <Button
          onClick={onNextQuestion}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
          size="lg"
        >
          Soal Berikutnya
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile: floating action button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={onNextQuestion}
          size="icon"
          className="h-14 w-14 rounded-full shadow-raised bg-orange-500 hover:bg-orange-600 text-white border-0"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
