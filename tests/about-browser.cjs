// ABOUT_URL=http://127.0.0.1:5173 PLAYWRIGHT_PATH=/path/to/playwright node tests/about-browser.cjs
// Uses the existing browser test environment; no project dependency is required.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')
const assert = require('node:assert/strict')
const { pathToFileURL } = require('node:url')
const path = require('node:path')

;(async () => {
  const { translations } = await import(pathToFileURL(path.resolve(__dirname, '../src/data/translations.js')))
  const base = process.env.ABOUT_URL || 'http://127.0.0.1:5173'
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.goto(`${base}/about`)
    const defaultDescription = 'Bilingual AI growth for South Florida home service businesses. Reviews, websites, local search, and customer calls, in English and Spanish.'
    for (const lang of ['en', 'es']) {
      const c = translations[lang]
      await page.locator('.languages button').nth(lang === 'en' ? 0 : 1).click()
      await page.waitForFunction(title => document.title === title, c.about.meta.title)
      assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), c.about.meta.description)
      assert.equal(await page.locator('html').getAttribute('lang'), lang)
      assert.equal(await page.locator('main h1').count(), 1)
      assert.equal(await page.locator('.about-page > section').count(), 8)
      assert.equal(await page.locator('.site-footer').count(), 1)
      assert.equal(await page.locator('.footer-top h2').innerText(), c.footer.title)
      assert.equal(await page.locator('.about-photo-placeholder').getAttribute('aria-label'), `${c.about.founder.photoLabel}. ${c.about.founder.photoHint}`)
      for (const width of [375, 768, 1280, 1920]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.evaluate(() => document.fonts.ready)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${lang}: overflow at ${width}`)
        if (width > 700) {
          assert.equal(await page.locator('.desktop-nav a[href="/about"]').getAttribute('aria-current'), 'page')
        } else {
          await page.locator('.menu-toggle').click()
          assert.equal(await page.locator('.mobile-nav a[href="/about"]').getAttribute('aria-current'), 'page')
          await page.keyboard.press('Escape')
        }
        // Every section's text remains visible with reduced motion.
        for (const section of await page.locator('.about-page > section').all()) {
          await section.scrollIntoViewIfNeeded()
          assert.equal(await section.locator('h1, h2').first().isVisible(), true)
        }
      }
      await page.locator('.ai-pill').click()
      assert.equal(await page.locator('dialog[open] h2').innerText(), c.ai.title)
      await page.keyboard.press('Escape')
      const cookieBanner = page.locator('.cookie-banner')
      if (!await cookieBanner.isVisible()) await page.locator('.cookie-reopen').click()
      await cookieBanner.getByRole('button', { name: c.cookie.deny, exact: true }).click()
      await page.locator('.cookie-reopen').click()
      assert.equal(await cookieBanner.isVisible(), true)
      await cookieBanner.getByRole('button', { name: c.cookie.deny, exact: true }).click()
      await page.keyboard.press('Tab')
      await page.locator('.about-actions a').first().focus()
      const focus = await page.locator('.about-actions a').first().evaluate(el => getComputedStyle(el).outlineStyle)
      assert.notEqual(focus, 'none')
      await page.locator('.about-actions a[href="/services"]').click()
      await page.waitForSelector('.services-hero')
      assert.equal(await page.title(), c.meta)
      assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), defaultDescription)
      await page.locator('.desktop-nav a[href="/about"]').click()
      await page.waitForSelector('.about-page')
    }
    // Exercise real reveal animations, then capture the final desktop and mobile layouts.
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.locator('.languages button').first().click()
    await page.reload()
    for (const section of await page.locator('.about-page > section').all()) {
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1100)
      const hiddenWords = await section.locator('.split-word').evaluateAll(els => els.filter(el => getComputedStyle(el).visibility === 'hidden').length)
      assert.equal(hiddenWords, 0)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 1000 })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: '/private/tmp/azul-about-desktop.png', fullPage: true })
    await page.setViewportSize({ width: 375, height: 900 })
    await page.screenshot({ path: '/private/tmp/azul-about-mobile.png', fullPage: true })
    assert.deepEqual(errors, [])
    console.log('PASS: About EN/ES, four widths, metadata + SPA restoration, active navigation, focus, motion, AI and cookie controls; no console errors.')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
