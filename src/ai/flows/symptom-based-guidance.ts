'use server';
/**
 * @fileOverview Provides symptom-based guidance to users by offering a ranked list of possible causes and urgency levels.
 *
 * - symptomBasedGuidance - A function that processes user-described symptoms and returns potential causes and urgency.
 * - SymptomBasedGuidanceInput - The input type for the symptomBasedGuidance function.
 * - SymptomBasedGuidanceOutput - The return type for the symptomBasedGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomBasedGuidanceInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the experienced symptoms.'),
  age: z.number().optional().describe('The age of the user.'),
  gender: z.string().optional().describe('The gender of the user.'),
  duration: z.string().optional().describe('How long the symptoms have been present.'),
  severity: z
    .string()
    .optional()
    .describe('The severity level of the symptoms (e.g., mild, moderate, severe).'),
  language: z
    .string()
    .optional()
    .describe(
      'The language for the response (e.g., "English", "Spanish", "Hindi"). Defaults to English.'
    ),
});
export type SymptomBasedGuidanceInput = z.infer<
  typeof SymptomBasedGuidanceInputSchema
>;

const SymptomBasedGuidanceOutputSchema = z.object({
  possibleCauses: z
    .array(
      z.object({
        cause: z.string().describe('A possible cause for the symptoms.'),
        urgency: z
          .enum(['routine', 'consult soon', 'emergency'])
          .describe(
            'The recommended urgency level for seeking medical attention.'
          ),
        rationale: z
          .string()
          .describe(
            'Explanation of why this cause is possible based on the symptoms.'
          ),
      })
    )
    .describe(
      'A ranked list of possible causes for the symptoms, with associated urgency levels and rationales.'
    ),
  disclaimer: z
    .string()
    .describe('Mandatory disclaimer about the informational nature of the guidance.'),
});
export type SymptomBasedGuidanceOutput = z.infer<
  typeof SymptomBasedGuidanceOutputSchema
>;

export async function symptomBasedGuidance(
  input: SymptomBasedGuidanceInput
): Promise<SymptomBasedGuidanceOutput> {
  return symptomBasedGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomBasedGuidancePrompt',
  input: {schema: SymptomBasedGuidanceInputSchema},
  output: {schema: SymptomBasedGuidanceOutputSchema},
  prompt: `You are a medical AI assistant providing possible causes for user-described symptoms.

  Your response (causes, rationale, and disclaimer) MUST be in the following language: {{{language}}}.

  Consider the following details provided by the user:
  Symptoms: {{{symptoms}}}
  Age: {{{age}}}
  Gender: {{{gender}}}
  Duration: {{{duration}}}
  Severity: {{{severity}}}

  Provide a ranked list of possible causes, with an associated urgency level (routine, consult soon, emergency) for each.
  Include a rationale for each possible cause based on the provided symptoms.

  Disclaimer: MediaID AI provides educational and informational health insights only. This is not a professional medical diagnosis and must not be used as a substitute for consultation, diagnosis, or treatment by a licensed doctor or qualified healthcare provider.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const symptomBasedGuidanceFlow = ai.defineFlow(
  {
    name: 'symptomBasedGuidanceFlow',
    inputSchema: SymptomBasedGuidanceInputSchema,
    outputSchema: SymptomBasedGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      language: input.language || 'English',
    });
    return {
      ...output,
      disclaimer:
        'MediaID AI provides educational and informational health insights only. This is not a professional medical diagnosis and must not be used as a substitute for consultation, diagnosis, or treatment by a licensed doctor or qualified healthcare provider.',
    } as SymptomBasedGuidanceOutput;
  }
);
