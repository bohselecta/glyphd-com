import Stripe from 'stripe'
import { NextResponse } from 'next/server'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
export async function POST(req: Request){ const { customerId } = await req.json(); const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: process.env.STRIPE_PORTAL_RETURN_URL || process.env.PUBLIC_BASE_URL! }); return NextResponse.json({ ok:true, url: session.url }) }
