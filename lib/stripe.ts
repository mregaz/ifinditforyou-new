// lib/stripe.ts
import Stripe from "stripe";

// leggiamo entrambe le possibili ENV
const secretKey =
  process.env.STRIPE_SECRET_KEYS || process.env.STRIPE_SECRET_KEY || "";

if (!secretKey) {
  // NON lanciamo più un errore che blocca tutto,
  // ci limitiamo a loggare un avviso.
  console.error(
    "ATTENZIONE: manca STRIPE_SECRET_KEYS / STRIPE_SECRET_KEY. Le chiamate Stripe daranno errore."
  );
}

// inizializziamo comunque Stripe; se la chiave è vuota o sbagliata,
// le API Stripe restituiranno un errore "Invalid API Key provided",
// che verrà catturato nella route /api/create-checkout-session.
export const stripe = new Stripe(secretKey || "sk_test_dummy");
