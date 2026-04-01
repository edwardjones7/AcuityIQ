# Acuity — Adaptive IQ Assessment Platform

> A full-stack, production-ready cognitive assessment platform built from scratch. Adaptive testing engine, real-time scoring, Stripe payments, and a premium branded UI.

**Live:** [acuity.ai](https://acuityiq.live) &nbsp;·&nbsp; **Stack:** React 18 · Node.js · Express · Stripe · Framer Motion · Tailwind CSS

---

## Overview

Acuity is a scientifically-normed IQ assessment that adapts in real time to the user's ability level. Users complete 40 questions across four cognitive domains and receive a composite IQ score, percentile rank, domain breakdown, and a written cognitive analysis — unlocked via a Stripe-powered paywall.

Built end-to-end as a solo project: product design, brand identity, frontend, backend, scoring algorithm, and deployment.

---

## Key Engineering Highlights

### Computer Adaptive Testing (CAT) Engine
The test difficulty adjusts in real time based on performance — no two tests are identical. Implemented from scratch without a library:

- Starts at difficulty 3/5 per domain
- 2 consecutive correct answers → difficulty increases
- 1 wrong answer → difficulty decreases
- Round-robin domain interleaving ensures balanced coverage
- Server-side replay validation prevents client-side score manipulation

### Psychometric Scoring Algorithm
IQ scores are computed using a weighted difficulty model, not raw accuracy:

```
weight(q)    = difficulty^1.4
raw_score    = Σ(correct × weight) / Σ(weight) × 100
adjusted     = raw × (1 + (avg_difficulty − 3) × 0.08)
domain_iq    = clamp(100 + (adjusted − 50) / 15 × 15, 40, 160)
composite_iq = weighted_mean(domains, weights: pattern×1.2, numerical×1.1, verbal×1.0, spatial×0.9)
percentile   = normalCDF via erf approximation (Abramowitz & Stegun)
```

### Stateless Architecture
Zero database. All state lives in the client during the test; results are computed server-side on submission and persisted in `sessionStorage` to survive the Stripe payment redirect. The server is purely functional — no sessions, no user accounts.

### Stripe Checkout Integration
Full payment flow: session creation → hosted Stripe Checkout → redirect back → server-side verification. The `?session_id` param is verified against the Stripe API before content is unlocked, preventing URL manipulation.

---

## Feature Set

| Feature | Detail |
|---|---|
| Adaptive testing | CAT engine adjusts difficulty per domain in real time |
| 4 cognitive domains | Pattern, Verbal, Numerical, Spatial |
| Normed IQ scoring | Mean 100, SD 15 — matched to population norms |
| Percentile ranking | Computed via normal CDF (erf approximation) |
| Written analysis | Narrative engine generates band + domain + profile text |
| Stripe paywall | $4.99 one-time unlock, session verified server-side |
| Email capture | Lead capture at paywall, ready for CRM/email integration |
| Shareable card | html2canvas exports a branded PNG for social sharing |
| SEO | Structured data (JSON-LD), Open Graph, Twitter Card |
| Print / PDF | Full CSS print styles for report export |
| Mobile responsive | Designed mobile-first, tested across breakpoints |

---

## Tech Stack

```
Frontend                  Backend
─────────────────────     ────────────────────
React 18                  Node.js + Express
React Router v6           Stripe SDK
Framer Motion             Stateless REST API
Tailwind CSS 3
Recharts
html2canvas
Vite 5
```

**Deployed on:** Vercel (frontend + serverless API routes)

---

## Architecture

```
client/                     server/
├── pages/                  ├── routes/
│   ├── WelcomePage         │   ├── questions.js   GET  /api/questions
│   ├── TestPage            │   ├── score.js       POST /api/score
│   └── ResultsPage         │   ├── checkout.js    POST /api/checkout/*
│                           │   └── email.js       POST /api/email/capture
├── hooks/                  │
│   ├── useTestEngine.js    ├── services/
│   └── useTimer.js         │   ├── scoringEngine.js
│                           │   ├── narrativeEngine.js
├── components/             │   └── adaptiveEngine.js
│   ├── layout/             │
│   ├── test/               └── utils/
│   └── results/                └── iqMath.js
```

**Communication flow:**
1. `GET /api/questions` — client fetches sanitised question bank (correct answers stripped server-side)
2. CAT runs entirely on the client — no per-question API calls, no latency
3. `POST /api/score` — answers submitted at end; server validates, scores, returns results
4. `POST /api/checkout/create-session` — Stripe session created, user redirected
5. `POST /api/checkout/verify` — session ID verified before unlocking content

---

## Product & Design

- **Brand:** Acuity — precision dial logo mark, rose/mauve palette, Apple-influenced clinical aesthetic
- **Animations:** Framer Motion throughout — page transitions, question slide-in/out, animated IQ score ring, staggered result reveals, spring-physics tab switching
- **Paywall UX:** Content blurred behind a frosted-glass overlay; email capture integrated before payment CTA
- **Shareable results card:** Fixed-dimension branded PNG exported via html2canvas, optimised for Instagram/TikTok

---

## Running Locally

```bash
# Install all dependencies
npm install

# Start both client (port 5173) and server (port 3001)
npm run dev
```

---

## Project Structure Decisions

**Why stateless?** Eliminates infrastructure cost and complexity for an MVP. Results are ephemeral by design — no GDPR surface area, no database to maintain.

**Why CAT on the client?** Reduces server round-trips to zero during the test, giving instant question transitions. The server re-validates the adaptive sequence on submission to prevent manipulation.

**Why Stripe Checkout (hosted)?** PCI compliance handled entirely by Stripe. No card data touches the server.

---

> *"I built this to understand adaptive testing algorithms and ship a complete monetised product end-to-end — from algorithm design to brand identity to payment infrastructure."*
