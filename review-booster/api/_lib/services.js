// Services a business can be subscribed to. Shared by the API, the demo server, and the UI.
// This is the source of truth for what a client key is allowed to see in the workspace.
export const SERVICE_IDS = ['website', 'calls', 'reviews', 'seo']

// Returns a clean, de-duplicated list in canonical order; unknown ids are dropped.
export function normalizeServices(input) {
  const list = Array.isArray(input) ? input : []
  return SERVICE_IDS.filter((id) => list.includes(id))
}
