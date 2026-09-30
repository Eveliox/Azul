import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

// Fetches a visitor-supplied homepage. The URL comes from the public, so every
// hop (including redirects) must resolve to a public address: otherwise the
// form could be used to reach Vercel-internal or private-network hosts.

function isPrivateV4(ip) {
  const [a, b] = ip.split('.').map(Number)
  return a === 0 || a === 10 || a === 127 || a >= 224
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 198 && (b === 18 || b === 19))
}
export function isPrivateAddress(ip) {
  if (isIP(ip) === 4) return isPrivateV4(ip)
  const v6 = ip.toLowerCase()
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isPrivateV4(mapped[1])
  return v6 === '::' || v6 === '::1' || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6) || v6.startsWith('ff') || v6.startsWith('::ffff:')
}

async function assertPublic(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '')
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal') || host.endsWith('.local')) throw new Error('private host')
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true })
  if (!addresses.length || addresses.some(a => isPrivateAddress(a.address))) throw new Error('private host')
}

async function readLimited(res, maxBytes) {
  const reader = res.body.getReader()
  const chunks = []
  let size = 0
  while (size < maxBytes) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    size += value.length
  }
  reader.cancel().catch(() => {})
  return Buffer.concat(chunks).subarray(0, maxBytes).toString('utf8')
}

/** Returns { finalUrl, html } or throws. */
export async function fetchSite(url, { timeoutMs = 10000, maxBytes = 1_500_000, maxRedirects = 4 } = {}) {
  const signal = AbortSignal.timeout(timeoutMs)
  let current = new URL(url)
  for (let hop = 0; hop <= maxRedirects; hop++) {
    if (!['http:', 'https:'].includes(current.protocol) || (current.port && !['80', '443'].includes(current.port))) throw new Error('unsupported url')
    await assertPublic(current.hostname)
    const res = await fetch(current, {
      redirect: 'manual',
      signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AzulFreeReport/1.0; +https://azulwebdev.com/free-report)', Accept: 'text/html,*/*;q=0.8' },
    })
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      res.body?.cancel().catch(() => {})
      current = new URL(location, current)
      continue
    }
    if (!res.ok) throw new Error(`status ${res.status}`)
    return { finalUrl: current.href, html: await readLimited(res, maxBytes) }
  }
  throw new Error('too many redirects')
}
