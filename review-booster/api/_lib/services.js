// Azul offers Website Building and Speed-to-Lead Agent only.
// Keep the existing calls ID for compatibility with stored client plans.
export const SERVICE_IDS = ['website', 'calls']

// Returns a clean, de-duplicated list in canonical order; unknown ids are dropped.
export function normalizeServices(input) {
  const list = Array.isArray(input) ? input : []
  return SERVICE_IDS.filter((id) => list.includes(id))
}
