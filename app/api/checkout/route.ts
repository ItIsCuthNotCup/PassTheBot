import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getScan } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const { scanId, plan } = await request.json() as {
      scanId: string;
      plan: "one-time" | "monthly";
    };

    if (!scanId || !plan) {
      return NextResponse.json(
        { error: "scanId and plan are required." },
        { status: 400 }
      );
    }

    const scan = getScan(scanId);
    if (!scan) {
      return NextResponse.json({ error: "Scan not found." }, { status: 404 });
    }

    if (scan.paid) {
      // Already paid — just redirect
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
      return NextResponse.json({ url: `${baseUrl}/results/${scanId}` });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const priceId =
      plan === "monthly"
        ? process.env.STRIPE_MONTHLY_PRICE_ID!
        : process.env.STRIPE_ONE_TIME_PRICE_ID!;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: plan === "monthly" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/results/${scanId}?success=1`,
      cancel_url: `${baseUrl}/results/${scanId}?cancelled=1`,
      metadata: { scanId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
