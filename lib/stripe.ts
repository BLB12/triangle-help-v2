import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const LISTING_FEE = 999; // $9.99 in cents
export const LISTING_FEE_DISPLAY = "$9.99";
