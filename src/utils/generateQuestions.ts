import { z } from "zod";
import { createLLM } from "@/utils/llm";

const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answerIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
});

const QuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type Question = z.infer<typeof QuestionSchema>;

const MAX_ATTEMPTS = 3;

const PROMPT = (text: string, count: number) =>
  `You are a reading comprehension assistant. Generate exactly ${count} multiple choice questions to test understanding of the following text.

For each question:
- Focus on key facts, main ideas, or important details from the text
- Provide exactly 4 answer options (A, B, C, D)
- Set answerIndex to the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
- Provide a brief explanation for why the correct answer is right

Text:
${text}`;

export const generateQuestions = async (text: string, count: number): Promise<Question[]> => {
  const llm = createLLM();
  const structured = llm.withStructuredOutput(QuestionsResponseSchema);

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const result = await structured.invoke([{ role: "user", content: PROMPT(text, count) }]);
      return result.questions;
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError;
};
