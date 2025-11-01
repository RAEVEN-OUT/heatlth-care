'use server';

/**
 * @fileOverview An AI flow to detect if a human is present in an image.
 *
 * - detectHuman - A function that analyzes an image to determine if it contains a human.
 * - DetectHumanInput - The input type for the detectHuman function.
 * - DetectHumanOutput - The return type for the detectHuman function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectHumanInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "An image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectHumanInput = z.infer<typeof DetectHumanInputSchema>;

const DetectHumanOutputSchema = z.object({
  isHuman: z.boolean().describe('Whether or not a human is detected in the image.'),
});
export type DetectHumanOutput = z.infer<typeof DetectHumanOutputSchema>;

export async function detectHuman(input: DetectHumanInput): Promise<DetectHumanOutput> {
  return detectHumanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectHumanPrompt',
  input: {schema: DetectHumanInputSchema},
  output: {schema: DetectHumanOutputSchema},
  prompt: `Analyze the following image and determine if there is a human present. A human can be a full body, a face, or even just a part of a person.

Image: {{media url=mediaDataUri}}`,
});

const detectHumanFlow = ai.defineFlow(
  {
    name: 'detectHumanFlow',
    inputSchema: DetectHumanInputSchema,
    outputSchema: DetectHumanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
