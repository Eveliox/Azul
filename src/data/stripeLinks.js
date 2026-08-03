// Stripe Payment Link URLs.
// Generate these in your Stripe dashboard: Product catalog → + Add product → + Create payment link.
// Replace the TODO placeholders below with the real URLs (they look like https://buy.stripe.com/xxxxxxxx).
//
// TIP: These URLs work in test mode too — use test-mode links during development, swap to live-mode
// links before you send them to real clients.

export const stripeLinks = {
  // Growth Suite — Founding Client ($399/mo locked for life, first 10 clients)
  foundingClient: 'https://buy.stripe.com/28EcN7cq5bfS7wm9EBc7u02',

  // Growth Suite — Standard ($549/mo, no contract)
  growthSuite: 'https://buy.stripe.com/00wfZjeyd5Vyg2S8Axc7u01',

  // Website Build — one-time setup fee ($499)
  websiteSetup: 'https://buy.stripe.com/cNi6oJdu96ZC8AqaIFc7u03',
}

// Helper: check if a Stripe link is configured (not still a TODO placeholder)
export const isStripeLinkReady = (link) => link && !link.startsWith('TODO_')
