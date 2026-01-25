// EmergencyDetection flow to identify life-threatening situations from user inputs and advise seeking emergency medical care.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyDetectionInputSchema = z.object({
  userInput: z.string().describe('The user input describing their situation.'),
  language: z
    .string()
    .optional()
    .describe('The language for the response (e.g., "English", "Spanish").'),
});
export type EmergencyDetectionInput = z.infer<
  typeof EmergencyDetectionInputSchema
>;

const EmergencyDetectionOutputSchema = z.object({
  isEmergency: z
    .boolean()
    .describe('Whether the user input suggests an emergency situation.'),
  emergencyAdvice: z
    .string()
    .describe(
      'Advice to seek emergency medical care if an emergency is detected.'
    ),
});
export type EmergencyDetectionOutput = z.infer<
  typeof EmergencyDetectionOutputSchema
>;

export async function detectEmergency(
  input: EmergencyDetectionInput
): Promise<EmergencyDetectionOutput> {
  return detectEmergencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emergencyDetectionPrompt',
  input: {schema: EmergencyDetectionInputSchema},
  output: {schema: EmergencyDetectionOutputSchema},
  prompt: `You are a medical AI assistant. Your task is to analyze user input and determine if it indicates a potential emergency situation.

  If the user describes symptoms or a situation that suggests a life-threatening condition (e.g., chest pain, breathing difficulty, sudden weakness, heavy bleeding, loss of consciousness), you MUST set isEmergency to true and provide the emergencyAdvice to seek immediate medical care.

  If the user input does not suggest an emergency, set isEmergency to false and provide an empty string.

  Your response MUST be in the following language: {{{language}}}.

  User Input: {{{userInput}}}

  Output in JSON format:
  {
    "isEmergency": true/false,
    "emergencyAdvice": "Advise the user to seek immediate medical care if isEmergency is true."
  }`,
});

const detectEmergencyFlow = ai.defineFlow(
  {
    name: 'detectEmergencyFlow',
    inputSchema: EmergencyDetectionInputSchema,
    outputSchema: EmergencyDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      language: input.language || 'English',
    });
    return output!;
  }
);
