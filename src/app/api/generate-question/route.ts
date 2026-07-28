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
  neovim: "Neovim",
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

    const neovimContent =
      topic === "neovim"
        ? `\nKhusus untuk topik Neovim, fokus pada materi berikut sesuai tingkat kesulitan:
- **Pemula**: Fokus pada SHORTCUT dasar Neovim — semua shortcut berikut boleh ditanyakan:
  - Navigasi: h (kiri), j (bawah), k (atas), l (kanan), w (kata berikutnya), b (kata sebelumnya), e (akhir kata), gg (awal file), G (akhir file), 0 (awal baris), $ (akhir baris), Ctrl+d (scroll down), Ctrl+u (scroll up), Ctrl+f (halaman berikutnya), Ctrl+b (halaman sebelumnya)
  - Editing: dd (cut baris), yy (copy baris), p (paste bawah), P (paste atas), x (hapus karakter), u (undo), Ctrl+r (redo), . (ulangi), J (gabung baris), r (ganti karakter), ~ (toggle case)
  - Mode: i (insert), a (append setelah kursor), A (append akhir baris), o (baris baru bawah), O (baris baru atas), v (visual), V (visual line), Ctrl+v (visual block), : (command), Esc (normal)
  - File: :w (simpan), :q (keluar), :wq/:x (simpan+keluar), :q! (keluar paksa), :e (buka file), ZZ (simpan+keluar cepat), ZQ (keluar tanpa simpan)
  - Window: :sp (split horizontal), :vs (split vertikal), Ctrl+w h/j/k/l (pindah split)
  - Tab: :tabnew (tab baru), :tabnext, :tabprev
  - Search: / (cari), n (lanjut), N (kembali), * (cari kata di bawah kursor), :s/lama/baru/g (replace)
  - Plugin: :Lazy (lazy.nvim), :Telescope find_files, :Mason
  - Miscellaneous: gf (buka file), Ctrl+](tag jump), gd (go to definition), K (hover docs)
- **Menengah**: Visual mode (v, V, Ctrl+v), macros (qa...q, @a), registers (""", "0, "a), marks (ma, 'a), split windows (:sp, :vs), tabs (:tabnew), search & replace (:s/foo/bar/g), global command (:g), folds (zc, zo), quickfix list, keymaps (vim.keymap.set), options (vim.opt)
- **Mahir**: User commands (vim.api.nvim_create_user_command), autocommands (vim.api.nvim_create_autocmd), Lua plugin development, custom LSP config (vim.lsp), Telescope custom picker, debugging with DAP, Neovim API internals
Buat soal yang bersifat praktis, langsung berguna di kehidupan sehari-hari pengguna Neovim. Berikan soal dalam bentuk pilihan ganda yang menguji pemahaman, bukan hafalan. Pastikan opsi yang salah (distractors) terlihat realistis dan meyakinkan — seolah-olah itu juga bisa menjadi jawaban benar bagi yang belum paham.`
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
- PENTING: Jangan pernah menyebutkan kata kunci jawaban di dalam teks pertanyaan. Soal harus berupa skenario atau kasus, bukan definisi. Contoh buruk: "Apa fungsi perintah :wq..." (bocor). Contoh baik: "Kamu ingin menyimpan file lalu keluar dari Neovim. Perintah apa yang tepat?"
- Jika menyertakan codeSnippet, gunakan field "codeSnippet", jangan di dalam teks question
- Variasikan tipe soal: kadang multiple-choice, kadang essay atau code challenge
- Untuk pemula: fokus pada fundamental; menengah: penerapan praktis; mahir: edge cases, performa, desain
- WAJIB gunakan Bahasa Indonesia untuk semua teks termasuk pertanyaan, pilihan, dan penjelasan
- PENTING: Opsi yang salah (distractors) harus terlihat meyakinkan — panjang dan format konsisten dengan opsi benar, menggunakan terminologi yang relevan, dan tidak kentara sebagai jawaban salah. Jangan membuat opsi salah yang terlalu pendek, tidak relevan, atau konyol sehingga kunci jawaban mudah ditebak.
- PENTING: Jangan pernah membuat soal yang sama atau mirip dengan soal-soal sebelumnya yang sudah didaftarkan di atas. Setiap soal harus benar-benar baru dan berbeda.
${neovimContent}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: GROQ_TEMPERATURE,
      max_tokens: 2048,
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
