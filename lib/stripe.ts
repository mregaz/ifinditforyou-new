// lib/stripe.ts
console.log("STRIPE_SECRET_KEY prefix:", process.env.STRIPE_SECRET_KEY?.slice(0, 7));
console.log("STRIPE_PUBLISHABLE prefix:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.slice(0, 7));
import Stripe from "stripe";


// Prendiamo la chiave Stripe da ENV
  const secretKey = process.env.STRIPE_SECRET_KEY || "";


// Piccolo controllo di sicurezza
if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// Istanza unica di Stripe (senza apiVersion esplicito)
export const stripe = new Stripe(secretKey);

