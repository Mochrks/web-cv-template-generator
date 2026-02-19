import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CV_STRUCTURE_INSTRUCTIONS_ONE } from "@/utils/cvStructure";
import { CV_STRUCTURE_INSTRUCTIONS_TWO } from "@/utils/cvStructureTwo";
import { AUTH_HEADER, OPENAI_API_URL } from "@/utils/axiosConfig";

// Vercel Serverless Function configuration
export const maxDuration = 60; // Increase to 60 seconds

interface ResponseData {
  choices: {
    message: {
      content: string;
    };
  }[];
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, template } = req.body;
    const instructions =
      template === "template2" ? CV_STRUCTURE_INSTRUCTIONS_TWO : CV_STRUCTURE_INSTRUCTIONS_ONE;

    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: instructions,
          },
          {
            role: "user",
            content: `Convert the following CV/Resume text into JSON:\n\n${text}`,
          },
        ],
        temperature: 0.7,
        // max_tokens: 1000
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...AUTH_HEADER,
        },
      }
    );

    return res
      .status(200)
      .json(JSON.parse((response.data as ResponseData).choices[0].message.content));
  } catch (error) {
    console.error("Error generating JSON:", error);
    return res.status(500).json({ error: "Failed to generate JSON" });
  }
}
