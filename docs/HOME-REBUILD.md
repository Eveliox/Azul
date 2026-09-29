# Azul — stage 1

Run `npm install`, then `npm run dev`. Production check: `npm run build`.

## Completed

Shared React Router layout and Home. All active UI copy lives in `src/data/translations.js`, accessed through the existing LanguageContext. The older components and `content.js` remain inactive for reference.

Page components are in `src/components/site` (Layout, UI, ServiceList). Motion lives in `src/components/motion` and `src/hooks`:

- `useReveal` (hook): plays a paused GSAP timeline when its container scrolls into view, with a 1.5s on-screen failsafe that jumps to the end so content is never left hidden.
- `SplitText`, `SectionEyebrow`, `CountUp`, `ImageReveal`, `MagneticButton`, `Marquee`, `CustomCursor`, `DotGrid`, `Wordmark`, `PageTransition`, `SmoothScroll` (Lenis driven by the GSAP ticker, so ScrollTrigger stays in sync).
- `useReducedMotion` / `useFinePointer` (`src/hooks/useMediaQuery.js`): reduced motion turns every animation off; touch devices skip cursor, magnetic, hover-preview and parallax effects.

Initial hidden states are always set from JavaScript before paint, never in CSS, so the page is fully visible if scripts fail.

## Integration points

- React Router is the only added dependency. Lenis and Framer Motion were already listed.
- Copy `.env.example` to `.env.local` and provide endpoints to activate lead forms. No data is submitted and no success is claimed without an endpoint. Endpoints must validate input and consent, handle abuse protection, and supply the actual PDF. Never put secret API keys in VITE variables.
- Add real PDF assets, client logos, and verified proof metrics. Sample identities and empty metrics are labeled in the UI.
- Connect the floating AI button to the voice agent. Its current dialog offers the repository’s existing Calendly booking URL.
- Confirm `hello@azulwebdev.com` in translations before launch; it is a proposed contact address. Existing Instagram and LinkedIn URLs were retained.
- Privacy, terms, cookies, and future page routes explicitly display temporary content. Publish full policies before enabling collection. No analytics script is installed; preferences are stored locally and emitted through `azul:consent` for a future integration.
- The purpose film (`public/images/purpose-roofers.webm`) is an eight-second pan loop generated from a stock roofing photo. Replace via `VITE_PURPOSE_VIDEO` with real footage.
- Placeholder photos from Unsplash (Unsplash License, free commercial use): who-florida-home (Brian Zajac), purpose-roofers and svc-roofing (Raze Solar), svc-pool (Shoham Avisrur), svc-landscaping (MowCow Lawn & Landscape), svc-home (Sean Foster), svc-hvac (Everett Pachmann), svc-lawn (Michael Smith). `home.jpg` and `miami-purpose.webm` are no longer referenced.
- Local photos were copied from existing repository assets. Original ownership/licensing remains unchanged.
- The design reference was https://www.thekeenfolks.com/; only section structure and motion direction informed the rebuild. No reference brand assets, copy, clients, or statistics are included.
- Hosting must rewrite non-file requests to `index.html` for BrowserRouter routes. Vite already does this locally.

## Next stage

Build the Services overview after user says “next.” Other pages currently use a shared coming-soon view.

## Verification

Production build; browser checks at 1440px and 390px; EN/ES switching; dialog open/Escape; disabled unconfigured downloads; cookie accept/deny/manage and persistence; mobile navigation; direct route reload; reduced-motion video behavior. No browser runtime errors in the interaction check.

Installation reported 15 dependency audit findings (2 low, 4 moderate, 9 high). No broad dependency upgrades were made in this design stage.

## Visual refinement — September 29

Refined the updated GSAP version of Home: height-aware hero with a full wordmark and scroll hint, tighter architecture crop with an overlaid bilingual caption, and a dedicated sticky service preview column. Preview changes follow pointer hover and keyboard focus, with all service names and descriptions remaining unobstructed. Phones use a clean text list. Removed the custom cursor from the shared layout and softened image reveal/parallax movement. Reused existing local imagery; no new packages.

Verified production build and browser interactions at 1440, 1024, 390, and 320 pixels in English and Spanish, with no horizontal overflow or runtime errors. Checked keyboard preview switching and reduced-motion layouts.

## Service previews and Work page

The six service previews now demonstrate product workflows with localized React/CSS illustrations: review request, social planner, responsive website, local search, AI call, and Facebook ad concept. They are labeled illustrative; Website Build uses actual Aspire desktop/mobile captures. No new dependencies.

`/work` contains the five existing repository projects, with industry filtering, empty states, project dialogs, website links, and a discovery CTA. Public-site screenshots captured on September 29, 2026 are stored in `public/images/work/`.

To add a project:

1. Put its screenshot in `public/images/work/`.
2. Add its stable ID, category, image path, and live URL to `src/data/workProjects.js`.
3. Add the matching title, description, tags, and imageAlt to `work.projects` in both languages in `src/data/translations.js`.

The page updates automatically from these entries. This is a public portfolio, with projects managed through the files rather than an admin dashboard.

Verified all six preview states, five projects, industry/empty-state filters, modal Escape, destination URLs, Spanish copy, 320/390px widths, and direct route reload. Production build passes.
