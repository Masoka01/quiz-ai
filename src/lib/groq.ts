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

export const GROQ_MODEL = "llama-3.3-70b-versatile";
export const GROQ_TEMPERATURE = 0.6;

const FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

interface CallWithFallbackParams {
  messages: any[];
  temperature?: number;
  max_tokens?: number;
}

export async function callWithFallback(
  params: CallWithFallbackParams
): Promise<string> {
  const groq = getGroqClient();
  const errors: string[] = [];

  for (const model of FALLBACK_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        temperature: params.temperature ?? GROQ_TEMPERATURE,
        max_tokens: params.max_tokens ?? 4096,
        messages: params.messages,
      });
      const content = completion.choices[0]?.message?.content ?? "";
      if (content) return content;
      errors.push(`${model}: empty response`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${model}: ${msg}`);
      console.error(`Model ${model} failed, trying next...`, msg);
    }
  }

  throw new Error(`Semua model AI gagal: ${errors.join("; ")}`);
}

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
