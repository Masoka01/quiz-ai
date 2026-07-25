# CodeQuiz AI

A web app for learning programming with AI-generated questions and instant feedback, powered by Groq's Llama 3.3 70B model.

## Features

- **AI-generated questions** across 5 topics and 3 difficulty levels
- **Instant AI feedback** when you submit an answer — what's right, what's wrong, and why
- **"I Give Up" mode** — get a full, step-by-step explanation of the correct answer
- **Multiple question types**: multiple choice, essay, and code challenges
- **Session stats** — track your accuracy as you go

## Topics

- JavaScript
- Python
- HTML & CSS
- Git
- Algorithms & Data Structures

## Prerequisites

- Node.js 18.17 or later
- npm 9 or later
- A Groq API key (free at [console.groq.com](https://console.groq.com))

## Getting a Groq API Key

1. Visit [console.groq.com](https://console.groq.com) and create a free account.
2. In the dashboard, go to **API Keys** in the left sidebar.
3. Click **Create API Key**, give it a name, and copy the key.
4. Keep it safe — you won't be able to see it again after closing the dialog.

## Installation

1. **Clone or unzip the project**

   ```bash
   cd coding-quiz-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

   Then open `.env.local` and replace the placeholder with your real key:

   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-question/route.ts   # Generates AI quiz questions
│   │   ├── check-answer/route.ts        # Evaluates user answers
│   │   └── explain-answer/route.ts      # Explains correct answers
│   ├── quiz/page.tsx                    # Main quiz interface
│   ├── page.tsx                         # Landing page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                              # shadcn/ui components
│   ├── QuizCard.tsx                     # Main quiz display
│   ├── AnswerForm.tsx                   # Answer input (MCQ + essay/code)
│   ├── FeedbackPanel.tsx                # AI feedback display
│   ├── TopicSelector.tsx
│   ├── DifficultySelector.tsx
│   └── CodeBlock.tsx                    # Syntax-highlighted code display
├── store/
│   └── quizStore.ts                     # Zustand state management
├── lib/
│   ├── groq.ts                          # Groq client
│   ├── schemas.ts                       # Zod validation schemas
│   └── utils.ts                         # Tailwind utility
└── types/
    └── index.ts                         # TypeScript types
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Zustand** for state management
- **Tailwind CSS** + **shadcn/ui** for styling
- **react-syntax-highlighter** for code display
- **Zod** for validating all AI responses
- **Groq SDK** with `llama-3.3-70b-versatile`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Security Notes

- The `GROQ_API_KEY` is only used server-side in API routes — it is never exposed to the browser.
- All AI responses are validated with Zod schemas before being sent to the client.
- Rate limit errors (HTTP 429) are caught and shown as friendly messages.
