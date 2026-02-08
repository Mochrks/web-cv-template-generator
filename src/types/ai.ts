// AI and Gemini Types

export type GeneratorType = "cv" | "ats-resume" | "cover-letter";

export type ExperienceLevel = "junior" | "mid" | "senior" | "executive";

export type Language = "en" | "id";

export interface AIContext {
  documentType: GeneratorType;
  jobTitle?: string;
  industry?: string;
  experienceLevel?: ExperienceLevel;
  language: Language;
  templateId: string;
  jobDescription?: string;
}

export interface AIPromptRequest {
  context: AIContext;
  userData?: Record<string, unknown>;
  section?: string;
  instruction: string;
}

export interface AIGenerationResult {
  content: string;
  suggestions?: string[];
  keywords?: string[];
  atsScore?: number;
}

export interface ATSScore {
  overall: number;
  breakdown: {
    keywordMatch: number;
    formatting: number;
    length: number;
    readability: number;
  };
  suggestions: string[];
  missingKeywords: string[];
  improvements: string[];
}

export interface SmartSuggestion {
  id: string;
  type: "warning" | "info" | "success" | "error";
  section?: string;
  message: string;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface GeminiCacheEntry {
  key: string;
  response: string;
  timestamp: number;
  expiresAt: number;
}
