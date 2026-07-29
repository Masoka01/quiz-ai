"use client";

import { useQuizStore } from "@/store/quizStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Difficulty } from "@/types";

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Mahir" },
];

interface DifficultySelectorProps {
  compact?: boolean;
}

export default function DifficultySelector({ compact }: DifficultySelectorProps) {
  const difficulty = useQuizStore((s) => s.difficulty);
  const setDifficulty = useQuizStore((s) => s.setDifficulty);

  return (
    <Select
      value={difficulty}
      onValueChange={(val) => setDifficulty(val as Difficulty)}
    >
      <SelectTrigger className={compact ? "w-36" : "w-full"}>
        <SelectValue placeholder="Kesulitan" />
      </SelectTrigger>
      <SelectContent>
        {DIFFICULTIES.map((d) => (
          <SelectItem key={d.value} value={d.value}>
            <span className="font-medium">{d.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
