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
      {feedback && !hasGivenUp && (
        <Card
          className="border-0"
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
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-status-success" />
              ) : feedback.score >= 60 ? (
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-status-warning" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0 text-status-error" />
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
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

            <p className="text-sm leading-relaxed text-foreground">
              {feedback.explanation}
            </p>

            {feedback.whatWentWrong && (
              <div className="rounded-md border p-3 bg-white/70 border-status-error/30">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-status-error">
                  Yang salah
                </p>
                <p className="text-sm text-foreground">{feedback.whatWentWrong}</p>
              </div>
            )}

            {feedback.correctAnswer && (
              <div className="rounded-md border p-3 bg-white/70 border-status-success/30">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-status-success">
                  Jawaban benar
                </p>
                <p className="text-sm font-mono text-foreground">{feedback.correctAnswer}</p>
              </div>
            )}

            {feedback.suggestions && (
              <div className="rounded-md p-3 bg-white/70">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted">
                  Tips
                </p>
                <p className="text-sm text-muted">{feedback.suggestions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {explanation && hasGivenUp && (
        <Card className="border-0 bg-blue-50" style={{ borderLeft: "4px solid #6366f1" }}>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="font-semibold text-foreground">Ini jawabannya</span>
            </div>

            <div className="rounded-md border p-3 bg-white/80 border-primary/30">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-primary">
                Jawaban benar
              </p>
              <p className="text-sm font-medium text-foreground">{explanation.correctAnswer}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 text-muted">
                Penjelasan detail
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {explanation.detailedExplanation}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 text-muted">
                Konsep kunci
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {explanation.keyConceptsExplained}
              </p>
            </div>

            {explanation.codeExample && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 text-muted">
                  Contoh kode
                </p>
                <CodeBlock code={explanation.codeExample} language={language} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="hidden md:block">
        <Button
          onClick={onNextQuestion}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground border-0"
          size="lg"
        >
          Soal Berikutnya
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={onNextQuestion}
          size="icon"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground border-0 shadow-raised"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
