'use server';

import { generateMedicalReportSummary } from '@/ai/flows/generate-medical-report-summary';

export type FormState = {
  summary: string | null;
  error: string | null;
};

export async function handleGenerateReport(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
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
