'use server';

/**
 * @fileOverview Generates a medical report summary from medical images/videos.
 *
 * - generateMedicalReportSummary - A function that generates the medical report summary.
 * - GenerateMedicalReportSummaryInput - The input type for the generateMedicalReportSummary function.
 * - GenerateMedicalReportSummaryOutput - The return type for the generateMedicalReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMedicalReportSummaryInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A medical image or video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateMedicalReportSummaryInput = z.infer<typeof GenerateMedicalReportSummaryInputSchema>;

const GenerateMedicalReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the findings from the medical image or video.'),
});
export type GenerateMedicalReportSummaryOutput = z.infer<typeof GenerateMedicalReportSummaryOutputSchema>;

export async function generateMedicalReportSummary(
  input: GenerateMedicalReportSummaryInput
): Promise<GenerateMedicalReportSummaryOutput> {
  return generateMedicalReportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMedicalReportSummaryPrompt',
  input: {schema: GenerateMedicalReportSummaryInputSchema},
  output: {schema: GenerateMedicalReportSummaryOutputSchema},
  prompt: `You are an expert medical professional specializing in summarizing medical findings from images and videos.

You will analyze the provided medical image or video and generate a concise summary of the key findings.

Use the following as the primary source of information about the medical media.

Media: {{media url=mediaDataUri}}`,
});

const generateMedicalReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateMedicalReportSummaryFlow',
    inputSchema: GenerateMedicalReportSummaryInputSchema,
    outputSchema: GenerateMedicalReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
