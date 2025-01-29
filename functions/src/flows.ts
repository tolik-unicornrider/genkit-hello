// Import the Genkit core libraries and plugins.
import {genkit, z} from "genkit";
import {googleAI, gemini15Pro, gemini15Flash, gemini20FlashExp} from "@genkit-ai/googleai";

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || "fake-api-key",
    }),
  ],
});

// Define the input schema for the restaurant theme
const RestaurantThemeSchema = z.object({
  theme: z.string(),
});

// Update the input schema for historical image analysis to accept base64 data
const HistoricalImageSchema = z.object({
  imageData: z.string(), // base64 encoded image data
  mimeType: z.string(), // e.g. 'image/jpeg'
});

export const menuSuggestionFlow = ai.defineFlow(
  {
    name: "menuSuggestionFlow",
    inputSchema: RestaurantThemeSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const {text} = await ai.generate({
      model: gemini15Flash,
      prompt: `Invent a menu item for a ${input.theme} themed restaurant.`,
    });
    return text;
  }
);

// Define schema for historical analysis output
const HistoricalAnalysisSchema = z.object({
  period: z.string(),
  historicalContext: z.string(),
  significantElements: z.array(z.string()),
  possibleDate: z.string(),
  culturalSignificance: z.string(),
});

export const analyzeHistoricalImageFlow = ai.defineFlow(
  {
    name: "analyzeHistoricalImageFlow",
    inputSchema: HistoricalImageSchema,
    outputSchema: HistoricalAnalysisSchema,
  },
  async (input) => {
    const dataUrl = `data:${input.mimeType};base64,${input.imageData}`;
    const {output} = await ai.generate({
      model: gemini20FlashExp,
      prompt: [
        {
          media: {url: dataUrl},
        },
        {
          text: `Analyze this image and provide its historical context. Consider:
          1. The historical period it appears to be from
          2. The broader historical context of the time
          3. Any significant elements or symbols visible
          4. Approximate date if possible
          5. Cultural significance of what's depicted`,
        },
      ],
      output: {
        schema: HistoricalAnalysisSchema,
      },
    });

    if (!output) {
      throw new Error("Failed to generate historical analysis");
    }

    return output;
  }
);

// Define schema for meme analysis output
const MemeAnalysisSchema = z.object({
  imageDescription: z.string().describe("Detailed description of what's visible in the image"),
  background: z.string().describe("Origin/context of the image - movie scene, historical figure, event, etc."),
  humorExplanation: z.string().describe("Analysis of why this meme is considered humorous"),
});

// Input schema with optional text
const MemeInputSchema = z.object({
  imageData: z.string(),
  mimeType: z.string(),
  text: z.string().optional().describe("Optional text that appears on the meme"),
});

export const analyzeMemeFlow = ai.defineFlow(
  {
    name: "analyzeMemeFlow",
    inputSchema: MemeInputSchema,
    outputSchema: MemeAnalysisSchema,
  },
  async (input) => {
    const dataUrl = `data:${input.mimeType};base64,${input.imageData}`;
    const {output} = await ai.generate({
      model: gemini15Pro,
      prompt: [
        {
          media: {url: dataUrl},
        },
        {
          text: `Analyze this meme image${input.text ? " and its text: \"" + input.text + "\"" : ""}. Please provide:

          1. A detailed description of what's visible in the image - expressions, actions, composition
          2. Background context - if it's from a movie/show, explain the scene; if it's a person, \
          explain who they are and what they're known for
          3. Explain why this image works as a meme and what makes it humorous - consider irony, \
          cultural references, common usage patterns

          If there's text on the image, explain how it interacts with the visual elements to create humor.`,
        },
      ],
      output: {
        schema: MemeAnalysisSchema,
      },
    });

    if (!output) {
      throw new Error("Failed to generate meme analysis");
    }

    return output;
  }
);
