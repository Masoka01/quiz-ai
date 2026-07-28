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
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
