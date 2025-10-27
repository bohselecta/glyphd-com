# 🧩 Glyphd — Product Brief  
> **Make your mark.**

---

## 🌐 Core Concept

**Glyphd** is an **AI-powered creative build studio** that turns a single idea prompt into a complete, deployable product — a *Symbol.*

A **Symbol** is a self-contained project composed of:
- Visual identity (hero image + logo)
- Generated copy and structure
- Schema-driven metadata (Product, Service, CreativeWork, etc.)
- JSON-LD for SEO and discoverability
- Ready-to-deploy static site or exportable Next.js app

Everything from **idea → image → deploy** happens in one seamless interface.

---

## ⚙️ System Flow Overview

```
    ┌──────────────────────────┐
    │        User Prompt       │
    │  "Make a site for a      │
    │   coffee brand"          │
    └────────────┬─────────────┘
                 │
                 ▼
     ┌──────────────────────┐
     │  Z.ai Builder Engine │
     │ - Parses intent      │
     │ - Maps schemas       │
     │ - Generates copy     │
     │ - Calls DeepInfra    │
     │   for hero assets    │
     └─────────┬────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │  Symbol Generator (fileWriter)│
    │ - Creates folder structure    │
    │ - Writes metadata, schema     │
    │ - Seeds JSON templates        │
    └──────────┬───────────────────┘
               │
               ▼
   ┌──────────────────────────────┐
   │   Web Studio UI              │
   │ /s/[slug]      — Live view   │
   │ /configure     — Schema edit │
   │ /edit          — Metadata    │
   │ /designer      — Mapping     │
   └────────┬─────────────────────┘
            │
            ▼
 ┌────────────────────────┐
 │ In-App Preview System  │
 │ - Live Symbol viewing  │
 │ - Schema editor       │
 │ - Asset management     │
 └────────────────────────┘
```

---

## 💻 User Interface Sketches

### 🟢 Landing Page (Main Builder)

```
┌──────────────────────────────────────────────┐
│ G L Y P H D                                  │
│----------------------------------------------│
│ Make your mark.                              │
│                                              │
│ [ Enter your idea... ]  [Glyph It]           │
│                                              │
│ Example: "Create a dark neon portfolio site  │
│  for a photographer named Nova"              │
│----------------------------------------------│
│ Symbols Created:                             │
│  - nova-portfolio     (Open) (Configure)     │
│  - gummy-labs         (Open) (Deploy)        │
└──────────────────────────────────────────────┘
```

---

### 🟣 Symbol Page (`/s/[slug]`)

```
┌──────────────────────────────────────────────┐
│ [Logo.svg] glyphd • Make your mark           │
│----------------------------------------------│
│ HOME | FEATURES | PRICING | CONFIGURE | EDIT │
│----------------------------------------------│
│ Hero Section:                               │
│ ┌────────────────────────────────────────┐  │
│ │  [Hero.png]                            │  │
│ │  "Meet Nova"                           │  │
│ │  "Photography reimagined in neon light"│  │
│ └────────────────────────────────────────┘  │
│                                              │
│ Features Grid (from schema.json)             │
│ ──────────────────────────────────────────── │
│ - Stunning Portfolio Layouts                 │
│ - LightSpeed Performance                     │
│ - Schema-aware SEO                           │
│----------------------------------------------│
│ Pricing Cards                                │
│ [Free] [Pro] [Studio]                        │
│----------------------------------------------│
│ Footer © glyphd 2025                         │
└──────────────────────────────────────────────┘
```

---

### 🧠 Configure Page (`/s/[slug]/configure`)

```
┌──────────────────────────────────────────────┐
│ Configure Schemas for: nova-portfolio        │
│----------------------------------------------│
│ [ Schema type ▼ ] Product                    │
│----------------------------------------------│
│ name:        Nova Portfolio Site             │
│ brand:       glyphd labs                     │
│ price:       9.99                            │
│ priceCurrency: USD                            │
│ availability: InStock                         │
│ description: Elegant portfolio generator      │
│----------------------------------------------│
│ [ Save ] [ Preview JSON-LD ]                 │
└──────────────────────────────────────────────┘
```

---

### 🧩 Designer Console (`/designer`)

```
┌──────────────────────────────────────────────┐
│ DESIGNER CONSOLE                            │
│----------------------------------------------│
│ Prompt: "Build a landing page for a bakery" │
│----------------------------------------------│
│ Suggested Schemas: Product, Offer, Service   │
│ Suggested Components: Hero, Features, CTA   │
│----------------------------------------------│
│ Generated JSON-LD Preview (valid ✅)         │
│ { "@type": "Product", "name": "BakerySite" }│
│----------------------------------------------│
│ [Apply to Symbol] [Copy JSON-LD]             │
└──────────────────────────────────────────────┘
```

---

## 🧱 Technical Summary

| Layer | Responsibility |
|--------|----------------|
| **Builder Engine** | Maps prompt → schemas, generates copy/images |
| **FileWriter** | Writes Symbol folder + schema templates |
| **Schema Registry** | Defines types & required fields |
| **Designer Engine** | Suggests schemas/components from text |
| **Web App** | Renders, edits, and manages Symbols in-app |
| **Preview System** | Live Symbol viewing within Glyphd interface |

---

## 🎨 Design Language

- **Theme:** *Dark Candy-Tech × Desert Nomad Neon*  
- **Primary Colors:**  
  - Hot Pink: `#FF2DAA`  
  - Neon Cyan: `#33FFF2`  
  - Deep Charcoal: `#0B0C10`
- **Style:** glass panels, gradient headers, subtle motion, clean system fonts  
- **Tone:** Creative, professional, "AI as a co-designer"  

---

## 💎 Product Positioning

Glyphd competes with app builders like **Floot**, **Puter**, and **Bolt.new**,  
but emphasizes:
- True ownership (no "we own your code" clause)
- Full creative control (designer-driven schema editing)
- Rich aesthetic control via brand tokens
- Local-first + REST deploy flexibility

---

## 🧪 Future Enhancements

- Live schema visualizer (show JSON-LD as you type)
- Prompt history + reuse
- Team spaces & collaboration
- AI review: auto-critique UX & SEO before deploy
- Schema marketplace & remix system

---

### 🖼️ ASCII Poster Summary

```
   G L Y P H D
───────────────────────
"Make your mark."

## idea → glyph → symbol → deploy

prompt → schema → copy → asset
↓
json-ld
↓
live page
---------

dark candy-tech • desert neon
hot pink #FF2DAA • cyan #33FFF2
```

---

**Document:** `/docs/README_PRODUCT_BRIEF.md`  
**Last Updated:** v9 Handoff • October 2025  
**Author:** Glyphd Labs (Hayden)

---
