import type { NextApiRequest, NextApiResponse } from "next";
import { calculateATSScore } from "@/lib/ats/scorer";
import { ResumeData } from "@/types/resume";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { resumeData, jobDescription } = req.body as {
      resumeData: ResumeData;
      jobDescription?: string;
    };

    if (!resumeData) {
      return res.status(400).json({ error: "Resume data is required" });
    }

    const atsScore = calculateATSScore(resumeData, jobDescription);

    return res.status(200).json(atsScore);
  } catch (error) {
    console.error("ATS scoring error:", error);
    return res.status(500).json({
      error: "Failed to calculate ATS score",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
