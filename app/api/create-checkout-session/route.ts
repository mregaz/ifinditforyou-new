import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEYS;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEYS environment variable");
  }
  return new Stripe(secretKey);
}

const MONTHLY_PRICE_ID = process.env.STRIPE_PRICE_MONTHLY!;
const YEARLY_PRICE_ID = process.env.STRIPE_PRICE_YEARLY!;


export async function POST(req: NextRequest) {
  try {
    const { billingPeriod = "monthly" } = await req.json();
    const price = billingPeriod === "yearly" ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_
