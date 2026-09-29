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
 * ── Plug in your intake endpoint here ───────────────────────────────────────
 * Set VITE_JOB_POSTING_ENDPOINT to a small serverless function (for example
 * api/job-posting.js, built like review-booster's api/) that:
 *   - re-checks the fields, consent, file type and 10 MB limit,
 *   - saves the request to a Supabase table (e.g. job_postings),
 *   - emails you the details through Resend, in the visitor's language
 *     setting (pageLanguage) so you know how to reply.
 * Keep the Supabase service key and Resend key in server-only env vars; any
 * VITE_ variable is visible to every visitor.
 *
 * Files: Vercel functions reject request bodies over 4.5 MB, so a 10 MB file
 * can't pass through the function. For files, have the function return a
 * Supabase Storage signed upload URL, upload the file from the browser to that
 * URL, then send the form without the file plus the stored file's path.
 * Until then, the multipart POST below works for files under about 4 MB.
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
