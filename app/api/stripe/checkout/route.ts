import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, LISTING_FEE } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await req.json();
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });

  if (!listing || listing.userId !== session.user.id) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: LISTING_FEE,
          product_data: {
            name: "Triangle Help – Service Listing",
            description: `Activate your listing: "${listing.title}"`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { listingId, userId: session.user.id },
    success_url: `${appUrl}/listings/${listingId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/listings/new?cancelled=1`,
    customer_email: session.user.email ?? undefined,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
