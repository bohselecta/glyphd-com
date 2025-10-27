# Glyphd Pricing & Usage (v10.2)

## Principles
- Two tiers only: **Free** and **Creator**.
- One‑time **phone voice verification** at signup (not a feature, just a gate).
- Predictable compute: meter **LLM build steps** and **image generation** separately.
- Daily caps + monthly pools to feel generous for humans and expensive for bots.

## Units
- **Build Step** — one LLM operation (plan, copy pass, schema/edit/refine op).
- **Image** — one generated asset via **black-forest-labs/FLUX‑1‑dev** on DeepInfra.
- **App** — a “Mark.”

## Tiers

### Free — “Maker Trial”
- **Apps/day:** 2  
- **Build steps / app / day:** 8  
- **Images / app:** 2  
- **Storage:** 7 days (auto-expire)  
- **Export:** Local only (no one‑click deploy)  
- **Branding:** “Made on Glyphd” watermark  
- **Verification:** One‑time voice call at signup (required)

### Creator — “Glyphd Pro”
- **Price:** **$6/mo** (monthly) or **$15/quarter** (beta promo)  
- **Apps/day:** 10  
- **Build steps / app / day:** 24  
- **Images / app:** 8  
- **Monthly image pool:** 100 images/user (soft cap)  
- **Storage:** Persistent  
- **Export:** Full (static + Next.js)  
- **Deploy:** Vercel/Railway one‑click  
- **Branding:** Removable  
- **Verification:** Same one‑time call at signup

## Top‑Ups (optional)
- **Image top‑up:** $2 → +20 images (user‑initiated)  
- **Steps top‑up:** $1 → +1,000 steps  
- **Hard stop** at **2×** monthly pool to block abuse.

## Enforcement
- Count **steps** as LLM calls; **images** as DeepInfra calls.
- Enforce per‑app/day caps in `/api/build` and `/api/assets/generate`.
- Maintain monthly image pool for Creator; decrement on each image gen.
- Hard fail with clear UI + link to `/pricing` for top‑ups.
