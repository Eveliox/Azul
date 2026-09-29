// Job posting intake for Custom AI Agents. Validation lives here so the
// dropzone and the submit path share one set of rules.

export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'txt']
export const ACCEPT_ATTRIBUTE = '.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'

const extension = name => name.split('.').pop()?.toLowerCase() ?? ''

/** Returns null when the file is usable, otherwise 'type' or 'size'. */
export function validateJobFile(file) {
  // Some systems report an empty MIME type, so the extension decides.
  if (!ACCEPTED_EXTENSIONS.includes(extension(file.name))) return 'type'
  if (file.size > MAX_FILE_BYTES) return 'size'
  return null
}

export class SubmissionUnavailableError extends Error {}

/**
 * Sends one job posting request.
 *
 * `data`: { name, business, email, phone, trade, language, notes, consent,
 *           source: 'file' | 'text' | 'link', file?, text?, link?, pageLanguage }
 *
 * ── Plug in GoHighLevel here ────────────────────────────────────────────────
 * 1. In GoHighLevel: Automation → Workflows → new workflow → trigger
 *    "Inbound Webhook". Copy the webhook URL it gives you.
 * 2. GoHighLevel's inbound webhook only accepts JSON, not file uploads, and any
 *    URL in a VITE_ variable is visible to every visitor. So point
 *    VITE_JOB_POSTING_ENDPOINT at a small serverless function (for example
 *    api/job-posting.js in a Vercel project) that:
 *      - re-checks the fields, consent, file type and 10 MB limit,
 *      - stores the file (Supabase Storage, S3, Drive) and gets a link,
 *      - POSTs JSON to the GoHighLevel webhook URL, kept in a server-only
 *        env var, e.g. { name, business, email, phone, trade, language,
 *        notes, source, text, link, fileUrl }.
 *    No files yet? You can point VITE_JOB_POSTING_ENDPOINT straight at the
 *    GoHighLevel webhook and change the body below to
 *    JSON.stringify(payloadWithoutFile) with a JSON Content-Type.
 * 3. Map the JSON fields to contact fields in the workflow, then add the
 *    actions you want (tag "ai-agent-lead", notify the team, send a text).
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Without an endpoint: local development pretends it worked so the success
 * animation can be reviewed; a production build throws, and the drawer
 * offers a booking link instead of claiming the posting was received.
 */
export async function submitJobPosting(data) {
  if (data.source === 'file' && (!data.file || validateJobFile(data.file))) throw new Error('Invalid file')

  const endpoint = import.meta.env.VITE_JOB_POSTING_ENDPOINT
  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.info('[submitJobPosting] No VITE_JOB_POSTING_ENDPOINT set. Payload:', data)
      return { ok: true, simulated: true }
    }
    throw new SubmissionUnavailableError('Job posting endpoint is not configured')
  }

  const body = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue
    body.append(key, value instanceof File ? value : String(value))
  }
  const response = await fetch(endpoint, { method: 'POST', body })
  if (!response.ok) throw new Error(`Job posting request failed: ${response.status}`)
  return { ok: true }
}
