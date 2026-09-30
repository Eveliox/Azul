// Saves an unlocked free report to Supabase (table free_report_leads, see
// supabase/free-report.sql) and, when Resend is configured, emails the team.
// Plain fetch keeps the landing site free of server dependencies.

export async function saveLead(row) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/free_report_leads`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 300)}`)
}

export async function notifyTeam({ lead, input, report }) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  const to = process.env.FREE_REPORT_NOTIFY_EMAIL
  if (!key || !from || !to) return
  const text = [
    `New free report lead: ${lead.name} <${lead.email}>${lead.phone ? `, ${lead.phone}` : ''}`,
    `Business: ${report.business} (${input.trade}, ${input.city})`,
    `Website: ${input.website || report.website || 'none'}`,
    `Score: ${report.score}/100 · Language: ${lead.language}`,
    '',
    'Gaps found:',
    ...report.findings.map(f => `- [${f.severity}] ${f.id} → ${f.service} ${JSON.stringify(f.values)}`),
  ].join('\n')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: lead.email, subject: `Free report lead: ${report.business} (${report.score}/100)`, text }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`)
}
