# Azul — 15-Second Motion Reel Prompt

> A self-contained brief for an HTML/SVG/CSS motion graphics piece. Open this file, copy the block under **Prompt** (between the `===` fences), paste it into a fresh Claude session running Opus 4.6 or Opus 4.7, and ask it to render the result as a single self-contained HTML file.

---

## Model note

**"Claude Opus 5.5" doesn't exist.** Latest Claude Opus as of 2026 is **4.7**. Any of these can execute the prompt:

- **Opus 4.7** (`claude-opus-4-7`) — recommended, best motion craft
- **Opus 4.6** (`claude-opus-4-6`) — fine, slightly less polish
- **Sonnet 4.6** (`claude-sonnet-4-6`) — fast and cheap, good first draft

Any of them running in Claude Code CLI, the Claude desktop/web app, or an Agent SDK session will work.

## How to use

1. Open this file.
2. Select everything between the two `===` fences below and copy it.
3. Paste into a fresh Claude Opus 4.7 session.
4. Add this one line at the end before you send: *"Render this as a single self-contained HTML file — one `<html>` document, no external assets, no CDN scripts, no imported fonts beyond system or Google-Fonts-via-`<link>`."*
5. Save the response as `azul-reel.html` and open in Chrome.
6. To get a video: open DevTools → Rendering → Capture node screenshots at 60fps, or use OBS / QuickTime / Chrome's built-in screen recording.

The brief is for a **15-second loop** at 60fps (900 frames) at 1920×1080. Everything is pure SVG + CSS keyframes + a tiny JS timeline — no WebGL, no video elements, no external image hosts. The receiving model will inline everything.

---

## Brand context (for your reference, not part of the prompt)

- **Azul** = Spanish for "blue". It's a bilingual AI growth system for South Florida home-service businesses (roofing, HVAC, plumbing, pools).
- **The moat is bilingual-by-default.** Every piece of the system runs in English and Español. The video should feel that at a cellular level — type flipping languages, dual rhythm.
- **The audience** is an owner-operator — hands on a job site, phone in a tool belt, bilingual customers. Not a Fortune 500 marketing lead. The piece should feel confident but human, not glossy tech-bro.
- **The dream line** on the live site: *"The dream starts with you. We make it known."* · *"El sueño empieza contigo. Nosotros lo damos a conocer."* — this is the emotional backbone.
- **Palette** (inferred from the Azul brand name + current site accents):
  - Background: deep ocean navy `#06102A`
  - Primary accent: electric cyan `#4FB7FF` (Miami water)
  - Warm white: `#F2F0E8`
  - Sunset coral: `#FF8E6B` (sparks, stars)
  - Mint success: `#7CE3B0` (counters)
- **Typography vibe:** editorial serif for the dream line (Instrument Serif, Fraunces, or Söhne Breit feel); clean geometric sans for everything else (Inter, Söhne, Satoshi); monospace small-caps for the location/section eyebrows.
- **Primary CTA:** `azulwebdev.com`

---

## Prompt

Copy the block below (everything between the `===` fences) into your Claude Opus session.

===

You are a world-class motion graphics designer with a background in Pentagram-style editorial branding, Apple keynote stage reveals, and the kinetic typography lineage of Kyle Cooper and Jessica Walsh. You design in SVG and CSS the way an animator thinks in After Effects — in beats, easing, breath, and intentional restraint.

Design and build a **15-second, 60fps, 1920×1080, looping motion graphics piece** for a company called **Azul**. Deliver it as **one self-contained HTML file** with inline SVG, CSS keyframes, and a tiny vanilla-JS timeline runner — no external JS libraries, no external image hosts, no video elements. Fonts: either system stack or a single Google Fonts `<link>` is permitted.

### Who Azul is (one paragraph you must internalize)

Azul is the bilingual AI growth system for South Florida home-service businesses — roofers, HVAC pros, plumbers, pool guys. Every surface of the product (reviews, local SEO, AI phone answering, the website) runs natively in English and Español. The audience is an owner-operator who's on a roof or in a crawlspace right now, not sitting in a boardroom. The dream-line on their homepage is *"The dream starts with you. We make it known."* / *"El sueño empieza contigo. Nosotros lo damos a conocer."* That duality — one business, two languages, zero friction — is the entire brand.

### Palette (use these exact hex values)

- Background: `#06102A` (deep ocean navy — the Azul)
- Primary accent: `#4FB7FF` (electric cyan — Miami water, Google pin ripple)
- Warm white: `#F2F0E8` (type, UI chrome — never pure `#FFFFFF`)
- Sunset coral: `#FF8E6B` (stars, sparks, review bursts)
- Mint success: `#7CE3B0` (counters, growth beats)

### Typography

- Dream line: editorial display serif, large, slight italic optical sizing (Instrument Serif, Fraunces, or similar).
- Everything else: a crisp geometric sans (Inter, Söhne, Satoshi — Inter via Google Fonts is fine).
- Section eyebrows and timecode-style labels: uppercase monospace small-caps.
- All weights/sizes should feel art-directed — not a single `font-size: 16px` moment.

### Timing & scene breakdown (hit these marks within ±100ms)

**Beat 1 · 0.00 – 2.80s — "The dream"**
- Black. One warm pinpoint of coral `#FF8E6B` center-left, like a star over a horizon.
- A thin cyan horizon line draws left-to-right in 1.2s with a stroke-dash animation.
- Editorial serif types in word-by-word (not letter-by-letter — too twee): **"The dream starts with you."** in `#F2F0E8`.
- Below it, 0.3s delayed, same words in Spanish at 55% opacity in the same serif: **"El sueño empieza contigo."**
- Small eyebrow top-left: `MIAMI, FL · 25.76° N, 80.19° W` in cyan uppercase mono.

**Beat 2 · 2.80 – 5.20s — "We make it known."**
- The horizon line splinters upward into an abstract Miami skyline silhouette (palm tree + 4-5 simple building rectangles, max — abstracted, not literal). The pinpoint rises and transforms into a Google-style location pin in cyan.
- The pin pulses outward: three concentric cyan ring ripples, each fading as it expands.
- Dream type crossfades out. In its place: **"We make it known."** / **"Nosotros lo damos a conocer."** — slightly smaller than the dream line, both lines visible together, EN white and ES in cyan at 70% opacity.

**Beat 3 · 5.20 – 9.60s — "One system, two languages"**
- Skyline retracts into a single mark. The location pin becomes the center of a system diagram.
- Four pills orbit in from off-canvas, 0.4s apart, with cubic-bezier(0.22, 1, 0.36, 1) easing:
  1. **top-right** — a 5-pointed coral star burst → label flips every 0.6s: `5-star reviews, automated` ⇄ `Reseñas automáticas de 5 estrellas`
  2. **right** — a chat bubble with "AI" inside → label flips: `AI answers in English o Español` ⇄ `La IA contesta en inglés o español`
  3. **bottom-right** — a Google "G" mark + a tiny ChatGPT-style spark glyph beside it → label flips: `Found on Google · Named by AI` ⇄ `Visible en Google · Nombrado por la IA`
  4. **bottom** — a phone with an SMS tail → label flips: `Never miss a call` ⇄ `Nunca pierda una llamada`
- Each pill has a subtle 2px cyan outline, no fill, warm white text, pulse-breath at 0.8Hz.

**Beat 4 · 9.60 – 12.40s — "The proof"**
- Pills collapse toward center. Three mint `#7CE3B0` counters animate from 0, counting up fast with monospace numerals (not uniform speed — ease-out so they land with weight):
  - `1,247` → label below in warm white sans: `calls answered this month`
  - `428` → `5-star reviews collected`
  - `60` → `Miami neighborhoods served`
- Labels mirror on the right in Spanish at 55% opacity: `llamadas contestadas este mes`, `reseñas de 5 estrellas recibidas`, `barrios de Miami atendidos`.
- Beneath the three counters, a thin cyan rule draws left-to-right in 0.6s, then under it: **"Two languages. One system."** / **"Dos idiomas. Un sistema."** — EN on top in white, ES below in cyan at 70%, both large sans.

**Beat 5 · 12.40 – 15.00s — "Lockup"**
- Everything scales down to a single central cluster that resolves into the **azul** wordmark: lowercase, editorial serif (not sans), tight tracking. The `a` has a subtle coral dot inside the counter — a star secretly living inside the first letter.
- Below the wordmark in uppercase mono small-caps: `BILINGUAL AI GROWTH · MIAMI`
- At the bottom, a pill-shaped CTA button with cyan 2px outline, warm white text: `azulwebdev.com`. The button has a slow 1.2s breath-pulse (scale 1.0 → 1.03 → 1.0).
- Hold the final frame from 14.00s to 15.00s before looping (so the full loop reads clean on repeat).

### Motion craft directives (non-negotiable)

- **Easing:** no linear transitions anywhere. Use `cubic-bezier(0.22, 1, 0.36, 1)` for entrances, `cubic-bezier(0.4, 0, 0.68, 0.06)` for exits. Counter ticks use `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Breath:** every static-feeling element should have a subtle 1-2% scale or 1-2px drift at 0.6-1Hz so nothing feels frozen.
- **Type reveals:** word-by-word or line-by-line, never letter-by-letter (unless it's the counter numerals). Clipping masks over y-shifts, not just opacity fades.
- **Language rhythm:** EN and ES should feel like partners, not translations. ES types in 0.2-0.4s after EN, slightly dimmer, slightly smaller — like a shadow dancing in step. **Never show English alone for more than 2 seconds.**
- **Negative space:** nothing fills the frame edge-to-edge. 10% margin minimum. The dream begins and ends with lots of black.
- **No gratuitous particles.** Three to five intentional sparks per beat max. This is editorial motion, not After-Effects-template motion.
- **Loop grace:** the final frame of beat 5 must dissolve cleanly into the first frame of beat 1 if the piece loops.

### Technical requirements

- Single `.html` file. All CSS in a `<style>` tag, all JS in a single `<script>` tag at the bottom.
- Use CSS `@keyframes` for continuous animations (breath, pulse, orbit). Use a tiny JS timeline runner (an array of `{ time: ms, action: () => void }` entries) to trigger scene transitions. Do not use any animation library — no GSAP, no anime.js, no framer.
- SVG for every graphic element (skyline, pin, pills, star, phone, counters). No raster images, no PNGs, no SVG via `<img src>`.
- Fonts: either a `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap">` tag, or a system stack fallback. Nothing else.
- The piece must loop forever. Add a 500ms gap before restart, not a hard cut.
- Add a tiny `?debug` query-string switch that overlays a timecode HUD (top-right, mono, cyan) showing `t = 00:00.000` so I can verify the beats land. Hide the HUD by default.

### Deliverable

Return the full HTML file in a single code block. Do not include a preamble, explanation, or usage notes. The file should open in Chrome and begin playing immediately. No user interaction required.

Make it the kind of 15 seconds a creative director watches and says *"ship it."*

===

---

## After you have the HTML

- Open `azul-reel.html` in Chrome. Resize to 1920×1080 or use DevTools device mode.
- Open `azul-reel.html?debug` to show the timecode HUD if you need to verify beat timing.
- To screen-record: Chrome DevTools → three-dot menu → More tools → Rendering → check "Paint flashing" off, then use QuickTime screen recording (Mac) or OBS (any OS) on the Chrome window. Record 20 seconds, trim to the first clean loop in any editor.
- If a specific beat feels off, go back to the Claude session and say: *"Beat 3 feels crowded — reduce the orbit radius by 15% and extend the pill reveal timing to 0.5s intervals. Return the full file."* Iterate 2-3 rounds, not 20. Trust the designer.

## Not shipping to prod from this file

This is a creative asset reel for pitches, demos, and social posts — not a landing-page animation. Keep the final `.html` and the eventual `.mp4` in `/public/assets/` (if you decide to add it to the site) or in a shared drive. Don't inline this into `src/`.
