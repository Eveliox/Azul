// Run against the root landing page (not review-booster):
// npm run build && npx vite preview --port 4173, then
// LANDING_URL=http://127.0.0.1:4173 node tests/landing-browser.cjs
// Requires Playwright + Chromium in the test environment; optional CHROME_PATH.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const { pathToFileURL } = require('node:url')
const path = require('node:path')
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
  const { offerPrices } = await import(pathToFileURL(path.resolve(__dirname, '../src/data/offer.js')))
  const prices = Object.values(offerPrices).filter(Boolean)
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US', reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto(base)
  await page.getByRole('heading', { level: 1 }).waitFor()
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1)
  assert.deepEqual(await page.locator('.home-studio > section.section[id]').evaluateAll((els) => els.map((e) => e.id)), ['how-it-works', 'included', 'faq', 'get-started'])
  assert.equal(await page.locator('#case-studies').count(), 0, 'case studies stay hidden')
  assert.equal(await page.locator('.offer-steps > li').count(), 3)
  assert.equal(await page.locator('.offer-items > li').count(), 3)
  assert.equal(await page.locator('#pricing, .site-banner-price').count(), 0, 'prices stay hidden')
  assert.equal(await page.locator('#faq .faq button').count(), 5)
  assert.ok(await page.locator('#get-started a', { hasText: 'Book a call' }).count())
  assert.equal(await page.locator('a[href="#demo"], a:has-text("Try the demo"), .ai-pill').count(), 0, 'no demo CTAs until a real demo exists')

  await checkToggle(page, '#how-it-works h2', 'Managed by Azul', 'Administrado por Azul')
  await checkToggle(page, '#included h3', 'Speed-to-lead agent', 'Agente de respuesta inmediata')
  await checkToggle(page, '#faq button', 'Does it speak Spanish?', '¿Habla español?')
  await checkToggle(page, '#get-started h2', 'for your business', 'para su negocio')
  await checkToggle(page, '.site-banner-headline', 'speed-to-lead agent', 'agente de respuesta inmediata')
  await page.locator('.site-header .languages button', { hasText: 'ES' }).click()
  await page.waitForFunction(() => document.title.includes('respuesta inmediata') && document.documentElement.lang === 'es')
  await page.locator('.site-header .languages button', { hasText: 'EN' }).click()
  await page.waitForFunction(() => document.title.includes('speed-to-lead'))

  // No link anywhere on the main routes points at a removed service, and no page shows a price, in either language.
  for (const path of ['/', '/services', '/about', '/contact', '/services/ai-lead-agent', '/work', '/free-report']) {
    await page.goto(base + path)
    await page.getByRole('heading', { level: 1 }).first().waitFor()
    for (const lang of ['ES', 'EN']) {
      await page.locator('.site-header .languages button', { hasText: lang }).click()
      const text = await page.locator('body').innerText()
      for (const price of prices) assert.ok(!text.includes(price), `${path} (${lang}) shows the price ${price}`)
    }
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
  assert.equal(await page.locator('#plans').count(), 0, 'Services pricing stays hidden')
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
