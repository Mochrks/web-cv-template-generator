import { ATSScore } from "@/types/ai";
import { ResumeData } from "@/types/resume";

/**
 * ATS Scoring Engine
 * Analyzes resume for ATS compatibility and provides actionable feedback
 */

/**
 * Calculate overall ATS score for a resume
 */
export function calculateATSScore(resumeData: ResumeData, jobDescription?: string): ATSScore {
  const keywordScore = calculateKeywordMatch(resumeData, jobDescription);
  const formattingScore = calculateFormattingScore(resumeData);
  const lengthScore = calculateLengthScore(resumeData);
  const readabilityScore = calculateReadabilityScore(resumeData);

  const overall = Math.round((keywordScore + formattingScore + lengthScore + readabilityScore) / 4);

  const suggestions = generateSuggestions(
    resumeData,
    keywordScore,
    formattingScore,
    lengthScore,
    readabilityScore,
    jobDescription
  );

  const missingKeywords = jobDescription ? extractMissingKeywords(resumeData, jobDescription) : [];

  const improvements = generateImprovements(
    keywordScore,
    formattingScore,
    lengthScore,
    readabilityScore
  );

  return {
    overall,
    breakdown: {
      keywordMatch: keywordScore,
      formatting: formattingScore,
      length: lengthScore,
      readability: readabilityScore,
    },
    suggestions,
    missingKeywords,
    improvements,
  };
}

/**
 * Calculate keyword match score
 */
function calculateKeywordMatch(resumeData: ResumeData, jobDescription?: string): number {
  if (!jobDescription) {
    return 75; // Default score when no job description provided
  }

  const resumeText = extractResumeText(resumeData).toLowerCase();
  const keywords = extractKeywords(jobDescription);

  const matchedKeywords = keywords.filter((keyword) => resumeText.includes(keyword.toLowerCase()));

  const matchRate = keywords.length > 0 ? (matchedKeywords.length / keywords.length) * 100 : 75;

  return Math.min(100, Math.round(matchRate));
}

/**
 * Calculate formatting score (ATS-friendly structure)
 */
function calculateFormattingScore(resumeData: ResumeData): number {
  let score = 100;

  // Check for essential sections
  if (!resumeData.personalInfo.fullName) score -= 10;
  if (!resumeData.personalInfo.email) score -= 10;
  if (!resumeData.personalInfo.phone) score -= 5;
  if (resumeData.experiences.length === 0) score -= 20;
  if (resumeData.education.length === 0) score -= 15;
  if (resumeData.skills.length === 0) score -= 15;

  // Check for proper date formatting
  const hasInvalidDates = resumeData.experiences.some((exp) => !exp.startDate || !exp.endDate);
  if (hasInvalidDates) score -= 10;

  return Math.max(0, score);
}

/**
 * Calculate length score (optimal resume length)
 */
function calculateLengthScore(resumeData: ResumeData): number {
  const totalContent = extractResumeText(resumeData);
  const wordCount = totalContent.split(/\s+/).length;

  // Optimal range: 400-800 words (1-2 pages)
  if (wordCount >= 400 && wordCount <= 800) {
    return 100;
  } else if (wordCount < 400) {
    // Too short
    return Math.max(50, Math.round((wordCount / 400) * 100));
  } else {
    // Too long
    const excess = wordCount - 800;
    const penalty = Math.min(50, Math.round((excess / 400) * 50));
    return Math.max(50, 100 - penalty);
  }
}

/**
 * Calculate readability score
 */
function calculateReadabilityScore(resumeData: ResumeData): number {
  let score = 100;

  // Check bullet points in experiences
  resumeData.experiences.forEach((exp) => {
    exp.responsibilities.forEach((resp) => {
      // Bullet points should be concise (< 150 characters)
      if (resp.length > 150) score -= 2;

      // Should start with action verb
      if (!startsWithActionVerb(resp)) score -= 1;
    });
  });

  // Check for overly long summary
  if (resumeData.personalInfo.summary && resumeData.personalInfo.summary.length > 500) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Extract all text from resume
 */
function extractResumeText(resumeData: ResumeData): string {
  const parts: string[] = [];

  // Personal info
  parts.push(resumeData.personalInfo.fullName || "");
  parts.push(resumeData.personalInfo.summary || "");

  // Experiences
  resumeData.experiences.forEach((exp) => {
    parts.push(exp.company, exp.position);
    parts.push(...exp.responsibilities);
  });

  // Education
  resumeData.education.forEach((edu) => {
    parts.push(edu.institution, edu.degree, edu.field);
  });

  // Skills
  resumeData.skills.forEach((skillGroup) => {
    parts.push(...skillGroup.skills);
  });

  // Projects
  resumeData.projects.forEach((project) => {
    parts.push(project.name, project.description);
    parts.push(...project.highlights);
  });

  return parts.join(" ");
}

/**
 * Extract keywords from job description
 */
function extractKeywords(jobDescription: string): string[] {
  // Simple keyword extraction (can be enhanced with NLP)
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "we",
    "you",
    "they",
    "them",
    "their",
  ]);

  const words = jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word));

  // Count frequency and return top keywords
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);
}

/**
 * Extract missing keywords
 */
function extractMissingKeywords(resumeData: ResumeData, jobDescription: string): string[] {
  const resumeText = extractResumeText(resumeData).toLowerCase();
  const keywords = extractKeywords(jobDescription);

  return keywords.filter((keyword) => !resumeText.includes(keyword.toLowerCase()));
}

/**
 * Check if text starts with action verb
 */
function startsWithActionVerb(text: string): boolean {
  const actionVerbs = [
    "achieved",
    "administered",
    "analyzed",
    "built",
    "collaborated",
    "created",
    "delivered",
    "designed",
    "developed",
    "directed",
    "established",
    "executed",
    "generated",
    "implemented",
    "improved",
    "increased",
    "launched",
    "led",
    "managed",
    "optimized",
    "organized",
    "planned",
    "produced",
    "reduced",
    "resolved",
    "streamlined",
    "supervised",
    "trained",
    "transformed",
  ];

  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase() || "";
  return actionVerbs.some((verb) => firstWord.startsWith(verb));
}

/**
 * Generate suggestions based on scores
 */
function generateSuggestions(
  resumeData: ResumeData,
  keywordScore: number,
  formattingScore: number,
  lengthScore: number,
  readabilityScore: number,
  jobDescription?: string
): string[] {
  const suggestions: string[] = [];

  if (keywordScore < 70 && jobDescription) {
    suggestions.push("Add more keywords from the job description to improve ATS matching.");
  }

  if (formattingScore < 80) {
    suggestions.push(
      "Ensure all essential sections are complete (contact info, experience, education, skills)."
    );
  }

  const wordCount = extractResumeText(resumeData).split(/\s+/).length;
  if (wordCount < 400) {
    suggestions.push("Your resume is too short. Add more details to reach 1-2 pages.");
  } else if (wordCount > 800) {
    suggestions.push("Your resume is too long for ATS. Consider removing less relevant content.");
  }

  if (readabilityScore < 80) {
    suggestions.push(
      "Use stronger action verbs and keep bullet points concise (under 150 characters)."
    );
  }

  return suggestions;
}

/**
 * Generate improvement recommendations
 */
function generateImprovements(
  keywordScore: number,
  formattingScore: number,
  lengthScore: number,
  readabilityScore: number
): string[] {
  const improvements: string[] = [];

  if (keywordScore < 90) {
    improvements.push("Optimize keyword usage for better ATS matching");
  }

  if (formattingScore < 95) {
    improvements.push("Complete all essential resume sections");
  }

  if (lengthScore < 90) {
    improvements.push("Adjust resume length to optimal 1-2 pages");
  }

  if (readabilityScore < 90) {
    improvements.push("Enhance bullet points with action verbs and metrics");
  }

  return improvements;
}
