// Import the Genkit core libraries and plugins.
import {genkit, z} from "genkit";
import {googleAI, gemini15Flash} from "@genkit-ai/googleai";


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
