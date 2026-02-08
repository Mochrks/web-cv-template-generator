import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

let client: GoogleGenAI | null = null;
if (API_KEY) {
  client = new GoogleGenAI({ apiKey: API_KEY });
}

/**
 * Send message to Gemini AI using the new SDK
 */
export async function sendMessageToGemini(
  history: {
    role: "user" | "model";
    parts: { text: string; inlineData?: Record<string, unknown> }[];
  }[],
  message: string,
  imagePart?: { inlineData: { data: string; mimeType: string } },
  modelName: string = "Gemini 2.5 Flash"
) {
  if (!API_KEY || !client) {
    console.warn("No Gemini API Key found. Using Mock Mode.");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return (
      "Sorry, I'm having trouble connecting to the AI right now. Please try again later. " + message
    );
  }

  try {
    const currentMessageParts: (Record<string, unknown> | { text: string })[] = [{ text: message }];
    if (imagePart) {
      currentMessageParts.push(imagePart);
    }

    const contents = [
      ...history.map((msg) => ({
        role: msg.role,
        parts: msg.parts,
      })),
      {
        role: "user",
        parts: currentMessageParts,
      },
    ];

    let modelId = modelName.toLowerCase().replace(/\s+/g, "-");

    if (modelId.includes("gemma") && !modelId.includes("-it")) {
      modelId += "-it";
    }

    const response = await client.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
}

/**
 * Generate content with Gemini - Simplified version for single prompt
 */
export async function generateContent(
  prompt: string,
  modelName: string = "Gemini 2.5 Flash"
): Promise<string> {
  if (!API_KEY || !client) {
    console.warn("No Gemini API Key found.");
    return "";
  }

  try {
    let modelId = modelName.toLowerCase().replace(/\s+/g, "-");

    if (modelId.includes("gemma") && !modelId.includes("-it")) {
      modelId += "-it";
    }

    const response = await client.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

/**
 * Available models as requested by user
 */
export const GEMINI_MODELS = [
  "Gemini 2.5 Flash",
  "Gemini 2.5 Flash Lite",
  "Gemini 2.5 Flash TTS",
  "Gemini 3 Flash",
  "Gemini Robotics ER 1.5 Preview",
  "Gemma 3 12B",
  "Gemma 3 1B",
  "Gemma 3 27B",
  "Gemma 3 2B",
  "Gemma 3 4B",
  "Gemini Embedding 1",
  "Gemini 2.5 Flash Native Audio Dialog",
];

/**
 * Roles for CV structure (from user's request)
 */
export const ROLES = [
  "Fullstack",
  "Front End",
  "Back End",
  "System Analyst",
  "Project Manager",
  "DevOps",
  "Quality Assurance",
];

/**
 * Helper to convert file to generative part (inlineData)
 */
export async function fileToGenerativePart(
  file: File
): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(",")[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default client;
