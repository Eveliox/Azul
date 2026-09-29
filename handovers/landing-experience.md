# Public landing-page redesign

Scope: the **root Vite app** served by the `azul` Vercel project at `azulwebdev.com`. No changes to the `review-booster/` app, Vapi webhook, or database are required.

## Page journey

Hero + interactive call example → selected work → four visual services → navy audio example → four active prices → onboarding + compact local-business introduction → FAQ → contact.

- `src/App.jsx`: page composition, responsive navigation, pricing, accessible FAQ and contact form.
- `src/components/CallExperience.jsx`: manual/play/pause visual call walkthrough and user-triggered speech preview.
- `src/components/LandingSections.jsx`: project gallery/native dialog and service previews.
- `src/data/experience.js`: new EN/ES copy, fictional call script, featured-site notes.
- `src/experience.css`: layout, styling, animations, mobile and reduced-motion rules.

## Demo behavior

The visual walkthrough uses fictional Alex Rivera / (305) 555-0123. It does not contact Vapi, request a microphone, place calls, send messages, or book anything. Users can choose each step, play/pause the sequence, and change its language separately from the page. Reduced motion uses a manual Next step control. Timers pause when the demo leaves the viewport or the tab is hidden.

The audio uses the browser's Speech Synthesis API, not a recording of Clara or the deployed Vapi assistant. This is disclosed next to the controls. Playback requires a click; play/pause/resume/stop and separate EN/ES controls are present. Changing languages, leaving the section, hiding the tab, or unmounting cancels audio. The written script stays available if speech synthesis is unavailable or errors. The waveform is decorative, not a live audio measurement.

For a true Vapi voice showcase, replace this with an approved fictional-call recording (no real caller/patient audio) and a native audio player. No recording was available in the repo.

## Work images

New WebP assets are public homepage captures from the existing portfolio URLs, taken during this implementation:
- `public/aspire-roofing-preview.webp`
- `public/vitality.webp`
- `public/caley-insurance-preview.webp`

The older JPG/PNG assets were project photos, not screenshots; they remain untouched. New captures total about 175 KB. Galleries lazy-load images, with fixed containers to avoid layout jumps. Project notes describe design goals/focus, not unverified sales results. Confirm permission and project attribution before marketing publication, as with the previous portfolio.

## Credibility / pricing

- Removed the hardcoded 3,000+ leads, 4.9 ratings, invented client dashboard metrics and unsupported scarcity banner from the rendered page.
- Website remains **$50/month + $499 setup** in both languages. Other individual service prices unchanged.
- Four active pricing entries only. Social Media AI and AI Facebook Ads appear in a compact Coming soon strip; no fake/disabled waitlist CTA or checkout link.
- Removed the old bundle promotion and unverifiable $1,075 savings comparison. Visitors can request a scoped combination instead; existing Stripe products/prices were NOT changed.
- Updated active review/answering features and FAQs to avoid unsupported integrations, automatic social publishing, SMS availability, and guaranteed outcomes.
- Existing Calendly, individual-service Stripe, Formspree, WhatsApp and social destinations preserved. Contact inputs now have associated labels. No real form submissions were made during tests.
- Replaced missing Vite favicon with Azul favicon and added page description.

## Motion/accessibility

No Lenis/scroll interception in the new page; native anchor navigation and native smooth scrolling only. Reduced-motion users get instant native scroll, visible unanimated reveal content, no decorative loops, and manual demo steps. Project dialog supports focus containment, Escape and focus restoration. FAQ includes expanded/control semantics. Mobile controls are tappable rather than hover-only.

## Checks

```sh
npm run build
npm test
npm run dev -- --host 127.0.0.1 --port 4173
```

Browser suite: `tests/landing-browser.cjs`. Requires Playwright in the test environment and its Chromium browser (or `CHROME_PATH` pointing to an installed Chrome). For a local optional install: `npm install --no-save --package-lock=false playwright`, then `npx playwright install chromium`.

```sh
LANDING_URL=http://127.0.0.1:4173 node tests/landing-browser.cjs
```

`SCREENSHOT_DIR` optionally saves desktop/mobile captures. Suite covers page order, prices, demo navigation and pause, project modal/focus, service previews, deterministic speech controls, unavailable-audio fallback, FAQ, contact wiring (without submitting), EN/ES at 1440/768/390/320px and reduced motion. Audio uses a stub in automated testing; listen on the actual target devices before launch. No Lighthouse score or real-user performance result is claimed.

Deploy only the root `azul` project for these changes; no Supabase migrations or environment variables needed.
