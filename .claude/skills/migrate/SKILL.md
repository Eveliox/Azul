---
name: migrate
description: Guides a Review Booster database change into production Supabase. Checks the migration file is additive, re-runnable and locks down new tables, runs it in a throwaway Postgres, then walks the user through backing up and running it in the Supabase SQL Editor and gives a query to confirm it worked. Use when a change touches review-booster/supabase/, adds a table or function, or the user asks to apply or run a migration.
argument-hint: "[migration file] (default: migrations not yet in git history on origin/main)"
---

# Migrate

**Target:** $ARGUMENTS

There is no Supabase CLI or `psql` on this machine and the local `.env` can't reach the database, so Claude never runs SQL against production. The user runs it in the dashboard. Claude prepares, checks, and verifies.

Stop condition: if the target is given and isn't a file under `review-booster/supabase/migrations/`, ask which file. If no target is given and every migration file is already on `origin/main`, ask which one to apply.

## Steps

1. **Pick the files.** Empty target → migration files that `git log origin/main -- <file>` doesn't list, in filename (date) order. Show the list.
2. **Check each file.** Read it whole. Flag, and stop before step 4 on anything HIGH:
   - HIGH: `drop table`, `drop column`, `truncate`, `delete from`, `update` on existing rows without a narrow `where`, `alter column ... type`, or a `not null` added to an existing column without a default.
   - HIGH: a new table without both `enable row level security` and `revoke all ... from public, anon, authenticated` (the loop at the bottom of `20261008_agent_operations.sql` is the pattern).
   - MED: not re-runnable (`create table` without `if not exists`, `create function` without `or replace`, `add constraint` without a preceding `drop constraint if exists`).
   - MED: no `begin; ... commit;` around the file.
   - Expected and fine: `drop trigger if exists` right before re-creating the same trigger, and `revoke`.
3. **Run it locally.** `cd review-booster && npm run test:database` (PGlite, never production). If the new file isn't covered by `scripts/test-agent-database.mjs`, say so, and offer to add an `await db.exec(...)` of it, run twice, to that script. Also confirm `supabase/schema.sql` includes the change; if not, offer to update it.
4. **Walk the user through it, one step at a time:**
   1. **Backup.** Supabase → Database → Backups: confirm one from the last day (paid plan). Free plan: Table Editor → export `rb_clients` and `rb_review_requests` as CSV.
   2. **Run.** Offer to copy the file to the clipboard (`pbcopy < <file>`, only after they say yes). Supabase → SQL Editor → New query → paste → Run. One file per query, in order.
   3. **Supabase warnings.** The editor flags "destructive operations" and "tables without RLS" by pattern. If the file passed step 2, explain which lines triggered it (usually `drop trigger if exists`, `revoke`, or RLS enabled inside a `do $$` loop the scanner can't read) and that it's safe to run as-is. If they paste a warning that step 2 didn't anticipate, read the file again before answering.
   4. **Verify.** Give them a query for exactly what this migration created. For tables, always:
      ```sql
      select relname as name, relrowsecurity as rls_on,
             has_table_privilege('anon', oid, 'select') as anon_can_read
      from pg_class where relname in (<new tables, plus rb_clients and rb_review_requests>) order by relname;
      ```
      Expect one row per table, `rls_on = true` (views show `false`, which is fine) and `anon_can_read = false` everywhere. Any `anon_can_read = true` → stop and write a fix migration before anything else ships.
5. **Hand off.** Once they confirm the verify output, the dependent code can ship (`/ship`). Never push code that needs this migration before step 4.4 is confirmed.

## Output

After step 3, before walking through step 4:

```
Migrate: <N> file(s) · <file names>
Checks: <OK | HIGH/MED findings at file:line>
Local run: ✅|❌ test:database · schema.sql <in sync | needs update>
Next: back up, then run <first file> in the SQL Editor
```
