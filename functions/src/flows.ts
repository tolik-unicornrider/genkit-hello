// Import the Genkit core libraries and plugins.
import {genkit, z} from "genkit";
import {googleAI} from "@genkit-ai/googleai";
import {enableFirebaseTelemetry} from "@genkit-ai/firebase";

enableFirebaseTelemetry();

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || "fake-api-key",
    }),
  ],
});

// Updated Schema for AI generation output
// including optional text translations.
export const MemeAnalysisSchema = z.object({
  imageDescription: z.string().optional().describe("Detailed description of what's visible in the image"),
  background: z.string().optional().describe("Origin/context of the image"),
  humorExplanation: z.string().optional().describe("Analysis of why this meme is considered humorous"),
  textTranslations: z.object({
    english: z.string().optional(), // if needed
    russian: z.string().optional(), // if needed
  }).optional(),
});

// Simplified schema for flow output (just background, humor, and translations if present)
export const MemeExplanationSchema = z.object({
  background: z.string().optional().describe("Origin and context of the meme"),
  explanation: z.string().optional().describe("Why it's funny"),
  translations: z.object({
    english: z.string().optional(),
    russian: z.string().optional(),
  }).optional(),
});

// Input schema with optional text
const MemeInputSchema = z.object({
  imageData: z.string(),
  text: z.string().optional().describe("Optional text that appears on the meme"),
});

// Define the prompt outside of the flow
const memePrompt = ai.prompt("memplain");

export const analyzeMemeFlow = ai.defineFlow(
  {
    name: "analyzeMemeFlow",
    inputSchema: MemeInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const dataUrl = `data:image/jpeg;base64,${input.imageData}`;

    // Call your prompt
    const {text} = await memePrompt({
      imageUrl: dataUrl,
      text: input.text,
    });

    // Handle the case where the prompt might return null or undefined
    if (!text) {
      throw new Error("No response returned from the AI prompt.");
    }

    return text;
  }
);
