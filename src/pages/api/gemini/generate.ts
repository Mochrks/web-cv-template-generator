import type { NextApiRequest, NextApiResponse } from "next";
import { generateContent } from "@/lib/gemini/client";
import geminiCache from "@/lib/gemini/cache";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, useCache = true } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Check cache first
    if (useCache) {
      const cachedResponse = geminiCache.get(prompt);
      if (cachedResponse) {
        return res.status(200).json({
          content: cachedResponse,
          cached: true,
        });
      }
    }

    // Generate with Gemini
    const text = await generateContent(prompt);

    // Cache the response
    if (useCache) {
      geminiCache.set(prompt, text);
    }

    return res.status(200).json({
      content: text,
      cached: false,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Failed to generate content",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
