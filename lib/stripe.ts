// lib/stripe.ts
import Stripe from "stripe";

const secretKey =
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEYS ||
  "";

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY (or STRIPE_SECRET_KEYS)");
}

export const stripe = new Stripe(secretKey, {
  // opzionale: se vuoi fissare la versione per evitare sorprese
  // apiVersion: "2024-06-20",
});
