---
name: resume
description: Start-of-session briefing. Reads the latest entry in the session notes file named in CLAUDE.md, git status, recent commits, whether the remote branch has moved, and runs the project's checks, then says in under 10 lines where things were left, what's half-done, and the next concrete step. Use at the start of a session or when asked "where was I", "what's next", or "catch me up". Changes nothing.
---

# Resume

**Input:** $ARGUMENTS (none expected; ignore unless it names a specific area to focus the briefing on)

Stop condition: if CLAUDE.md is missing, or doesn't name the check commands or the session notes file, say exactly what's missing and stop. Don't guess commands.

This skill is read-only. No `git fetch`/`pull`, no installs, no file edits. The only writes allowed are gitignored build output from the check commands.

## Steps

1. **Preconditions.** Read CLAUDE.md. Note: the check command for each app, the default branch and remote, and the session notes path.
2. **Gather** (run in parallel):
   - The notes file: read only the last `## ` entry. If the file doesn't exist, note "no notes yet".
   - `git status -sb` and `git log --oneline -10`.
   - Whether the remote moved, without fetching: compare `git rev-parse <remote>/<branch>` with the hash from `git ls-remote <remote> refs/heads/<branch>`. If they differ and `git cat-file -t <remote hash>` fails, the remote has commits this machine hasn't seen.
3. **Run the checks** from CLAUDE.md for each app. If an app's dependencies aren't installed, report "deps not installed" for it instead of installing. Keep only pass/fail and the first error line.
4. **Decide the next step.** Prefer, in order: fix a failing check → pull if the remote moved → finish half-done (uncommitted) work → the "Next" line from the notes. Make it concrete: a file, a command, or a decision.
5. **Report** in the format below. Under 10 lines. No preamble.

## Output

```
Resume: <one-line state of the project>
Left off: <from the latest notes entry + latest commits>
Half-done: <uncommitted files / unpushed commits, or "nothing">
Remote: <in sync | N ahead | remote has commits not on this machine: pull before working>
Checks: <app> ✅|❌|⚠ <detail> · <app> ...
Next: <one concrete step>
```
