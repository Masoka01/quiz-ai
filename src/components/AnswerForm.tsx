"use client";

import { useQuizStore } from "@/store/quizStore";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types";
import { Loader2 } from "lucide-react";

interface AnswerFormProps {
  question: Question;
  onSubmit: () => void;
  onGiveUp: () => void;
}

export default function AnswerForm({ question, onSubmit, onGiveUp }: AnswerFormProps) {
  const userAnswer = useQuizStore((s) => s.userAnswer);
  const setUserAnswer = useQuizStore((s) => s.setUserAnswer);
  const isCheckingAnswer = useQuizStore((s) => s.isCheckingAnswer);
  const isExplaining = useQuizStore((s) => s.isExplaining);
  const feedback = useQuizStore((s) => s.feedback);
  const hasGivenUp = useQuizStore((s) => s.hasGivenUp);

  const isDisabled = !!feedback || hasGivenUp || isCheckingAnswer || isExplaining;
  const canSubmit = userAnswer.trim().length > 0 && !isDisabled;

  if (question.type === "multiple-choice" && question.choices) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {question.choices.map((choice) => {
            const isSelected = userAnswer === choice.label;
            const isCorrectAnswer = feedback && choice.label === question.correctAnswer;
            const isWrongAnswer = feedback && isSelected && !feedback.isCorrect;

            let borderStyle = "border-border hover:border-primary hover:bg-primary/5";
            if (isSelected && !feedback) {
              borderStyle = "border-primary bg-primary/5";
            }
            if (isCorrectAnswer) {
              borderStyle = "border-status-success bg-green-50";
            }
            if (isWrongAnswer) {
              borderStyle = "border-status-error bg-red-50";
            }

            return (
              <button
                key={choice.label}
                onClick={() => {
                  if (isDisabled) return;
                  setUserAnswer(choice.label);
                  onSubmit();
                }}
                disabled={isDisabled}
                className={`w-full text-left rounded-lg border-2 px-4 py-3 transition-all ${borderStyle} disabled:cursor-not-allowed`}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      isSelected && !feedback
                        ? "border-primary bg-primary text-white"
                        : ""
                    } ${
                      isCorrectAnswer
                        ? "border-status-success bg-status-success text-white"
                        : ""
                    } ${
                      isWrongAnswer
                        ? "border-status-error bg-status-error text-white"
                        : ""
                    } ${
                      !isSelected && !isCorrectAnswer
                        ? "border-neutral-300 text-muted"
                        : ""
                    }`}
                  >
                    {choice.label}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{choice.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {isCheckingAnswer && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memeriksa jawaban...
          </div>
        )}

        {!feedback && !hasGivenUp && !isCheckingAnswer && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onGiveUp}
              disabled={isCheckingAnswer || isExplaining}
              className="border-border text-muted"
            >
              {isExplaining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memuat...
                </>
              ) : (
                "Saya Menyerah"
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  const isCode = question.type === "code";
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {isCode ? "Kode Kamu" : "Jawaban Kamu"}
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={isDisabled}
          placeholder={isCode ? "// Tulis kode kamu di sini..." : "Tulis jawaban kamu di sini..."}
          rows={isCode ? 8 : 4}
          className="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-muted"
          style={{
            borderColor: "#e8e8ec",
            color: "#0a0a0a",
            backgroundColor: "#ffffff",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e8e8ec";
          }}
        />
      </div>

      {!feedback && !hasGivenUp && (
        <div className="flex gap-2">
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground border-0"
          >
            {isCheckingAnswer ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memeriksa...
              </>
            ) : (
              "Kirim Jawaban"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onGiveUp}
            disabled={isCheckingAnswer || isExplaining}
            className="border-border text-muted"
          >
            {isExplaining ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              "Saya Menyerah"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
