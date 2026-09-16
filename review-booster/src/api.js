// Small fetch wrapper for the admin UI.
const KEY = 'azul_admin_key'
export const getAdminKey = () => localStorage.getItem(KEY) || ''
export const setAdminKey = (k) => localStorage.setItem(KEY, k)
export const clearAdminKey = () => localStorage.removeItem(KEY)

export async function api(path, { method = 'GET', body, admin = true } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(admin ? { 'x-admin-key': getAdminKey() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}
