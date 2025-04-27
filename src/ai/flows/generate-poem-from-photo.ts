'use server';

/**
 * @fileOverview Generates a poem based on the content of an uploaded photo.
 *
 * - generatePoemFromPhoto - A function that handles the poem generation process.
 * - GeneratePoemFromPhotoInput - The input type for the generatePoemFromPhoto function.
 * - GeneratePoemFromPhotoOutput - The return type for the generatePoemFromPhoto function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePoemFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePoemFromPhotoInput = z.infer<typeof GeneratePoemFromPhotoInputSchema>;

const GeneratePoemFromPhotoOutputSchema = z.object({
  poem: z.string().describe('A poem generated based on the content of the photo.'),
});
export type GeneratePoemFromPhotoOutput = z.infer<typeof GeneratePoemFromPhotoOutputSchema>;

export async function generatePoemFromPhoto(input: GeneratePoemFromPhotoInput): Promise<GeneratePoemFromPhotoOutput> {
  return generatePoemFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemFromPhotoPrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      poem: z.string().describe('A poem generated based on the content of the photo.'),
    }),
  },
  prompt: `You are a poet laureate, skilled at creating evocative poems based on visual input.

  Create a poem that captures the essence and details of the image.

  Photo: {{media url=photoDataUri}}
  `,
});

const generatePoemFromPhotoFlow = ai.defineFlow<
  typeof GeneratePoemFromPhotoInputSchema,
  typeof GeneratePoemFromPhotoOutputSchema
>(
  {
    name: 'generatePoemFromPhotoFlow',
    inputSchema: GeneratePoemFromPhotoInputSchema,
    outputSchema: GeneratePoemFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
