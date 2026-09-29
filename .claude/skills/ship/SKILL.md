---
name: ship
description: Push and deploy. Runs the review skill on unpushed commits and stops on FIX FIRST, shows the commits about to go out, asks for an explicit yes, pushes (never force), then waits for the deploy and runs the smoke checks from CLAUDE.md and reports the result. Human-only; run with /ship.
disable-model-invocation: true
---

# Ship

**Input:** $ARGUMENTS (none expected. If anything is passed, ask what it means before doing anything.)

Stop condition: if CLAUDE.md is missing, or doesn't give the default branch, remote, how deploys happen, and a smoke check, say what's missing and stop.

Never force-push (`--force`, `-f`, `--force-with-lease`, `+refspec`). Never deploy past a failing check. Never rebase, merge, reset, or stash to make a push work. Never call an endpoint that messages people, sends email or SMS, or spends money as a "smoke check".

## Steps

1. **Preconditions.** Read CLAUDE.md: default branch, remote, the deploy mechanism, deploy-status source, smoke checks, rollback. Then check, stopping with the reason if any fails:
   - On the default branch (`git branch --show-current`).
   - No uncommitted changes to tracked files (`git status --porcelain --untracked-files=no` is empty), so the checks test exactly what ships. Untracked files are fine; mention them.
   - `git fetch <remote>`, then `git rev-list --left-right --count <remote>/<branch>...HEAD`. If behind > 0 → stop: "remote has N commits you don't have, pull first". If ahead = 0 → stop: "nothing to ship".
2. **Review.** Run the `review` skill with the range `<remote>/<branch>..HEAD`. If it returns FIX FIRST, print its report and stop.
3. **Confirm.** Show:
   - `git log --oneline <remote>/<branch>..HEAD`
   - `git diff --stat <remote>/<branch>..HEAD` (last line only if long)
   - What will deploy, per CLAUDE.md (e.g. "this push deploys both apps").
   Then ask: "Type **yes** to push and deploy." Anything other than an explicit yes → stop, nothing pushed.
4. **Push.** `git push <remote> <branch>`. If rejected, report the error and stop.
5. **Deploy.** Follow CLAUDE.md:
   - If a push triggers the deploy, find the deployments for the pushed SHA using the status source in CLAUDE.md, deriving `<owner>/<repo>` from `git remote get-url <remote>`. Poll about every 15s until every deployment for the SHA reports `success` or `failure`/`error`, up to 10 minutes. If none appear within 3 minutes, report that and go on to smoke checks.
   - If CLAUDE.md gives a deploy command instead, run it for each affected app. If it fails, stop and report.
   - If any deployment fails, stop and report. Skip the smoke checks, because production still serves the previous deploy.
6. **Smoke check.** Run every smoke check in CLAUDE.md exactly as written (GET only), including any expected body. Record status and pass/fail for each.
7. **Report.** On smoke failure, show the rollback instructions from CLAUDE.md but don't perform them.

## Output

```
<SHIPPED | STOPPED: <reason> | PUSHED, DEPLOY FAILED | DEPLOYED, SMOKE FAILED>
Pushed: <N> commits → <remote>/<branch> (<old>..<new>)     (or "nothing pushed")
Deployed: <project> ✅|❌ <url> · <project> ...
Smoke: <url> <status> ✅|❌ · ...
Left: <what needs doing next, e.g. rollback steps, or "nothing">
```
