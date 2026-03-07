import { NextRequest, NextResponse } from "next/server";
import { getScan, isValidUUID } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidUUID(id)) {
    return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  }
  const scan = getScan(id);
  if (!scan) {
    return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  }

  // If not paid, blur all category suggestions except the first category
  if (!scan.paid) {
    const categories = { ...scan.categories };
    const categoryKeys = Object.keys(categories) as Array<keyof typeof categories>;

    // Show keywordMatch freely; gate the rest
    for (let i = 1; i < categoryKeys.length; i++) {
      categories[categoryKeys[i]] = {
        score: categories[categoryKeys[i]].score,
        suggestions: [], // empty — client shows blur overlay
      };
    }

    return NextResponse.json({
      ...scan,
      categories,
      paid: false,
    });
  }

  return NextResponse.json(scan);
}
