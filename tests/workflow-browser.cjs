// Local product walkthrough checks. Never connects to a customer workspace.
// PLAYWRIGHT_MODULE=/path/to/playwright LANDING_URL=http://localhost:5175 node tests/workflow-browser.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')
const base = process.env.LANDING_URL || 'http://localhost:5175'
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Use a local landing-site server')

;(async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      localStorage.setItem('azul-cookies', JSON.stringify({ analytics: false }))
      localStorage.setItem('azul-lang', 'en')
    })
    await page.goto(base)
    await page.getByRole('heading', { name: 'Turn new leads into booked estimates.', exact: true }).waitFor()
    assert.equal(await page.locator('.product-stage-buttons button').count(), 3)
    assert.equal(await page.locator('.pin-spacer, .workflow-film video').count(), 0)
    assert.ok(await page.getByRole('button', { name: 'Play walkthrough', exact: true }).isVisible())

    for (const lang of ['EN', 'ES']) {
      await page.evaluate(() => scrollTo(0, 0))
      await page.locator('.site-header .languages button').filter({ hasText: lang }).click()
      assert.equal(await page.locator('html').getAttribute('lang'), lang.toLowerCase())
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 })
        for (let index = 0; index < 3; index++) {
          const button = page.locator('.product-stage-buttons button').nth(index)
          await button.click()
          assert.equal(await button.getAttribute('aria-pressed'), 'true')
          assert.equal(await page.locator('.product-detail .product-status').textContent(), (lang === 'EN' ? ['New','On a call','Booked'] : ['Nuevo','En llamada','Agendado'])[index])
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${lang} ${width}px has no horizontal overflow`)
          if (index === 2) assert.ok(await page.locator('.product-appointment').isVisible())
        }
        await page.screenshot({ path: `/tmp/azul-saas-${lang.toLowerCase()}-${width}.png`, fullPage: true })
      }
    }
    // Normal motion: advances when visible, pauses on demand, and responds to keyboard input.
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.evaluate(() => scrollTo(0, 0))
    await page.locator('.site-header .languages button').filter({ hasText: 'EN' }).click()
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.getByRole('button', { name: 'Play walkthrough', exact: true }).click()
    await page.locator('.product-demo-shell').scrollIntoViewIfNeeded()
    await page.waitForTimeout(6900)
    assert.equal(await page.locator('.product-stage-buttons button').nth(1).getAttribute('aria-pressed'), 'true')
    await page.getByRole('button', { name: 'Pause walkthrough', exact: true }).click()
    await page.waitForTimeout(6900)
    assert.equal(await page.locator('.product-stage-buttons button').nth(1).getAttribute('aria-pressed'), 'true')
    await page.locator('.product-stage-buttons button').nth(2).focus()
    await page.keyboard.press('Enter')
    assert.ok(await page.locator('.product-appointment').isVisible())
    await page.waitForTimeout(300)
    await page.screenshot({ path: '/tmp/azul-saas-product-desktop.png' })
    assert.deepEqual(errors, [])
    console.log('PASS: three stages, sample lead status and booking, playback/pause, keyboard controls, no scroll pinning, EN/ES, reduced motion, desktop/tablet/phone widths.')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exit(1) })
