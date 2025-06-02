'use server';

/**
 * @fileOverview Recommends dishes based on past order history.
 *
 * - recommendDishes - A function that recommends dishes based on past order history.
 * - RecommendDishesInput - The input type for the recommendDishes function.
 * - RecommendDishesOutput - The return type for the recommendDishes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendDishesInputSchema = z.object({
  orderHistory: z
    .string()
    .describe('The past order history of the user as a JSON string.'),
});

export type RecommendDishesInput = z.infer<typeof RecommendDishesInputSchema>;

const RecommendDishesOutputSchema = z.object({
  recommendedDishes: z
    .string()
    .describe('A list of recommended dish names as a JSON string.'),
});

export type RecommendDishesOutput = z.infer<typeof RecommendDishesOutputSchema>;

export async function recommendDishes(input: RecommendDishesInput): Promise<RecommendDishesOutput> {
  return recommendDishesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendDishesPrompt',
  input: {schema: RecommendDishesInputSchema},
  output: {schema: RecommendDishesOutputSchema},
  prompt: `You are a food recommendation expert. Given the following order history, recommend dishes that the user might enjoy. Only suggest meals where you are at least 80% sure they match, and respond with a JSON array of strings.

Order History:
{{{orderHistory}}}`,
});

const recommendDishesFlow = ai.defineFlow(
  {
    name: 'recommendDishesFlow',
    inputSchema: RecommendDishesInputSchema,
    outputSchema: RecommendDishesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
