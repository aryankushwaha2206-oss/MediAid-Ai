'use server';

import {
  analyzeXRayImage,
  AnalyzeXRayImageInput,
} from '@/ai/flows/x-ray-image-analysis';
import {
  detectEmergency,
  EmergencyDetectionInput,
} from '@/ai/flows/emergency-detection';
import {
  interpretMedicalReport,
  MedicalReportInput,
} from '@/ai/flows/medical-report-interpretation';
import { medicalAIChat, MedicalAIChatInput } from '@/ai/flows/medical-ai-chat';
import {
  symptomBasedGuidance,
  SymptomBasedGuidanceInput,
} from '@/ai/flows/symptom-based-guidance';
import { z } from 'zod';

const xRaySchema = z.object({
  photoDataUri: z.string().startsWith('data:image/'),
  language: z.string().optional(),
});

export async function analyzeXRayImageAction(input: AnalyzeXRayImageInput) {
  const parsed = xRaySchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid image format.' };
  }
  return await analyzeXRayImage(parsed.data);
}

const emergencySchema = z.object({
  userInput: z.string().min(1),
  language: z.string().optional(),
});
export async function detectEmergencyAction(input: EmergencyDetectionInput) {
  const parsed = emergencySchema.safeParse(input);
  if (!parsed.success) {
    return { isEmergency: false, emergencyAdvice: '' };
  }
  return await detectEmergency(parsed.data);
}

const reportSchema = z.object({
  reportText: z.string().min(10, 'Report text is too short.'),
  language: z.string().optional(),
});

export async function interpretMedicalReportAction(
  input: MedicalReportInput
) {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.reportText?.[0] };
  }
  return await interpretMedicalReport(parsed.data);
}

const chatSchema = z.object({
  question: z.string().min(1),
  photoDataUri: z.string().optional(),
  language: z.string().optional(),
});
export async function medicalAIChatAction(input: MedicalAIChatInput) {
  const parsed = chatSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid input.' };
  }
  return await medicalAIChat(parsed.data);
}

const symptomSchema = z.object({
  symptoms: z.string().min(5, 'Please describe your symptoms in more detail.'),
  photoDataUri: z.string().optional(),
  age: z.coerce.number().optional(),
  gender: z.string().optional(),
  duration: z.string().optional(),
  severity: z.string().optional(),
  language: z.string().optional(),
});
export async function symptomBasedGuidanceAction(
  input: SymptomBasedGuidanceInput
) {
  const parsed = symptomSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.symptoms?.[0] };
  }
  return await symptomBasedGuidance(parsed.data);
}
