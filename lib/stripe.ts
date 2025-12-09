// lib/stripe.ts
import Stripe from "stripe";

// Prendiamo la chiave Stripe da ENV
const secretKey =
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEYS ||
  "";

// Piccolo controllo di sicurezza
if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// Istanza unica di Stripe (senza apiVersion esplicito)
export const stripe = new Stripe(secretKey);

