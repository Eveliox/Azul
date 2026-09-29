---
name: review
description: Pre-commit review by an independent read-only agent. Checks the uncommitted diff (or a commit range you pass) for correctness bugs, missing tests for new behavior, secrets, and leftover debug code, runs the project's checks from CLAUDE.md, and returns SHIP or FIX FIRST with findings ranked by severity at file:line. Use before committing, before shipping, or when asked to review changes. Never edits code.
argument-hint: "[commit range, e.g. HEAD~3..HEAD] (default: uncommitted changes)"
---

# Review

**Target:** $ARGUMENTS

Stop condition: if the target is not empty and is not a valid commit range or single commit, ask what to review. Don't guess. If CLAUDE.md is missing or doesn't list check commands, say so and stop.

This skill never edits code, stages, commits, or stashes, and neither does the agent it spawns.

## Steps

1. **Resolve the target.**
   - Empty → uncommitted work: staged + unstaged + untracked files. Diff command: `git diff HEAD` plus `git ls-files --others --exclude-standard` for new files (the agent reads those whole).
   - A range `A..B` or single commit `C` → validate with `git rev-parse --verify` on each end (`C` means `C~1..C`). Diff command: `git diff A..B`.
   - If the diff is empty, report `Nothing to review` and stop.
2. **Gather.**
   - From CLAUDE.md: the app table (paths) and the check command for each app, and whether a test suite exists.
   - `git diff --stat` for the target → changed paths → which apps they touch. Include only those apps' checks. If nothing maps to an app, include all checks.
3. **Spawn the `diff-reviewer` agent** with a fully self-contained prompt (it cannot see this conversation). Include exactly:
   - Repo root absolute path.
   - What is being reviewed (e.g. "uncommitted changes" or "commits A..B") and the exact diff command(s) from step 1.
   - The check commands to run, verbatim from CLAUDE.md, and the directory to run each from.
   - Whether the project has a test suite (from CLAUDE.md).
   - For a range that isn't the current HEAD, note that the checks run on the working tree, not on the range.
   - "Return only the output format from your instructions."
   Do NOT include your own summary of the change or what it's meant to do. The reviewer judges the code, not the intent.
4. **Verify the report.** For each finding, confirm the cited `file:line` exists and is related to the diff. Drop any that aren't and say how many were dropped. Don't re-run the checks.
5. **Report** the agent's output in the format below.

## Output

```
<SHIP|FIX FIRST>   checks: <app> ✅|❌ <check> · ...
1. <HIGH|MED|LOW>  <path>:<line> · <problem> → <fix>
...
Untested: <riskiest untested behavior> · verify: <manual steps>
Reviewed: <target> · <N> files · +<added>/−<removed>
```
