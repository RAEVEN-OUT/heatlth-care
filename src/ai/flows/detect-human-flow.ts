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
  humanDetected: z.boolean().describe('Whether a person was detected in the image'),
  confidence: z.number().optional().describe('Confidence level of detection (0-1)'),
  message: z.string().describe('Description of what was found'),
});
export type DetectHumanOutput = z.infer<typeof DetectHumanOutputSchema>;

export async function detectHuman(input: DetectHumanInput): Promise<DetectHumanOutput> {
  const result = await detectHumanFlow(input);
  
  // Sometimes the model returns a string that is not valid JSON.
  try {
    const parsed = JSON.parse(result as unknown as string);
    return DetectHumanOutputSchema.parse(parsed);
  } catch (e) {
    // If parsing fails, try to infer from the text content.
    const text = (result as unknown as string).toLowerCase();
    const humanDetected = text.includes('person') || text.includes('human');
    return {
        humanDetected,
        confidence: humanDetected ? 0.7 : 0.3,
        message: result.message || 'Could not reliably determine if a person was present from the response.'
    };
  }
}

const prompt = ai.definePrompt({
  name: 'detectHumanPrompt',
  input: {schema: DetectHumanInputSchema},
  output: { format: 'json', schema: DetectHumanOutputSchema},
  prompt: `Analyze this image and determine if a human person is visible in it. 
          Respond with a JSON object containing:
          - personDetected (boolean): true if a person is clearly visible, false otherwise
          - confidence (number): your confidence level from 0 to 1
          - message (string): a brief description of what you see
          
          Be strict - only return true if you can clearly see a human person.

Image: {{media url=mediaDataUri}}`,
});

const detectHumanFlow = ai.defineFlow(
  {
    name: 'detectHumanFlow',
    inputSchema: DetectHumanInputSchema,
    outputSchema: DetectHumanOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output();
    
    if (output) {
      return output;
    }
    
    // Fallback if the model doesn't return structured JSON
    const text = llmResponse.text();
    const humanDetected = text.toLowerCase().includes('person') || text.toLowerCase().includes('human');
    return {
      humanDetected,
      confidence: humanDetected ? 0.6 : 0.4,
      message: text || "AI analysis completed."
    };
  }
);
