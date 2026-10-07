export class AgentError extends Error {
  constructor(message, status = 400) { super(message); this.status = status }
}
export const uuid = (value) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
export const validEmail = (value) => typeof value === 'string' && value.length <= 254 && /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value)
function text(value, name, max) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new AgentError(`${name} is required (up to ${max} characters).`)
  return value.trim()
}
export function validateEstimate(body) {
  if (!uuid(body.request_key)) throw new AgentError('A valid request ID is required.')
  if (!validEmail(body.customer_email)) throw new AgentError('Enter a valid customer email.')
  if (body.contact_confirmed !== true) throw new AgentError('Confirm this customer may be contacted about this estimate.')
  if (!['en','es'].includes(body.language)) throw new AgentError('Choose English or Spanish.')
  return { request_key: body.request_key, estimate_ref: text(body.estimate_ref, 'Estimate reference', 100), customer_name: text(body.customer_name, 'Customer name', 120), customer_email: body.customer_email.trim().toLowerCase(), estimate_summary: text(body.estimate_summary, 'Estimate details', 3000), language: body.language, contact_confirmed: true }
}
export function validateDraft(body) {
  const subject = text(body.subject, 'Subject', 160)
  if (/[\r\n]/.test(subject)) throw new AgentError('The subject must be one line.')
  return { subject, body: text(body.body, 'Message', 4000) }
}
export function validateSettings(body) {
  if (!['testing','active','paused'].includes(body.mode)) throw new AgentError('Invalid agent mode.')
  if (body.reply_to && !validEmail(body.reply_to)) throw new AgentError('Enter a valid reply-to email.')
  if (body.mode === 'active' && !validEmail(body.reply_to)) throw new AgentError('A reply-to email is required before activation.')
  if (!Number.isInteger(body.monthly_limit) || body.monthly_limit < 1 || body.monthly_limit > 1000) throw new AgentError('Monthly run limit must be between 1 and 1,000.')
  if (!Number.isInteger(body.monthly_budget_cents) || body.monthly_budget_cents < 1 || body.monthly_budget_cents > 100000) throw new AgentError('Monthly AI budget must be between $0.01 and $1,000.')
  return { mode: body.mode, reply_to: (body.reply_to || '').trim(), monthly_limit: body.monthly_limit, monthly_budget_cents: body.monthly_budget_cents }
}
export function readiness(env = process.env) {
  return { worker_enabled: env.AGENTS_ENABLED === 'true', ai_configured: Boolean(env.OPENAI_API_KEY && env.OPENAI_AGENT_MODEL), prices_configured: [env.AGENT_INPUT_USD_PER_MILLION,env.AGENT_OUTPUT_USD_PER_MILLION].every(value=>Number.isFinite(Number(value)) && Number(value)>0), email_configured: Boolean(env.RESEND_API_KEY && env.AGENT_EMAIL_FROM), sending_enabled: env.AGENTS_EMAIL_ENABLED === 'true' }
}
export function reserveCents(env = process.env) {
  // Input is capped at 6,000 UTF-8 bytes, plus <2,000 bytes of instructions/schema.
  // Reserve generously for input + full output; retain reservation on unknown usage.
  if (!readiness(env).prices_configured) throw new AgentError('Configure model pricing before running the worker.', 503)
  return Math.max(1, Math.ceil((16000 * Number(env.AGENT_INPUT_USD_PER_MILLION) + 1000 * Number(env.AGENT_OUTPUT_USD_PER_MILLION)) / 10000))
}
export function estimateCost(usage, env = process.env) {
  return (Number(usage.input_tokens || 0)*Number(env.AGENT_INPUT_USD_PER_MILLION) + Number(usage.output_tokens || 0)*Number(env.AGENT_OUTPUT_USD_PER_MILLION)) / 10000
}
