// lib/stripe.ts
import Stripe from "stripe";

// Leggiamo SOLO STRIPE_SECRET_KEY dalle env
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY environment variable. " +
      "Imposta STRIPE_SECRET_KEY in .env.local (in locale) e negli env di Vercel (in produzione)."
  );
}

// Istanza unica di Stripe
export const stripe = new Stripe(secretKey, {
  apiVersion: "2023-10-16",
});
