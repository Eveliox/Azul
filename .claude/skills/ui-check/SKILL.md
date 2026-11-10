---
name: ui-check
description: Browser check for Review Booster's dashboard. Builds the UI, serves it locally with fake data, runs the Playwright scripts (Speed-to-Lead Agent page, plus the older review and AI Agents flows), desktop and phone widths, looks at the screenshots, and reports PASS/FAIL. Never touches production or real customers. Use after changing anything under review-booster/src, or when asked to test or screenshot the dashboard.
argument-hint: "[leads|agents|review] (default: leads)"
---

# UI check

**Scope:** $ARGUMENTS (empty or `leads` = `scripts/test-leads-ui.cjs`; `agents` = `scripts/test-agent-ui.cjs`; `review` = `scripts/test-review-ui.cjs`. Anything else: ask.)

`agents` and `review` test services that were removed from the dashboard in commit 6030d79 (Review Booster and AI Agents tabs). They fail at their first step until those services come back or the scripts are rewritten; say so instead of debugging them.

Stop condition: if the script in scope is missing from `review-booster/scripts/`, say so and stop.

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
5. **Look at the screenshots** with Read: `/tmp/azul-leads-desktop.png`, `/tmp/azul-leads-mobile.png` (leads; the phone one is tall, so crop it to read it), `/tmp/azul-operations-desktop.png`, `/tmp/azul-operations-mobile.png` (agents), `/tmp/azul-review-regression.png` (review). Note anything visibly broken: overlapping text, cut-off content, unstyled elements, empty panels. The scripts don't catch these.
6. **Clean up.** `pkill -f "node dev-server.js"`. Then rebuild with a normal `npm run build`, so `dist/` doesn't stay a no-sign-in build.

## Output

```
UI check: <PASS | FAIL>
leads: ✅|❌|skipped <PASS line or first error>
agents: ✅|❌|skipped <PASS line or first error>
review: ✅|❌|skipped <PASS line or first error>
Screenshots: <looks right | issues: ...>
```
