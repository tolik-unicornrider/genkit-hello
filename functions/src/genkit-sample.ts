// Import the Genkit core libraries and plugins.
import {genkit, z} from "genkit";
import {googleAI, gemini15Pro, gemini15Flash} from "@genkit-ai/googleai";

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
      model: gemini15Pro,
      prompt: [
        {
          media: { url: dataUrl }
        },
        {
          text: `Analyze this image and provide its historical context. Consider:
          1. The historical period it appears to be from
          2. The broader historical context of the time
          3. Any significant elements or symbols visible
          4. Approximate date if possible
          5. Cultural significance of what's depicted`
        }
      ],
      output: {
        schema: HistoricalAnalysisSchema
      }
    });

    if (!output) {
      throw new Error("Failed to generate historical analysis");
    }

    return output;
  }
);

// Helper function for direct image analysis without using flows
export async function analyzeHistoricalImage(imageData: string, mimeType: string) {
  const dataUrl = `data:${mimeType};base64,${imageData}`;
  const {text} = await ai.generate({
    model: gemini15Pro,
    prompt: [
      {
        media: { url: dataUrl }
      },
      {
        text: "Please describe the historical context and significance of this image in detail."
      }
    ]
  });
  
  return text;
}
