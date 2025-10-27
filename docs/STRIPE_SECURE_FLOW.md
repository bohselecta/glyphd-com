# Stripe Secure Flow — Billing + Tax + Chargeback Protection

## Environment
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PRICE_CREATOR_MONTHLY=price_xxx
PRICE_CREATOR_QUARTERLY=price_xxx
STRIPE_PORTAL_RETURN_URL=https://glyphd.com/account

# Optional flags
STRIPE_TAX_FEATURE=on
STRIPE_CHARGEBACK_PROTECTION=on
PUBLIC_BASE_URL=https://glyphd.com
```
Enable **Automatic Tax** and **Chargeback Protection** in Stripe Dashboard. Create the **Glyphd Creator** product and both prices.

## Flow
- **Create Checkout Session** → mode `subscription`, price = chosen tier.
- **Webhook** (`checkout.session.completed`, `invoice.paid`) → set `tier='creator'` and **seed credits**.
- **Webhooks** (`invoice.payment_failed`, `customer.subscription.deleted`) → **downgrade to Free**.
- **Customer Portal** → manage payment, cancel, change plan.

This pack ships all routes and helper utilities.
