import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

// The scan returns the finished report encrypted (AES-256-GCM with
// FREE_REPORT_SECRET), so the unlock step can hand it over without repeating
// the paid Google lookups, and without the full report being readable in the
// browser before the visitor gives an email.

const keyFor = secret => createHash('sha256').update(String(secret)).digest()

export function seal(payload, secret, ttlMs = 2 * 60 * 60 * 1000) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keyFor(secret), iv)
  const body = Buffer.concat([cipher.update(JSON.stringify({ ...payload, exp: Date.now() + ttlMs })), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url')
}

/** Returns the payload, or null if the token is forged, damaged or expired. */
export function unseal(token, secret) {
  try {
    const raw = Buffer.from(String(token), 'base64url')
    if (raw.length < 29) return null
    const decipher = createDecipheriv('aes-256-gcm', keyFor(secret), raw.subarray(0, 12))
    decipher.setAuthTag(raw.subarray(12, 28))
    const payload = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8'))
    return payload.exp > Date.now() ? payload : null
  } catch { return null }
}
