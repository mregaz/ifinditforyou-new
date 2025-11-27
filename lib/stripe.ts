// lib/stripe.ts
import Stripe from "stripe";

// Leggiamo sia STRIPE_SECRET_KEY sia STRIPE_SECRET_KEYS
const secretKey =
  process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEYS || "";

if (!secretKey) {
  // Non blocchiamo la build con un errore, ma lasciamo un log chiaro
  console.error(
    "Stripe: nessuna chiave segreta trovata (STRIPE_SECRET_KEY o STRIPE_SECRET_KEYS)."
  );
}

// Se manca, Stripe verrà comunque inizializzato con stringa vuota, ma
// l'API /api/create-checkout-session intercetterà il problema.
export const stripe = new Stripe(secretKey);
