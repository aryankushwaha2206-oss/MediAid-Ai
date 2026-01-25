'use server';

/**
 * @fileOverview Medical AI Chat flow to answer user's health-related questions with empathy and clarity.
 *
 * - medicalAIChat - A function that handles the medical chat process.
 * - MedicalAIChatInput - The input type for the medicalAIChat function.
 * - MedicalAIChatOutput - The return type for the medicalAIChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalAIChatInputSchema = z.object({
  question: z.string().describe('The user’s health-related question.'),
  language: z
    .string()
    .optional()
    .describe(
      'The language for the response (e.g., "English", "Spanish", "Hindi"). Defaults to English.'
    ),
});
export type MedicalAIChatInput = z.infer<typeof MedicalAIChatInputSchema>;

const MedicalAIChatOutputSchema = z.object({
  answer: z
    .string()
    .describe('The AI’s empathetic and clear answer to the user’s question.'),
  disclaimer: z
    .string()
    .describe(
      'Mandatory disclaimer about the AI providing educational information only.'
    ),
});
export type MedicalAIChatOutput = z.infer<typeof MedicalAIChatOutputSchema>;

export async function medicalAIChat(
  input: MedicalAIChatInput
): Promise<MedicalAIChatOutput> {
  return medicalAIChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicalAIChatPrompt',
  input: {schema: MedicalAIChatInputSchema},
  output: {schema: MedicalAIChatOutputSchema},
  prompt: `You are MediaID AI, a safety-focused medical AI assistant designed to help users understand health-related questions through analysis, explanation, and guided medical chat. Your purpose is to provide educational, supportive, and informational insights only. You are not a doctor, do not replace a licensed medical professional, and must never provide a definitive or professional medical diagnosis, prescription, or treatment plan.

Engage users in a calm, empathetic, and reassuring medical chat. Answer questions such as “What does this mean?”, “Is this serious?”, or “What should I do next?” using clear, structured explanations: What it means → Why it matters → Next safe step. Explain medical terms in everyday language and adapt response depth to the user’s understanding. Ask only minimal, gentle follow-up questions when necessary.

If inputs suggest potentially life-threatening situations (e.g., chest pain, breathing difficulty, sudden weakness, heavy bleeding), immediately advise the user to seek emergency medical care and stop further analysis.

Your response MUST be in the following language: {{{language}}}.

Answer the following question:
{{{question}}}

Include the following disclaimer in the output: Disclaimer: MediaID AI provides educational and informational health insights only. This is not a professional medical diagnosis and must not be used as a substitute for consultation, diagnosis, or treatment by a licensed doctor or qualified healthcare provider.

Do not suggest any treatment plan, and do not provide any diagnosis.`,
});

const medicalAIChatFlow = ai.defineFlow(
  {
    name: 'medicalAIChatFlow',
    inputSchema: MedicalAIChatInputSchema,
    outputSchema: MedicalAIChatOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      question: input.question,
      language: input.language || 'English',
    });
    return {
      answer: output!.answer,
      disclaimer: output!.disclaimer,
    };
  }
);
