# CodeQuiz AI

A web app for learning programming with AI-generated questions and instant feedback, powered by Groq.

## Design: Genesis

An editorial precision interface for a developer learning platform. Aesthetic is quietly confident — bold display typography, generous spacing, and clean card surfaces.

### Colors

| Token | Hex | Usage |
|---|---|---|
| Primary | `#6366F1` | CTAs, active states, links, focus rings |
| Primary Hover | `#4F46E5` | Hover states on primary elements |
| Background | `#FAFAFA` | Page background |
| Surface | `#FFFFFF` | Cards, panels, modals |
| Text Primary | `#0A0A0A` | Headings, body text |
| Text Secondary | `#6B6B6B` | Descriptions, metadata |
| Border | `#E8E8EC` | Card borders, dividers, inputs |
| Success | `#10B981` | Correct answers |
| Warning | `#F59E0B` | Partial correct |
| Error | `#EF4444` | Wrong answers |

### Typography

- **Display**: General Sans (Fontshare) — bold, -0.03em to -0.04em letter-spacing
- **Body**: DM Sans (Google Fonts) — regular & medium
- **Code**: JetBrains Mono (Google Fonts) — regular

### Components

- **Buttons**: Primary `#6366F1` fill, 6px radius, lift 1px on hover with glow shadow
- **Cards**: White, 1px `#E8E8EC` border, 12px radius, hover shadow (0 8px 30px rgba(0,0,0,0.08))
- **Inputs**: 1px border, focus turns primary with 3px ring
- **Nav**: Sticky, backdrop-blur, 56px height, 1px bottom border

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Zustand** for state management
- **Tailwind CSS** + **shadcn/ui** for styling
- **react-syntax-highlighter** for code display
- **Zod** for validating AI responses
- **Groq SDK** — multi-model fallback (Qwen 3.6 → Llama 3.3 → Llama 3.1)

## Topics

- HTML, CSS, JavaScript, Git, Vercel, Neovim

## Getting Started

```bash
npm install
cp .env.example .env.local  # add your GROQ_API_KEY
npm run dev                  # → http://localhost:3000
```
