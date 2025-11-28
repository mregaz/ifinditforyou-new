// lib/stripe.ts
import Stripe from "stripe";

const secretKey =
  process.env.STRIPE_SECRET_KEYS || process.env.STRIPE_SECRET_KEY || "";

if (!secretKey) {
  console.error(
    "ATTENZIONE: manca STRIPE_SECRET_KEYS / STRIPE_SECRET_KEY. Le chiamate Stripe daranno errore."
  );
}

export const stripe = new Stripe(secretKey || "sk_test_dummy");
