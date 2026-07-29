"use client";

import { useQuizStore } from "@/store/quizStore";
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
  { value: "neovim", label: "Neovim", emoji: "🔧" },
];

interface TopicSelectorProps {
  compact?: boolean;
}

export default function TopicSelector({ compact }: TopicSelectorProps) {
  const topic = useQuizStore((s) => s.topic);
  const setTopic = useQuizStore((s) => s.setTopic);

  return (
    <Select value={topic} onValueChange={(val) => setTopic(val as Topic)}>
      <SelectTrigger className={`${compact ? "w-36" : "w-full"} bg-surface`}>
        <SelectValue placeholder="Topik" />
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
  );
}
