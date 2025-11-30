// lib/stripe.ts
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEYS;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEYS environment variable");
}

// NIENTE apiVersion: lasciamo che Stripe usi la versione di default
export const stripe = new Stripe(secretKey);
