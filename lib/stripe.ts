import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

export const LISTING_FEE = 999; // $9.99 in cents
export const LISTING_FEE_DISPLAY = "$9.99";
