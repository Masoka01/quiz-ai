import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, GROQ_TEMPERATURE, stripJsonFences } from "@/lib/groq";
import { QuestionSchema } from "@/lib/schemas";

// Use crypto.randomUUID instead of uuid package
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const TOPIC_LABELS: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  git: "Git",
  vercel: "Vercel",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, difficulty, previousQuestions } = body;

    if (!topic || !difficulty) {
      return NextResponse.json(
        { error: "Topik dan tingkat kesulitan wajib diisi." },
        { status: 400 }
      );
    }

    const groq = getGroqClient();

    const systemPrompt = `Anda adalah instruktur programming berpengalaman yang membuat soal quiz berkualitas tinggi.
Selalu merespons dengan JSON valid saja. Tidak ada markdown, tidak ada penjelasan di luar JSON.
WAJIB menggunakan Bahasa Indonesia.`;

    const uniqueSeed = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

    const previousContext =
      previousQuestions && previousQuestions.length > 0
        ? `\n\nSoal-soal yang sudah pernah dibuat sebelumnya (JANGAN buat soal yang sama atau mirip dengan ini):\n${previousQuestions
            .map(
              (pq: { question: string; topic: string }, i: number) =>
                `${i + 1}. [${pq.topic}] ${pq.question}`
            )
            .join("\n")}`
        : "";

    const userPrompt = `Buatlah satu soal quiz programming UNIK untuk:
- Topik: ${TOPIC_LABELS[topic] || topic}
- Tingkat kesulitan: ${difficulty}
- Seed unik: ${uniqueSeed}${previousContext}

Kembalikan objek JSON dengan struktur persis seperti ini:
{
  "id": "${generateId()}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "type": "multiple-choice" | "essay" | "code",
  "question": "Teks pertanyaan dalam Bahasa Indonesia",
  "codeSnippet": "Opsional: kode contoh jika relevan (gunakan kode asli, bukan placeholder)",
  "choices": [
    { "label": "A", "text": "Opsi pertama dalam Bahasa Indonesia" },
    { "label": "B", "text": "Opsi kedua dalam Bahasa Indonesia" },
    { "label": "C", "text": "Opsi ketiga dalam Bahasa Indonesia" },
    { "label": "D", "text": "Opsi keempat dalam Bahasa Indonesia" }
  ],
  "correctAnswer": "Untuk multiple-choice: huruf label (A/B/C/D). Untuk essay/code: jawaban benar yang ringkas.",
  "explanation": "Penjelasan yang jelas dalam Bahasa Indonesia mengapa ini jawaban yang benar"
}

Aturan:
- Untuk "multiple-choice": sertakan array choices dengan 4 opsi (A, B, C, D), correctAnswer cukup huruf labelnya
- Untuk "essay": tidak perlu choices, correctAnswer adalah jawaban model singkat (1-3 kalimat)
- Untuk "code": minta user menulis atau melengkapi kode, tidak perlu choices, correctAnswer adalah kode yang benar
- Buat pertanyaan yang genuinely edukatif dan sesuai level ${difficulty}
- Jika menyertakan codeSnippet, gunakan field "codeSnippet", jangan di dalam teks question
- Variasikan tipe soal: kadang multiple-choice, kadang essay atau code challenge
- Untuk pemula: fokus pada fundamental; menengah: penerapan praktis; mahir: edge cases, performa, desain
- WAJIB gunakan Bahasa Indonesia untuk semua teks termasuk pertanyaan, pilihan, dan penjelasan
- PENTING: Jangan pernah membuat soal yang sama atau mirip dengan soal-soal sebelumnya yang sudah didaftarkan di atas. Setiap soal harus benar-benar baru dan berbeda.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: GROQ_TEMPERATURE,
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = stripJsonFences(raw);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI mengembalikan JSON tidak valid. Silakan coba lagi." },
        { status: 500 }
      );
    }

    const validated = QuestionSchema.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Respons AI tidak sesuai format yang diharapkan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ question: validated.data });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "Batas permintaan tercapai. Harap tunggu sebentar dan coba lagi." },
        { status: 429 }
      );
    }
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Gagal membuat soal. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
