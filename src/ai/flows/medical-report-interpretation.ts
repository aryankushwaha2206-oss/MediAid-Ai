'use server';

/**
 * @fileOverview This file defines a Genkit flow for interpreting medical reports.
 *
 * - interpretMedicalReport - A function that takes a medical report as input and returns a simplified explanation.
 * - MedicalReportInput - The input type for the interpretMedicalReport function.
 * - MedicalReportOutput - The return type for the interpretMedicalReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalReportInputSchema = z.object({
  reportText: z
    .string()
    .describe('The text content of the medical report to be interpreted.'),
});
export type MedicalReportInput = z.infer<typeof MedicalReportInputSchema>;

const MedicalReportOutputSchema = z.object({
  simplifiedExplanation: z
    .string()
    .describe(
      'A simplified, non-technical explanation of the medical report content.'
    ),
});
export type MedicalReportOutput = z.infer<typeof MedicalReportOutputSchema>;

export async function interpretMedicalReport(
  input: MedicalReportInput
): Promise<MedicalReportOutput> {
  return interpretMedicalReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretMedicalReportPrompt',
  input: {schema: MedicalReportInputSchema},
  output: {schema: MedicalReportOutputSchema},
  prompt: `You are a medical expert skilled at explaining complex medical reports in simple, non-technical terms.

  Please provide a simplified explanation of the following medical report, focusing on the key findings and their potential implications. Use language that a layperson can easily understand. Always remind the user that this interpretation is not a substitute for professional medical advice, and they should consult with their doctor for further clarification.

  Medical Report:
  {{reportText}}
  `,
});

const interpretMedicalReportFlow = ai.defineFlow(
  {
    name: 'interpretMedicalReportFlow',
    inputSchema: MedicalReportInputSchema,
    outputSchema: MedicalReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
