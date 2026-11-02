// Run against the root landing page (not review-booster):
// npm run build && npx vite preview --port 4173, then
// LANDING_URL=http://127.0.0.1:4173 node tests/landing-browser.cjs
// Requires Playwright + Chromium in the test environment; optional CHROME_PATH.
const { chromium } = require('playwright')
const assert = require('node:assert/strict')

const base = process.env.LANDING_URL || 'http://127.0.0.1:4173'
const removed = ['review-booster', 'social-media-ai', 'website-build', 'found-everywhere', 'ai-answering-service', 'ai-facebook-ads', 'custom-ai-agents']

// Clicks the header EN/ES toggle and checks a section's heading changes language.
async function checkToggle(page, selector, en, es) {
  await page.locator('.site-header .languages button', { hasText: 'ES' }).click()
  await page.locator(selector).filter({ hasText: es }).first().waitFor()
  await page.locator('.site-header .languages button', { hasText: 'EN' }).click()
  await page.locator(selector).filter({ hasText: en }).first().waitFor()
}

;(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US', reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto(base)
  await page.getByRole('heading', { level: 1 }).waitFor()
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1)
  assert.deepEqual(await page.locator('.home-studio > section.section[id]').evaluateAll((els) => els.map((e) => e.id)), ['how-it-works', 'included', 'pricing', 'faq', 'get-started'])
  assert.equal(await page.locator('#case-studies').count(), 0, 'case studies stay hidden')
  assert.equal(await page.locator('.offer-steps > li').count(), 3)
  assert.equal(await page.locator('.offer-items > li').count(), 3)
  assert.equal(await page.locator('#pricing .offer-card').count(), 1)
  assert.match(await page.locator('#pricing .offer-price').innerText(), /\$120/)
  assert.match(await page.locator('#pricing .offer-setup').innerText(), /\$2,500/)
  assert.equal(await page.locator('#faq .faq button').count(), 5)
  assert.ok(await page.locator('#how-it-works a', { hasText: 'Book a call' }).count())
  assert.equal(await page.locator('a[href="#demo"], a:has-text("Try the demo"), .ai-pill').count(), 0, 'no demo CTAs until a real demo exists')

  await checkToggle(page, '#how-it-works h2', 'They hire the one that answers first', 'Contratan a la que contesta primero')
  await checkToggle(page, '#included h3', 'Speed-to-lead agent', 'Agente de respuesta inmediata')
  await checkToggle(page, '#pricing h3', 'The Azul package', 'El paquete Azul')
  await checkToggle(page, '#faq button', 'Does it speak Spanish?', '¿Habla español?')
  await checkToggle(page, '#get-started h2', 'every homeowner gets', 'que recibe cada cliente')
  await checkToggle(page, '.site-banner-headline', 'speed-to-lead agent', 'agente de respuesta inmediata')
  await page.locator('.site-header .languages button', { hasText: 'ES' }).click()
  await page.waitForFunction(() => document.title.includes('respuesta inmediata') && document.documentElement.lang === 'es')
  await page.locator('.site-header .languages button', { hasText: 'EN' }).click()
  await page.waitForFunction(() => document.title.includes('speed-to-lead'))

  // No link anywhere on the main routes points at a removed service.
  for (const path of ['/', '/services', '/about', '/contact', '/services/ai-lead-agent', '/work', '/free-report']) {
    await page.goto(base + path)
    await page.getByRole('heading', { level: 1 }).first().waitFor()
    const hrefs = await page.locator('a[href]').evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    for (const slug of removed) assert.ok(!hrefs.some((h) => h.includes(`/services/${slug}`)), `${path} links to ${slug}`)
    assert.ok(!hrefs.some((h) => h.includes('buy.stripe.com')), `${path} links to an old Stripe checkout`)
  }

  await page.goto(base + '/services')
  await page.locator('.lab-service-tabs').waitFor()
  assert.equal(await page.locator('.lab-service-tabs [role="tab"]').count(), 3)
  await checkToggle(page, '.lab-hero h1', 'Good work deserves', 'Un buen trabajo merece')
  await page.locator('#service-tab-1').click()
  assert.ok(await page.locator('.lab-call-window').isVisible())
  await page.keyboard.press('ArrowRight')
  assert.ok(await page.locator('.lab-review-window').isVisible())
  for (const [index, price] of [[0, '$120'], [1, '$2,000'], [2, '$1,500']]) {
    await page.locator(`#plan-tab-${index}`).click()
    assert.equal(await page.locator('.lab-price-value strong').innerText(), price)
  }
  await page.locator('#plan-tab-0').click()
  assert.match(await page.locator('.lab-price-note').innerText(), /2,500/)
  await page.locator('.lab-faq summary').first().click()
  assert.notEqual(await page.locator('.lab-faq details').first().getAttribute('open'), null)

  await page.goto(base + '/contact')
  await checkToggle(page, 'h1', 'your next lead', 'tu próximo cliente')

  await page.goto(base + '/about')
  await checkToggle(page, '.about-prose p', 'Azul brings it together in one package', 'Azul lo reúne todo en un solo paquete')

  // Phone width: no horizontal scroll on the new pages.
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/', '/services', '/contact']) {
    await page.goto(base + path)
    await page.getByRole('heading', { level: 1 }).first().waitFor()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    assert.ok(overflow <= 1, `${path} overflows by ${overflow}px at phone width`)
  }

  assert.deepEqual(errors, [])
  await browser.close()
  console.log('landing-browser: PASS')
})().catch((error) => { console.error(error); process.exit(1) })
