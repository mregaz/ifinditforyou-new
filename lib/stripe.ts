// lib/stripe.ts
import Stripe from "stripe";

// Prendiamo la chiave Stripe da ENV, con fallback dummy per la build locale
const secretKey =
  process.env.STRIPE_SECRET_KEYS ||
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_dummy_for_build";

// Unica export: istanza di Stripe
export const stripe = new Stripe(secretKey);
