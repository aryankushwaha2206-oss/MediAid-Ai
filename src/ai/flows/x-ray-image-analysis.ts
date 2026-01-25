// X-Ray Image Analysis Flow
'use server';

/**
 * @fileOverview Analyzes X-ray images to identify potential abnormalities and provide understandable explanations.
 *
 * - analyzeXRayImage - A function that handles the X-ray image analysis process.
 * - AnalyzeXRayImageInput - The input type for the analyzeXRayImage function.
 * - AnalyzeXRayImageOutput - The return type for the analyzeXRayImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeXRayImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An X-ray image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z
    .string()
    .optional()
    .describe(
      'The language for the response (e.g., "English", "Spanish"). Defaults to English.'
    ),
});
export type AnalyzeXRayImageInput = z.infer<typeof AnalyzeXRayImageInputSchema>;

const AnalyzeXRayImageOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A simplified explanation of the X-ray image.'),
  concernLevel: z
    .enum(['low', 'moderate', 'high'])
    .describe('The level of concern associated with the findings.'),
  disclaimer: z
    .string()
    .describe('Mandatory disclaimer regarding the AI analysis.'),
});
export type AnalyzeXRayImageOutput = z.infer<
  typeof AnalyzeXRayImageOutputSchema
>;

export async function analyzeXRayImage(
  input: AnalyzeXRayImageInput
): Promise<AnalyzeXRayImageOutput> {
  return analyzeXRayImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeXRayImagePrompt',
  input: {schema: AnalyzeXRayImageInputSchema},
  output: {schema: AnalyzeXRayImageOutputSchema},
  prompt: `You are MediaID AI, a safety-focused medical AI assistant designed to help users understand X-ray images. Analyze the X-ray image and provide a simplified explanation of any visible structures, potential abnormalities, and a concern level (low, moderate, high). Always include the disclaimer.

  Your response MUST be in the following language: {{{language}}}.

X-Ray Image: {{media url=photoDataUri}}

Disclaimer: MediaID AI provides educational and informational health insights only. This is not a professional medical diagnosis and must not be used as a substitute for consultation, diagnosis, or treatment by a licensed doctor or qualified healthcare provider.`,
});

const analyzeXRayImageFlow = ai.defineFlow(
  {
    name: 'analyzeXRayImageFlow',
    inputSchema: AnalyzeXRayImageInputSchema,
    outputSchema: AnalyzeXRayImageOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      language: input.language || 'English',
    });
    return {
      ...output!,
      disclaimer:
        'MediaID AI provides educational and informational health insights only. This is not a professional medical diagnosis and must not be used as a substitute for consultation, diagnosis, or treatment by a licensed doctor or qualified healthcare provider.',
    };
  }
);
