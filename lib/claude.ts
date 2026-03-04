import Anthropic from "@anthropic-ai/sdk";
import type { ScanResult } from "./store";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an ATS (Applicant Tracking System) expert specializing in software engineering resumes.
Analyze the resume provided and return ONLY valid JSON with no markdown, no code blocks, no extra text.`;

function buildUserPrompt(jobTitle: string, resumeText: string): string {
  return `Analyze the following resume for the role: ${jobTitle}.

Return ONLY valid JSON with this exact structure:
{
  "overallScore": <number 0-100>,
  "categories": {
    "keywordMatch": { "score": <number 0-100>, "suggestions": [<3-5 specific strings>] },
    "formatting": { "score": <number 0-100>, "suggestions": [<3-5 specific strings>] },
    "achievements": { "score": <number 0-100>, "suggestions": [<3-5 specific strings>] },
    "skillsSection": { "score": <number 0-100>, "suggestions": [<3-5 specific strings>] },
    "structure": { "score": <number 0-100>, "suggestions": [<3-5 specific strings>] },
    "actionVerbs": { "score": <number 0-100>, "suggestions": [<3-5 specific strings>] }
  }
}

Scoring guidance:
- keywordMatch: Does the resume contain keywords and technologies typical for ${jobTitle}? (e.g. specific frameworks, languages, tools)
- formatting: Is it ATS-safe? Penalise tables, columns, graphics, headers/footers, fancy fonts, text boxes
- achievements: Are accomplishments quantified with numbers, percentages, dollar amounts, or team sizes?
- skillsSection: Is there a dedicated skills/technologies section that is complete and well-organised?
- structure: Does it have all key sections: Summary/Objective, Experience, Skills, Education?
- actionVerbs: Do bullet points start with strong, specific action verbs? Penalise weak verbs like "helped", "worked on", "responsible for"

Be specific and actionable. Reference actual content from the resume in your suggestions.
Each suggestion should be a concrete improvement the candidate can make immediately.

Resume:
${resumeText}`;
}

export async function analyzeResume(
  jobTitle: string,
  resumeText: string
): Promise<Omit<ScanResult, "id" | "paid" | "createdAt" | "jobTitle">> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(jobTitle, resumeText),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  let raw = content.text.trim();
  // Strip any accidental markdown code fences
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");

  const parsed = JSON.parse(raw);

  // Validate required fields exist
  const required = ["keywordMatch", "formatting", "achievements", "skillsSection", "structure", "actionVerbs"];
  for (const key of required) {
    if (!parsed.categories?.[key]) {
      throw new Error(`Missing category in Claude response: ${key}`);
    }
  }

  return {
    overallScore: Math.round(parsed.overallScore),
    categories: parsed.categories,
  };
}
