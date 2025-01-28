/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Import the flow from genkit-sample.ts
import {menuSuggestionFlow, analyzeHistoricalImageFlow, analyzeMemeFlow} from "./flows";

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const generateMenu = onRequest(async (request, response) => {
  try {
    // Call the flow with a theme (using "italian" as an example)
    const result = await menuSuggestionFlow({theme: "italian"});
    response.send(result);
  } catch (error) {
    logger.error("Error generating menu", error);
    response.status(500).send("Error generating menu suggestion");
  }
});

export const analyzeHistoricalPhoto = onRequest(async (request, response) => {
  try {
    const {imageData, mimeType} = request.body;
    
    if (!imageData || !mimeType) {
      response.status(400).send("Image data and MIME type are required");
      return;
    }

    // Use the flow for structured analysis
    const result = await analyzeHistoricalImageFlow({imageData, mimeType});
    response.json(result);
  } catch (error) {
    logger.error("Error analyzing historical image", error);
    response.status(500).send("Error analyzing image");
  }
});

export const analyzeMeme = onRequest({timeoutSeconds: 300}, async (request, response) => {
  try {
    const {imageData, mimeType, text} = request.body;
    
    if (!imageData || !mimeType) {
      response.status(400).send("Image data and MIME type are required");
      return;
    }

    // Use the meme analysis flow
    const result = await analyzeMemeFlow({imageData, mimeType, text});
    response.json(result);
  } catch (error) {
    logger.error("Error analyzing meme", error);
    response.status(500).send("Error analyzing meme");
  }
});
