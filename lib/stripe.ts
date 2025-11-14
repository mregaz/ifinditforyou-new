// lib/stripe.ts
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEYS;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEYS environment variable");
}

export const stripe = new Stripe(secretKey);

