import { z } from "zod";

export const ChoiceSchema = z.object({
  label: z.string(),
  text: z.string(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  topic: z.enum(["html", "css", "javascript", "git", "vercel"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  type: z.enum(["multiple-choice", "essay", "code"]),
  question: z.string().min(10),
  codeSnippet: z.string().optional(),
  choices: z.array(ChoiceSchema).optional(),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(10),
});

export const FeedbackSchema = z.object({
  isCorrect: z.boolean(),
  score: z.number().min(0).max(100),
  explanation: z.string().min(10),
  whatWentWrong: z.string().optional(),
  correctAnswer: z.string().optional(),
  suggestions: z.string().optional(),
});

export const ExplanationSchema = z.object({
  correctAnswer: z.string().min(1),
  detailedExplanation: z.string().min(10),
  keyConceptsExplained: z.string().min(10),
  codeExample: z.string().optional(),
});

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;
export type FeedbackSchemaType = z.infer<typeof FeedbackSchema>;
export type ExplanationSchemaType = z.infer<typeof ExplanationSchema>;
