/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Import the flow from genkit-sample.ts
import {menuSuggestionFlow} from "./genkit-sample";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

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
