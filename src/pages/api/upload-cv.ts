import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ExtractedData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    summary?: string;
  };
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    responsibilities: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    skills: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    highlights: string[];
  }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from file
    let extractedText = "";
    const filePath = file.filepath;
    const fileBuffer = fs.readFileSync(filePath);

    if (file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from file" });
    }

    // Use Gemini to parse and structure the CV data
    const prompt = `You are a professional CV parser. Extract and structure the following CV/Resume text into JSON format.

CV Text:
${extractedText}

Please extract and return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):
{
  "personalInfo": {
    "fullName": "extracted name",
    "email": "extracted email",
    "phone": "extracted phone",
    "location": "extracted location",
    "linkedin": "extracted linkedin url if available",
    "portfolio": "extracted portfolio url if available",
    "summary": "extracted professional summary or objective"
  },
  "experiences": [
    {
      "id": "unique-id",
      "company": "company name",
      "position": "job title",
      "location": "location",
      "startDate": "start date",
      "endDate": "end date or Present",
      "current": false,
      "responsibilities": ["responsibility 1", "responsibility 2"]
    }
  ],
  "education": [
    {
      "id": "unique-id",
      "institution": "school name",
      "degree": "degree type",
      "field": "field of study",
      "location": "location",
      "startDate": "start year",
      "endDate": "end year",
      "gpa": "gpa if available"
    }
  ],
  "skills": [
    {
      "id": "unique-id",
      "category": "skill category",
      "skills": ["skill1", "skill2", "skill3"]
    }
  ],
  "projects": [
    {
      "id": "unique-id",
      "name": "project name",
      "description": "project description",
      "technologies": ["tech1", "tech2"],
      "highlights": ["highlight1", "highlight2"]
    }
  ]
}

Important:
- Return ONLY the JSON object, no additional text
- Use "Present" for current positions
- Generate unique IDs for each item
- If information is not available, use empty string or empty array
- Ensure all arrays are properly formatted`;

    const { generateContent } = await import("@/lib/gemini/client");
    const responseText = await generateContent(prompt, "Gemini 2.5 Flash");

    // Remove markdown code blocks if present
    let jsonText = responseText.trim();
    jsonText = jsonText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse the JSON
    const extractedData: ExtractedData = JSON.parse(jsonText);

    return res.status(200).json({
      success: true,
      data: extractedData,
      rawText: extractedText.substring(0, 500), // First 500 chars for debugging
    });
  } catch (error) {
    console.error("Upload/Parse error:", error);
    return res.status(500).json({
      error: "Failed to process CV",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
