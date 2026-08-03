# HANDOVER — Build the Azul System Diagram Page

**Paste this whole document into a fresh Claude Code session to build an interactive Miro-style system diagram of Azul's entire business — sales funnel, product delivery, tools, hiring stages — as a page inside our existing web app.**

---

## What I'm building and why

I want an **interactive system diagram** (like Miro/whiteboard) that visually maps out our entire agency operation — from lead generation through delivery through scale. Purpose:

1. **Sales tool** — show prospects on demo calls "here's the whole system you're plugging into"
2. **Internal reference** — when hiring VAs or setters, they see the entire pipeline in one image
3. **Marketing asset** — screenshot-worthy for LinkedIn / Instagram / Twitter posts

Reference visual: node-and-edge flowchart with colored sticky-note style boxes, connecting arrows, zoom/pan. Think Vercel Dashboard's architecture diagrams, Retool's app editor, or Framer's flow view.

## Project context

**Repo:** `c:\Users\eveli\OneDrive\Desktop\Azul-main`

**Stack:** React 18 + Vite + Tailwind CSS + Lenis smooth scroll + Inter font. Full context in `AZUL_BUSINESS_PLAN.md` at project root — read that first for business model, service catalog, pricing, tool stack, and delivery workflows.

**Site structure:** single-page marketing site. All sections live in `src/App.jsx`. Full bilingual (EN/ES) via `src/contexts/LanguageContext.jsx` and `src/data/content.js`.

**Design system already in place** (`tailwind.config.js`):
- Font: Inter var (loaded via rsms.me)
- Fluid type scale: `text-display-xl/lg/md/sm`
- Ink neutral scale: `ink-50` → `ink-950`
- Accent: `blue-500`
- Colored badge tones: `bg-blue-50/text-blue-700`, `bg-emerald-50/text-emerald-700`, `bg-gray-100/text-gray-500`
- Card language: `bg-white border border-gray-200/70 rounded-2xl p-7`

**Match this design system** — no rogue color palettes.

## Technology to use

**React Flow** (`reactflow` npm package). This is the standard for React node/edge diagrams.
- Handles pan, zoom, mini-map, connection lines
- Custom node components (we'll style ours to match the site)
- Interactive out of the box
- MIT licensed, actively maintained
- ~50kb gzipped

Install:
```bash
npm install reactflow
```

Alternatives considered but rejected:
- Mermaid.js — text-to-diagram, but limited styling and no interactive polish
- tldraw — full whiteboard, overkill and adds ~500kb
- Custom SVG — too much work for equivalent result

## The diagram structure I want

Build 4 horizontal swim-lanes (rows) that read left-to-right and connect across. Nodes are colored by lane. Every node has a short label; some have a subtext.

### LANE 1 (top) — SALES FUNNEL (color: blue-50 background, blue-700 text)
Left → Right flow:
1. **Prospect List** (subtext: "50 Miami roofers/HVAC from Google Maps")
2. **Loom Audit Video** (subtext: "3-min bilingual video, name-drops specifics")
3. **Outreach Channel** — split into 3 branches:
   - Instagram DM
   - WhatsApp
   - Email
4. **Demo Booked** (via Calendly) — merges all 3 back to one node
5. **Sales Call** (subtext: "15 min, screen-share audit + present offer")
6. **Stripe Payment** (subtext: "$399/mo Founding Client — locked for life")
7. → connects DOWN to Lane 2 "Onboarding"

### LANE 2 (middle-upper) — PRODUCT / DELIVERY (color: white bg, gray-900 text, blue-500 accent left border)
Central node: **Azul Growth Suite** (large, prominent, blue-500 background, white text)

Branching OUT from Growth Suite (6 service nodes):
1. **Website Build** ($199/mo + $499 setup)
2. **Review Booster** ($79/mo)
3. **Local Proof SEO** ($299/mo)
4. **Social Media AI** ($149/mo)
5. **AI Answering** ($349/mo — badge: "Beta")
6. **AI Facebook Ads** (subtext: "Coming Soon" — grayed out)

Each service node connects RIGHT to a delivery output (Lane 3).

### LANE 3 (middle-lower) — CLIENT OUTPUTS (color: emerald-50 bg, emerald-700 text)
What the client actually experiences:
1. **Client Website Live** ← from Website Build
2. **5-Star Google Reviews** ← from Review Booster
3. **Active Google Business Profile** ← from Local Proof SEO
4. **FB/IG Posts Weekly** ← from Social Media AI
5. **24/7 Bilingual Phone Coverage** ← from AI Answering
6. **Missed-Call Text-Back** (bonus outcome that ties to multiple services)
7. **Weekly Client Dashboard** — aggregates all outputs, ties back to client-facing reports

### LANE 4 (bottom) — TOOLS / INFRASTRUCTURE (color: gray-100 bg, gray-700 text)
The delivery stack (support layer that powers Lane 2):
1. **GoHighLevel Agency** ($297/mo — the hub) — connects to Website, Reviews, SEO, Social, Dashboard
2. **Vapi.ai** — connects to AI Answering
3. **Twilio** — connects to SMS + missed-call text-back
4. **Claude API** — connects to SEO content + Social captions
5. **LocalFalcon** — connects to Local Proof SEO (rank tracking)
6. **Stripe** — connects to Sales Funnel (payments)
7. **WhatsApp Business** — connects to photo intake pipeline (feeds Social + SEO content)

### RIGHT SIDE COLUMN — HIRING / SCALE STAGES (color: amber-50 bg, amber-700 text)
Vertical stack, top-to-bottom, showing growth phases. Each stage is a "gate" with revenue threshold:

1. **Solo Founder** — $0-3K MRR — "Deliver everything yourself"
2. **VA #1: Content** — $3-8K MRR — "$800/mo LatAm VA runs weekly content pipeline"
3. **VA #2: Sales Setter** — $8-15K MRR — "$1,000/mo LatAm setter sends Looms + books calls"
4. **Sales Closer** — $15-25K MRR — "$500 base + 15% MRR commission takes demos"
5. **Account Manager** — $25K+ MRR — "$3K/mo hire owns client retention"
6. **Full Team** — $50K+ MRR — "You go 100% strategic, team owns delivery"

Draw connecting arrows showing which lanes each hire OWNS at each stage.

## Node component spec

Create a custom React Flow node component. Each node should look like:

```
┌────────────────────────────┐
│  [Icon or emoji]           │  ← subtle icon top-left
│                            │
│  Node Title                │  ← font-semibold, tracking-tight, text-gray-900
│  Optional subtext          │  ← text-xs text-gray-500 mt-1
│                            │
│  [$Price badge if applies] │  ← inline-flex badge like PricingCard uses
└────────────────────────────┘
```

- Padding: `p-4`
- Border radius: `rounded-xl`
- Border: `border border-gray-200`
- Shadow: subtle on hover (`hover:shadow-md hover:-translate-y-0.5 transition-all`)
- Background: per-lane color (see above)
- Width: 200px default (nodes with subtext auto-expand)

## Where to place it in the site

**Option A (recommended):** New route `/system` — separate page that opens full-screen with the diagram maximized. Cleanest for the marketing-tool use case. Requires adding `react-router-dom`.

**Option B (simpler):** Embed as a new section inside `App.jsx` between "How It Works" and "Pricing". Full-width, `h-screen` container with the diagram inside.

**Option C (fastest):** Standalone page at `/system-diagram.html` — write as a separate HTML file that references React Flow via CDN. No route changes to the existing app. Downside: doesn't share the app's LanguageContext.

**Pick Option B** unless there's a strong reason otherwise. Justification: it keeps the site as a single-page experience, matches the current architecture, and lets us feature the diagram in the main scroll of the site (visible to every visitor, not just people who hit a special URL).

## Bilingual support

All node labels + subtext must live in `src/data/content.js` under a new `systemDiagram` key. Both `en` and `es` entries. Existing pattern:
```js
en: {
  // ...
  systemDiagram: {
    lane1Title: "Sales Funnel",
    nodes: {
      prospectList: { title: "Prospect List", subtext: "50 Miami roofers/HVAC from Google Maps" },
      // ...
    }
  }
}
```

## Interactivity requirements

Minimum:
- Pan (drag background) + zoom (wheel/pinch)
- Minimap in bottom-right corner
- Controls panel bottom-left (fit view, zoom in/out, lock)
- Nodes are read-only (no dragging/editing by visitors — this is a display diagram, not an editor)

Nice-to-have (Phase 2):
- Click a node → sidebar opens with more detail (link to relevant service page section, screenshot, etc.)
- Highlight connected nodes when hovering
- Toggle to filter by lane (show only Sales, only Delivery, only Tools)

## Deliverables

1. `npm install reactflow` executed, dependency added to `package.json`
2. New component: `src/components/SystemDiagram.jsx` — the main diagram
3. New component: `src/components/DiagramNode.jsx` — custom node
4. `src/data/systemDiagramNodes.js` — nodes + edges array, imported by `SystemDiagram.jsx`
5. New content keys in `src/data/content.js` for both EN and ES (all node labels)
6. Section added to `src/App.jsx` between "How It Works" and "Pricing"
7. Section header eyebrow: "The System" / "El Sistema"
8. Section headline: "Everything working together" / "Todo funcionando junto"
9. Container height: `h-[720px]` on desktop, `h-[540px]` on mobile
10. Section background: `bg-gray-50 border-y border-gray-200` (matches existing bands)
11. `npm run build` passes clean

## Visual reference (what "good" looks like)

- **Retool app editor** (retool.com) — clean node/edge diagram, colored by category
- **Vercel Dashboard architecture views** — clean, minimal, brand-consistent
- **n8n.io workflow builder** — good example of dense but readable node graphs
- **The screenshot the user provided** — Miro-style with sticky-note colored nodes, connecting arrows, revenue-stage gates

## What NOT to do

- Don't use Mermaid or SVG-only diagrams — must be React Flow for the polish
- Don't add drag/edit — this is a display tool, not an editor
- Don't invent a new color palette — reuse Tailwind config tokens already extended
- Don't skip bilingual — every string must flip via content.js
- Don't build Phase 2 interactivity first — ship the read-only diagram first
- Don't over-nest the folder structure — components go in `src/components/`, data goes in `src/data/`

## Reference — existing patterns to match

Read these files first so your components match house style:
- `src/App.jsx` — how sections are structured
- `src/components/PricingCard.jsx` — card styling reference
- `src/data/content.js` — bilingual content pattern
- `tailwind.config.js` — design tokens available
- `AZUL_BUSINESS_PLAN.md` — full business context for any node label questions

## Ask

Read the reference files first. Then propose the specific edge/connection list you'll wire (which nodes connect to which) before writing code — I want to approve the structure before you build. After approval, ship the diagram, run the build, and confirm it looks correct.
