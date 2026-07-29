import { NextRequest, NextResponse } from "next/server";
import { callWithFallback, stripJsonFences } from "@/lib/groq";
import { FeedbackSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, userAnswer } = body;

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: "Soal dan jawaban wajib diisi." },
        { status: 400 }
      );
    }

    const systemPrompt = `Anda adalah instruktur programming berpengalaman yang mengevaluasi jawaban siswa.
Selalu merespons dengan JSON valid saja. Tidak ada markdown, tidak ada penjelasan di luar JSON.
Bersikaplah mendorong tetapi jujur. Tunjukkan kesalahan spesifik dengan jelas.
WAJIB menggunakan Bahasa Indonesia.`;

    const questionContext = question.codeSnippet
      ? `Soal: ${question.question}\n\nKode:\n${question.codeSnippet}`
      : `Soal: ${question.question}`;

    const choicesContext =
      question.type === "multiple-choice" && question.choices
        ? `\n\nPilihan yang tersedia:\n${question.choices.map((c: { label: string; text: string }) => `${c.label}: ${c.text}`).join("\n")}`
        : "";

    const userPrompt = `Evaluasi jawaban ini untuk soal programming ${question.difficulty} bertopik ${question.topic}.

${questionContext}${choicesContext}

Jawaban Benar: ${question.correctAnswer}

Jawaban Siswa: ${userAnswer}

Kembalikan objek JSON dengan struktur persis ini:
{
  "isCorrect": true | false,
  "score": 0-100,
  "explanation": "Penilaian keseluruhan jawaban dalam Bahasa Indonesia",
  "whatWentWrong": "Kesalahan spesifik jika ada (hapus jika benar)",
  "correctAnswer": "Tulis ulang jawaban benar dengan jelas jika salah (hapus jika benar)",
  "suggestions": "Tips untuk perbaikan (hapus jika sepenuhnya benar)"
}

Panduan skor:
- 100: Sepenuhnya benar
- 80-99: Sebagian besar benar dengan masalah minor
- 60-79: Sebagian benar, menunjukkan pemahaman
- 40-59: Beberapa elemen benar tetapi ada celah signifikan
- 20-39: Sebagian besar salah tetapi menunjukkan usaha
- 0-19: Sepenuhnya salah atau tidak ada usaha nyata

Untuk multiple-choice: periksa apakah label cocok dengan label jawaban benar.
WAJIB gunakan Bahasa Indonesia untuk semua teks.`;

    const raw = await callWithFallback({
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
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

    const validated = FeedbackSchema.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Respons AI tidak sesuai format yang diharapkan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ feedback: validated.data });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "Batas permintaan tercapai. Harap tunggu sebentar dan coba lagi." },
        { status: 429 }
      );
    }
    console.error("Error checking answer:", error);
    return NextResponse.json(
      { error: "Gagal memeriksa jawaban. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
