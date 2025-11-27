// lib/stripe.ts
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("ENV STRIPE_SECRET_KEY non è definita");
}

// Costruttore Stripe SENZA apiVersion (usa quella di default)
export const stripe = new Stripe(secretKey);
