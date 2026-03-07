import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markPaid, getScan, isEventProcessed, markEventProcessed } from "@/lib/store";

// App Router reads the body as a stream by default — no bodyParser config needed

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    // Idempotency: skip events we've already processed
    if (isEventProcessed(event.id)) {
      return NextResponse.json({ received: true });
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "invoice.payment_succeeded"
    ) {
      const session = event.data.object as { metadata?: { scanId?: string } };
      const scanId = session.metadata?.scanId;
      if (scanId) {
        // Verify the scan exists before marking it paid
        const scan = getScan(scanId);
        if (scan) {
          markPaid(scanId);
        } else {
          console.error(`Webhook: scan not found for scanId ${scanId}`);
        }
      }
    }

    // Record the event as processed after successful handling
    markEventProcessed(event.id);
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
