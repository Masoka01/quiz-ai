"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const TOPIC_LANGUAGE_MAP: Record<string, string> = {
  html: "html",
  css: "css",
  javascript: "javascript",
  git: "bash",
  vercel: "json",
  neovim: "lua",
};

export default function CodeBlock({
  code,
  language = "javascript",
  className = "",
}: CodeBlockProps) {
  return (
    <div className={`rounded-lg overflow-hidden border border-neutral-200 ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={github}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          background: "#f6f8fa",
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export { TOPIC_LANGUAGE_MAP };
