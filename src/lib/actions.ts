'use server';

import { generateMedicalReportSummary } from '@/ai/flows/generate-medical-report-summary';
import { aiSymptomChecker } from '@/ai/ai-symptom-checker';
import { detectHuman } from '@/ai/flows/detect-human-flow';

export type ReportFormState = {
  summary: string | null;
  error: string | null;
};

export async function handleGenerateReport(
  prevState: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const mediaDataUri = formData.get('mediaDataUri') as string;

  if (!mediaDataUri) {
    return { summary: null, error: 'No image provided. Please upload an image.' };
  }

  try {
    const result = await generateMedicalReportSummary({ mediaDataUri });
    if (result.summary) {
      return { summary: result.summary, error: null };
    } else {
      return { summary: null, error: 'Failed to generate summary. The AI could not process the request.' };
    }
  } catch (e) {
    console.error(e);
    return { summary: null, error: 'An unexpected error occurred. Please try again later.' };
  }
}

export type SymptomCheckerFormState = {
    possibleConditions: string | null;
    error: string | null;
};

export async function handleSymptomCheck(
    prevState: SymptomCheckerFormState,
    formData: FormData
): Promise<SymptomCheckerFormState> {
    const symptoms = formData.get('symptoms') as string;

    if (!symptoms) {
        return { possibleConditions: null, error: 'Please describe your symptoms.' };
    }

    try {
        const result = await aiSymptomChecker({ symptoms });
        if (result.possibleConditions) {
            return { possibleConditions: result.possibleConditions, error: null };
        } else {
            return { possibleConditions: null, error: 'Failed to get insights. The AI could not process the request.' };
        }
    } catch (e) {
        console.error(e);
        return { possibleConditions: null, error: 'An unexpected error occurred. Please try again later.' };
    }
}

export type DetectHumanFormState = {
    humanDetected: boolean | null;
    error: string | null;
};

export async function handleDetectHuman(
    prevState: DetectHumanFormState,
    formData: FormData
): Promise<DetectHumanFormState> {
    const mediaDataUri = formData.get('mediaDataUri') as string;
    
    if (!mediaDataUri) {
        return { humanDetected: null, error: 'No image provided.' };
    }

    try {
        const result = await detectHuman({ mediaDataUri });
        return { humanDetected: result.isHuman, error: null };
    } catch (e) {
        console.error(e);
        return { humanDetected: null, error: 'An unexpected error occurred while detecting human.' };
    }
}
