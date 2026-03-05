import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { analyzeResume } from "@/lib/claude";
import { saveScan } from "@/lib/store";

export const maxDuration = 60;

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_JOB_TITLE_LENGTH = 200;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const jobTitle = formData.get("jobTitle") as string | null;
    const resumeText = formData.get("resumeText") as string | null;
    const file = formData.get("file") as File | null;

    if (!jobTitle || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { error: "Job title is required." },
        { status: 400 }
      );
    }

    if (jobTitle.trim().length > MAX_JOB_TITLE_LENGTH) {
      return NextResponse.json(
        { error: "Job title is too long." },
        { status: 400 }
      );
    }

    let text = "";

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "File is too large. Maximum size is 5 MB." },
          { status: 400 }
        );
      }

      // Validate MIME type — only accept PDFs
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Only PDF files are supported." },
          { status: 400 }
        );
      }

      // Server-side PDF parsing
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfParse = (await import("pdf-parse")).default;
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else if (resumeText && resumeText.trim().length > 0) {
      text = resumeText.trim();
    } else {
      return NextResponse.json(
        { error: "Please upload a PDF or paste your resume text." },
        { status: 400 }
      );
    }

    if (text.trim().length < 100) {
      return NextResponse.json(
        { error: "Resume text is too short. Please provide a complete resume." },
        { status: 400 }
      );
    }

    // Truncate to avoid huge API costs (approx 15k chars ~ 4k tokens)
    const truncated = text.slice(0, 15000);

    const analysis = await analyzeResume(jobTitle.trim(), truncated);

    const id = uuidv4();
    const scan = {
      id,
      jobTitle: jobTitle.trim(),
      overallScore: analysis.overallScore,
      categories: analysis.categories,
      paid: false,
      createdAt: Date.now(),
    };

    saveScan(scan);

    // Never return resume text in the response
    return NextResponse.json({ id, overallScore: analysis.overallScore });
  } catch (err) {
    // Log the full error server-side but never expose internal details to clients
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
