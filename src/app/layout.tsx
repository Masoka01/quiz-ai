import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeQuiz AI — Belajar Coding dengan AI",
  description:
    "Latih kemampuan programming-mu dengan soal berbasis AI dan feedback instan. Topik: HTML, CSS, JavaScript, Git, dan Vercel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
