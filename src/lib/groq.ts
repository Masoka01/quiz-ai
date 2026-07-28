import Groq from "groq-sdk";

let groqInstance: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

export const GROQ_MODEL = "qwen/qwen3.6-27b";
export const GROQ_TEMPERATURE = 0.6;

export function stripJsonFences(text: string): string {
  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const lastBrace = text.lastIndexOf("}");
  if (lastBrace === -1) return text;

  for (let i = lastBrace; i >= 0; i--) {
    if (text[i] === "{") {
      const candidate = text.slice(i, lastBrace + 1);
      try {
        JSON.parse(candidate);
        return candidate;
      } catch {
        continue;
      }
    }
  }

  return text;
}
