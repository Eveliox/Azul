---
name: ui-check
description: Browser check for Review Booster's dashboard. Builds the UI, serves it locally with fake data, runs the Playwright scripts (review screens + AI Agents flows, desktop and phone widths), looks at the screenshots, and reports PASS/FAIL. Never touches production or real customers. Use after changing anything under review-booster/src, or when asked to test or screenshot the dashboard.
argument-hint: "[agents|review] (default: both)"
---

# UI check

**Scope:** $ARGUMENTS (empty = both scripts; `agents` = `scripts/test-agent-ui.cjs` only; `review` = `scripts/test-review-ui.cjs` only. Anything else: ask.)

Stop condition: if `review-booster/scripts/test-agent-ui.cjs` or `test-review-ui.cjs` is missing, say so and stop.

Local only. `dev-server.js` serves in-memory sample data and never loads `.env`; the agent script also intercepts every `/api/` call with fixtures. Never point `UI_TEST_ORIGIN` at a deployed URL.

## Steps

1. **Find Playwright.** It is not a dependency of this project. In order:
   - `cd review-booster && node -e "console.log(require.resolve('playwright'))"`. If that works, leave `PLAYWRIGHT_MODULE` unset.
   - Otherwise search: `find ~ -maxdepth 5 -type d -path '*/node_modules/playwright' -not -path '*/.Trash/*' 2>/dev/null | head -1` (last known: `~/helloyoulabs/node_modules/playwright`). Use that directory as `PLAYWRIGHT_MODULE`.
   - None found → stop and tell the user: install with `npm i -D playwright && npx playwright install chromium` in `review-booster`, and ask before doing it.
2. **Build without sign-in keys.** The scripts sign in with a legacy access key, so the build must not include Supabase sign-in:
   `cd review-booster && VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY= npm run build`
   (Blank shell vars override any value in `.env`. Verified.) Build failure → report it and stop.
3. **Serve.** If `lsof -ti tcp:3014` shows a process, stop and say the port is busy rather than killing an unknown process. Otherwise start `PORT=3014 node dev-server.js` with `run_in_background`, then wait until `curl -s -o /dev/null http://127.0.0.1:3014/admin` succeeds (max ~10s).
4. **Run** the scripts in scope from `review-booster/`, each with `PLAYWRIGHT_MODULE` set if step 1 found one. Keep the PASS line or the first error and its stack line.
5. **Look at the screenshots** with Read: `/tmp/azul-operations-desktop.png`, `/tmp/azul-operations-mobile.png` (agents), `/tmp/azul-review-regression.png` (review). Note anything visibly broken: overlapping text, cut-off content, unstyled elements, empty panels. The scripts don't catch these.
6. **Clean up.** `pkill -f "node dev-server.js"`. Then rebuild with a normal `npm run build`, so `dist/` doesn't stay a no-sign-in build.

## Output

```
UI check: <PASS | FAIL>
agents: ✅|❌|skipped <PASS line or first error>
review: ✅|❌|skipped <PASS line or first error>
Screenshots: <looks right | issues: ...>
```
