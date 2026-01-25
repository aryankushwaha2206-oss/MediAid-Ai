import { config } from 'dotenv';
config();

import '@/ai/flows/medical-ai-chat.ts';
import '@/ai/flows/medical-report-interpretation.ts';
import '@/ai/flows/emergency-detection.ts';
import '@/ai/flows/symptom-based-guidance.ts';
import '@/ai/flows/x-ray-image-analysis.ts';