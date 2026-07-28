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
import type { Topic } from "@/types";

const TOPICS: { value: Topic; label: string; emoji: string }[] = [
  { value: "html", label: "HTML", emoji: "🌐" },
  { value: "css", label: "CSS", emoji: "🎨" },
  { value: "javascript", label: "JavaScript", emoji: "🟨" },
  { value: "git", label: "Git", emoji: "🌿" },
  { value: "vercel", label: "Vercel", emoji: "▲" },
  { value: "neovim", label: "Neovim", emoji: "" },
];

export default function TopicSelector() {
  const topic = useQuizStore((s) => s.topic);
  const setTopic = useQuizStore((s) => s.setTopic);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="topic-select" className="text-sm font-medium text-neutral-700">
        Topik
      </Label>
      <Select value={topic} onValueChange={(val) => setTopic(val as Topic)}>
        <SelectTrigger id="topic-select" className="w-full">
          <SelectValue placeholder="Pilih topik" />
        </SelectTrigger>
        <SelectContent>
          {TOPICS.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              <span className="flex items-center gap-2">
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
