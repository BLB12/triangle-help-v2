import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { listingId } = session.metadata ?? {};

    if (listingId) {
      await prisma.listing.update({
        where: { id: listingId },
        data: {
          status: "ACTIVE",
          stripePaymentId: session.payment_intent as string,
        },
      });
      console.log(`Listing ${listingId} activated via Stripe`);
    }
  }

  return NextResponse.json({ received: true });
}
