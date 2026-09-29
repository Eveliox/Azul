---
name: wrap-up
description: End-of-session log. Summarizes what changed since the last notes entry (commits and uncommitted work), decisions made, open questions, and the next step, then appends a dated entry to the session notes file named in CLAUDE.md. Warns about uncommitted or unpushed work. Use when stopping for the day, wrapping up, or asked to save progress notes. Never commits or pushes.
argument-hint: "[extra notes: decisions, open questions]"
---

# Wrap-up

**Extra notes:** $ARGUMENTS

Stop condition: if CLAUDE.md is missing or doesn't name the session notes file, say so and stop.

Never `git add`, `commit`, `stash`, or `push`. The only file this skill writes is the notes file.

## Steps

1. **Preconditions.** Read CLAUDE.md for the session notes path, default branch, and remote.
2. **Gather:**
   - The date of the last `## ` entry in the notes file (if the file doesn't exist, use today's start).
   - Commits since then: `git log --since="<that date>" --format="%h %ad %s" --date=short`.
   - Uncommitted work: `git status --short` and `git diff --stat HEAD`.
   - Unpushed commits: `git log --oneline @{u}..HEAD` (skip if no upstream).
   - Decisions and open questions: from this conversation and the extra notes above. If there are none, write "none recorded". Never invent them.
   - Next step: the most concrete unfinished thing: a file, a command, or a decision to make.
3. **Append** to the notes file (create it, with a `# Session notes` heading, if missing). Never edit or reorder earlier entries. Use the current local time from `date "+%Y-%m-%d %H:%M"`:

   ```
   ## YYYY-MM-DD HH:MM
   **Changed:** <commits and what they did, in plain words>
   **Decisions:** <decision: why>
   **Open questions:** <...>
   **Half-done:** <uncommitted files and what state they're in, or "nothing">
   **Next:** <one concrete step>
   ```

4. **Verify.** Read the last lines of the notes file back and confirm the entry is there.
5. **Report** in the format below.

## Output

```
Wrap-up: appended to <notes path> (<YYYY-MM-DD HH:MM>)
⚠ Uncommitted: <N files: paths> · Unpushed: <N commits>   (or "Clean: everything committed and pushed")
Next: <the next step you wrote>
```
