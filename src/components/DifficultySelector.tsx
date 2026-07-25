"use client";

import { useQuizStore } from "@/store/quizStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Difficulty } from "@/types";

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: "beginner", label: "Pemula", description: "Konsep dasar & fundamentals" },
  { value: "intermediate", label: "Menengah", description: "Penerapan praktis" },
  { value: "advanced", label: "Mahir", description: "Edge cases & performa" },
];

export default function DifficultySelector() {
  const difficulty = useQuizStore((s) => s.difficulty);
  const setDifficulty = useQuizStore((s) => s.setDifficulty);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="difficulty-select" className="text-sm font-medium text-neutral-700">
        Tingkat Kesulitan
      </Label>
      <Select
        value={difficulty}
        onValueChange={(val) => setDifficulty(val as Difficulty)}
      >
        <SelectTrigger id="difficulty-select" className="w-full">
          <SelectValue placeholder="Pilih tingkat kesulitan" />
        </SelectTrigger>
        <SelectContent>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              <span className="flex flex-col">
                <span className="font-medium">{d.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
