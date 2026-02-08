import { AIContext, AIPromptRequest } from "@/types/ai";

/**
 * Generate standardized AI prompt for Gemini LLM
 * Following the specified prompt structure for ATS optimization
 */
export function generatePrompt(request: AIPromptRequest): string {
  const { context, userData, section, instruction } = request;

  const basePrompt = `You are a professional resume writer and ATS optimization expert.

Context:
- Document type: ${getDocumentTypeLabel(context.documentType)}
- Job title: ${context.jobTitle || "Not specified"}
- Industry: ${context.industry || "Not specified"}
- Experience level: ${context.experienceLevel || "Not specified"}
- Language: ${context.language.toUpperCase()}
- Selected template: ${context.templateId}

${userData ? `User data:\n${JSON.stringify(userData, null, 2)}\n` : ""}
${context.jobDescription ? `Job description:\n${context.jobDescription}\n` : ""}

Instructions:
- Generate ATS-friendly content
- Use clear bullet points
- Avoid tables, icons, emojis
- Use professional tone
- Optimize for keyword matching
- Keep content concise and editable
${section ? `- Focus on the ${section} section` : ""}

${instruction}`;

  return basePrompt;
}

/**
 * Generate prompt for experience bullet points
 */
export function generateExperienceBulletPrompt(
  role: string,
  industry: string,
  years: number,
  context: AIContext
): string {
  return generatePrompt({
    context,
    instruction: `Generate 3-5 professional bullet points for a ${role} position in the ${industry} industry with ${years} years of experience.

Each bullet point should follow this structure:
- Start with a strong action verb
- Describe the responsibility clearly
- Include measurable impact or results when possible
- Use metrics and numbers where applicable

Format: Return only the bullet points, one per line, starting with "•"`,
  });
}

/**
 * Generate prompt for skills extraction from job description
 */
export function generateSkillsExtractionPrompt(
  jobDescription: string,
  currentSkills: string[],
  context: AIContext
): string {
  return generatePrompt({
    context: { ...context, jobDescription },
    userData: { currentSkills },
    instruction: `Analyze the job description and:

1. Extract all technical skills, tools, and technologies mentioned
2. Identify soft skills required
3. Compare with the user's current skills
4. Suggest missing skills that should be added
5. Flag any irrelevant skills that should be removed

Format your response as JSON:
{
  "extractedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "irrelevantSkills": ["skill1", "skill2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}`,
  });
}

/**
 * Generate prompt for project descriptions
 */
export function generateProjectDescriptionPrompt(
  projectName: string,
  role: string,
  technologies: string[],
  context: AIContext
): string {
  return generatePrompt({
    context,
    userData: { projectName, role, technologies },
    instruction: `Generate a professional project description for "${projectName}" where the user worked as a ${role}.

Technologies used: ${technologies.join(", ")}

Include:
- Brief project overview (1-2 sentences)
- Your role and responsibilities
- Key achievements or impact
- Technical highlights

Provide both:
1. ATS-optimized version (plain text, keyword-rich)
2. Standard version (slightly more descriptive)

Format as JSON:
{
  "atsVersion": "...",
  "standardVersion": "...",
  "highlights": ["highlight1", "highlight2", ...]
}`,
  });
}

/**
 * Generate prompt for cover letter
 */
export function generateCoverLetterPrompt(
  companyName: string,
  position: string,
  tone: "formal" | "professional" | "enthusiastic",
  userData: Record<string, unknown>,
  context: AIContext
): string {
  return generatePrompt({
    context,
    userData,
    instruction: `Generate a compelling cover letter for the position of ${position} at ${companyName}.

Tone: ${tone}

The cover letter should:
- Be 3-4 paragraphs
- Show genuine interest in the company and role
- Highlight relevant experience and skills
- Demonstrate cultural fit
- Include a strong opening and closing
- Be personalized and specific
- Avoid generic phrases

Return the cover letter as plain text, ready to be edited.`,
  });
}

/**
 * Generate prompt for content rewriting (ATS optimization)
 */
export function generateRewritePrompt(
  content: string,
  section: string,
  context: AIContext
): string {
  return generatePrompt({
    context,
    section,
    instruction: `Rewrite the following ${section} content to be more ATS-friendly and impactful:

Original content:
${content}

Improvements needed:
- Stronger action verbs
- More specific and measurable results
- Better keyword optimization
- Clearer and more concise language
- Professional tone

Return only the rewritten content, maintaining the same structure.`,
  });
}

/**
 * Generate prompt for smart suggestions
 */
export function generateSuggestionsPrompt(
  resumeData: Record<string, unknown>,
  jobDescription: string | undefined,
  context: AIContext
): string {
  return generatePrompt({
    context: { ...context, jobDescription },
    userData: resumeData,
    instruction: `Analyze this resume and provide smart suggestions for improvement.

Focus on:
1. Resume length (should be 1-2 pages)
2. Keyword optimization for ATS
3. Bullet point quality and impact
4. Skills relevance
5. Section organization
6. Template suitability for the job type

Return suggestions as JSON:
{
  "critical": ["critical issue 1", ...],
  "warnings": ["warning 1", ...],
  "recommendations": ["recommendation 1", ...],
  "strengths": ["strength 1", ...]
}`,
  });
}

/**
 * Helper function to get document type label
 */
function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    cv: "Curriculum Vitae (CV)",
    "ats-resume": "ATS-Optimized Resume",
    "cover-letter": "Cover Letter",
  };
  return labels[type] || type;
}
