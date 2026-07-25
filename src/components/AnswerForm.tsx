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

            let borderStyle = "border-[#e3e0dd] hover:border-[#fe6e00] hover:bg-[#fff7ed]";
            if (isSelected && !feedback) {
              borderStyle = "border-[#fe6e00] bg-[#fff7ed]";
            }
            if (isCorrectAnswer) {
              borderStyle = "border-[#00c758] bg-[#f0fdf4]";
            }
            if (isWrongAnswer) {
              borderStyle = "border-[#fb2c36] bg-[#fef2f2]";
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
                        ? "border-[#fe6e00] bg-[#fe6e00] text-white"
                        : ""
                    } ${
                      isCorrectAnswer
                        ? "border-[#00c758] bg-[#00c758] text-white"
                        : ""
                    } ${
                      isWrongAnswer
                        ? "border-[#fb2c36] bg-[#fb2c36] text-white"
                        : ""
                    } ${
                      !isSelected && !isCorrectAnswer
                        ? "border-[#d1d5dc] text-[#797067]"
                        : ""
                    }`}
                  >
                    {choice.label}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "#423d38" }}>{choice.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {isCheckingAnswer && (
          <div className="flex items-center gap-2 text-sm" style={{ color: "#fe6e00" }}>
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
              className="border-[#e3e0dd]"
              style={{ color: "#797067" }}
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

  // Essay or code question
  const isCode = question.type === "code";
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#423d38" }}>
          {isCode ? "Kode Kamu" : "Jawaban Kamu"}
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={isDisabled}
          placeholder={isCode ? "// Tulis kode kamu di sini..." : "Tulis jawaban kamu di sini..."}
          rows={isCode ? 8 : 4}
          className="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#797067]"
          style={{
            borderColor: "#e3e0dd",
            color: "#423d38",
            backgroundColor: "#ffffff",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#fe6e00";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e3e0dd";
          }}
        />
      </div>

      {!feedback && !hasGivenUp && (
        <div className="flex gap-2">
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white border-0"
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
            className="border-[#e3e0dd]"
            style={{ color: "#797067" }}
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
