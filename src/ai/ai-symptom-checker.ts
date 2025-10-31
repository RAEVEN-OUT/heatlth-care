// src/ai/ai-symptom-checker.ts
'use server';

/**
 * @fileOverview An AI-powered symptom checker that suggests possible conditions based on user-provided symptoms.
 *
 * - aiSymptomChecker - A function that takes a user's symptoms as input and returns a list of possible conditions.
 * - AISymptomCheckerInput - The input type for the aiSymptomChecker function.
 * - AISymptomCheckerOutput - The return type for the aiSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the symptoms the user is experiencing.'),
});
export type AISymptomCheckerInput = z.infer<typeof AISymptomCheckerInputSchema>;

const AISymptomCheckerOutputSchema = z.object({
  possibleConditions: z
    .string()
    .describe('A list of possible medical conditions based on the symptoms provided.'),
});
export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI-powered medical chatbot designed to help users understand possible medical conditions based on their symptoms.

  Given the following symptoms:
  {{symptoms}}

  Please provide a list of possible conditions that could be causing these symptoms.  This information is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider for any questions you may have regarding a medical condition.
  `,
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AISymptomCheckerInputSchema,
    outputSchema: AISymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
