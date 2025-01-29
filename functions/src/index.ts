/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 */

import {Telegraf, Context, Telegram} from "telegraf";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import {analyzeMemeFlow} from "./flows";

// Initialize bot with your token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Basic commands
bot.command("start", (ctx) => ctx.reply("Welcome! Send me any message and I will echo it back."));
bot.command("help", (ctx) => ctx.reply("Send me any message and I will echo it back."));

const getImageFromMessage = (ctx: Context) => {
  const msg = ctx.message;
  if (!msg) return null;

  if ("photo" in msg && msg.photo && msg.photo.length > 0) {
    return msg.photo[msg.photo.length - 1];
  }
  return null;
};

async function getFileBuffer(telegram: Telegram, fileId: string): Promise<Buffer> {
  /**
   * Gets a file buffer from Telegram's servers using a file ID
   * @param telegram - Telegram instance used to make API calls
   * @param fileId - ID of the file to retrieve from Telegram
   * @returns Promise that resolves to a Buffer containing the file data
   * @throws Error if the file path cannot be retrieved
   */
  const file = await telegram.getFile(fileId);
  const filePath = file.file_path;
  if (!filePath) throw new Error("Could not get file path");

  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

bot.on("message", async (ctx) => {
  await ctx.reply("Starting analysis...");
  const messageText = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  const image = getImageFromMessage(ctx);
  if (image) {
    // Get image file
    const imageBuffer = await getFileBuffer(ctx.telegram, image.file_id);
    // Get image analysis
    const result = await analyzeMemeFlow({imageData: imageBuffer.toString("base64"),
      mimeType: "image/jpeg", text: messageText});

    // Send the analysis
    await ctx.reply(JSON.stringify(result));
    return;
  }
});


export const telegramWebhook = onRequest(async (request, response) => {
  try {
    console.log(request.body);
    await bot.handleUpdate(request.body, response);
  } catch (error) {
    logger.error("Error in telegram webhook:", error);
    response.status(500).send("Error in webhook handler");
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
