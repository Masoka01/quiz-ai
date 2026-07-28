import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, GROQ_TEMPERATURE, stripJsonFences } from "@/lib/groq";
import { ExplanationSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Soal wajib diisi." },
        { status: 400 }
      );
    }

    const groq = getGroqClient();

    const systemPrompt = `Anda adalah instruktur programming berpengalaman yang menjelaskan konsep secara menyeluruh.
Selalu merespons dengan JSON valid saja. Tidak ada markdown, tidak ada penjelasan di luar JSON.
Tujuan Anda adalah membantu siswa benar-benar memahami, bukan sekedar tahu jawabannya.
WAJIB menggunakan Bahasa Indonesia.`;

    const questionContext = question.codeSnippet
      ? `Soal: ${question.question}\n\nKode:\n${question.codeSnippet}`
      : `Soal: ${question.question}`;

    const choicesContext =
      question.type === "multiple-choice" && question.choices
        ? `\n\nPilihan yang tersedia:\n${question.choices.map((c: { label: string; text: string }) => `${c.label}: ${c.text}`).join("\n")}`
        : "";

    const userPrompt = `Seorang siswa menyerah pada soal programming ${question.difficulty} bertopik ${question.topic}.
Berikan penjelasan yang lengkap dan edukatif.

${questionContext}${choicesContext}

Jawaban Benar: ${question.correctAnswer}

Kembalikan objek JSON dengan struktur persis ini:
{
  "correctAnswer": "Pernyataan jelas tentang jawaban benar dalam Bahasa Indonesia",
  "detailedExplanation": "Penjelasan langkah demi langkah mengapa ini benar dan konsep yang mendasarinya dalam Bahasa Indonesia",
  "keyConceptsExplained": "Penjelasan singkat konsep programming kunci yang terlibat dalam Bahasa Indonesia",
  "codeExample": "Opsional: contoh kode praktis yang mendemonstrasikan konsep (hanya jika relevan)"
}

Buat penjelasan yang edukatif, jelas, dan menyeluruh. Bantu mereka mengerti MENGAPA, bukan hanya APA.
Untuk multiple-choice, jelaskan juga mengapa opsi lain salah.
WAJIB gunakan Bahasa Indonesia untuk semua teks.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: GROQ_TEMPERATURE,
      max_tokens: 4096,
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

    const validated = ExplanationSchema.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Respons AI tidak sesuai format yang diharapkan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ explanation: validated.data });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "Batas permintaan tercapai. Harap tunggu sebentar dan coba lagi." },
        { status: 429 }
      );
    }
    console.error("Error explaining answer:", error);
    return NextResponse.json(
      { error: "Gagal menjelaskan jawaban. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
