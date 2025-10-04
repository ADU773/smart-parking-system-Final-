'use server';
/**
 * @fileOverview Predicts future parking spot availability based on historical data and current trends.
 *
 * - predictFutureSpotAvailability - A function that predicts future parking spot availability.
 * - PredictFutureSpotAvailabilityInput - The input type for the predictFutureSpotAvailability function.
 * - PredictFutureSpotAvailabilityOutput - The return type for the predictFutureSpotAvailability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureSpotAvailabilityInputSchema = z.object({
  historicalData: z.string().describe('Historical data of parking spot occupancy.'),
  currentTrends: z.string().describe('Current trends affecting parking spot occupancy.'),
  timeframe: z.string().describe('The timeframe for which to predict availability (e.g., next hour, next 30 minutes).'),
});
export type PredictFutureSpotAvailabilityInput = z.infer<typeof PredictFutureSpotAvailabilityInputSchema>;

const PredictFutureSpotAvailabilityOutputSchema = z.object({
  predictedAvailability: z.string().describe('Predicted parking spot availability for the given timeframe.'),
});
export type PredictFutureSpotAvailabilityOutput = z.infer<typeof PredictFutureSpotAvailabilityOutputSchema>;

export async function predictFutureSpotAvailability(input: PredictFutureSpotAvailabilityInput): Promise<PredictFutureSpotAvailabilityOutput> {
  return predictFutureSpotAvailabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFutureSpotAvailabilityPrompt',
  input: {schema: PredictFutureSpotAvailabilityInputSchema},
  output: {schema: PredictFutureSpotAvailabilityOutputSchema},
  prompt: `You are an expert in predicting parking spot availability based on historical data and current trends.

  Analyze the following information to predict parking spot availability for the specified timeframe:

  Historical Data: {{{historicalData}}}
Current Trends: {{{currentTrends}}}
Timeframe: {{{timeframe}}}

Provide a prediction of parking spot availability, considering both historical patterns and current influencing factors.
  `,
});

const predictFutureSpotAvailabilityFlow = ai.defineFlow(
  {
    name: 'predictFutureSpotAvailabilityFlow',
    inputSchema: PredictFutureSpotAvailabilityInputSchema,
    outputSchema: PredictFutureSpotAvailabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
