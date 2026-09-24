// Run against the root landing page (not review-booster):
// LANDING_URL=http://127.0.0.1:4173 node tests/landing-browser.cjs
// Requires Playwright + Chromium in the test environment; optional CHROME_PATH.
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const path = require('node:path')

;(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  // Deterministic speech API: verifies controls, language and cancellation without playing audio.
  await page.addInitScript(() => {
    window.__speech = { calls: [], pauseCount: 0, resumeCount: 0, cancelCount: 0 }
    window.SpeechSynthesisUtterance = function (text) { this.text = text }
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [],
      speak: (u) => { window.__speech.calls.push({ text: u.text, lang: u.lang }); u.onstart?.() },
      pause: () => { window.__speech.pauseCount++ },
      resume: () => { window.__speech.resumeCount++ },
      cancel: () => { window.__speech.cancelCount++ },
    } })
  })
  await page.goto(process.env.LANDING_URL || 'http://127.0.0.1:4173')
  await page.getByRole('heading', { level: 1 }).waitFor()
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1)
  assert.deepEqual(await page.locator('main > section[id]').evaluateAll((els) => els.map((e) => e.id)), ['home', 'portfolio', 'solutions', 'voice-demo', 'pricing', 'how-it-works', 'contact'])
  assert.equal(await page.locator('.visual-service').count(), 4)
  assert.equal(await page.locator('.price-option').count(), 4)
  assert.equal(await page.locator('#price-website .price-number').innerText(), '$50\n/mo')
  assert.match(await page.locator('#price-website .price-note').innerText(), /499/)
  assert.doesNotMatch(await page.locator('body').innerText(), /3,000|4\.9|1,075|locked for life/)
  assert.equal(await page.evaluate(() => window.__speech.calls.length), 0, 'audio must not autoplay')

  const journey = page.locator('.call-journey')
  await journey.getByRole('button', { name: /See an example/ }).click()
  await page.waitForTimeout(3600)
  assert.match(await page.locator('.journey-step.current').innerText(), /AI answers/)
  await journey.getByRole('button', { name: /Pause/ }).click()
  await page.waitForTimeout(3550)
  assert.match(await page.locator('.journey-step.current').innerText(), /AI answers/)
  await journey.getByRole('button', { name: 'ES', exact: true }).click()
  await page.getByText('Gracias por llamar. Soy el recepcionista virtual. ¿Cómo puedo ayudarle?', { exact: true }).waitFor()
  await page.locator('.journey-step').nth(2).click()
  await page.getByText('Mañana por la tarde', { exact: true }).waitFor()
  await page.locator('.journey-step').nth(3).click()
  await page.getByRole('heading', { name: 'Nueva solicitud de llamada' }).waitFor()

  // Real project dialog has native focus containment, closes with Escape and returns focus.
  const projectButton = page.getByRole('button', { name: 'Explore the project: Aspire Roofing' })
  await projectButton.click()
  await page.getByRole('dialog').waitFor()
  assert.ok(await page.getByRole('dialog').getByRole('link', { name: /Visit website/ }).getAttribute('href'))
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog').count(), 0)
  assert.equal(await projectButton.evaluate((el) => document.activeElement === el), true)
  for (const preview of await page.locator('.preview-toggle').all()) {
    await preview.click()
    assert.equal(await preview.getAttribute('aria-pressed'), 'true')
    await preview.click()
  }
  await page.locator('.service-calls .service-cta').click()
  await page.waitForTimeout(700)
  const voice = page.locator('#voice-demo')
  await voice.getByRole('button', { name: /Play sample/ }).click()
  assert.equal(await page.evaluate(() => window.__speech.calls.length), 1)
  await voice.getByRole('button', { name: /Pause sample/ }).click()
  assert.equal(await page.evaluate(() => window.__speech.pauseCount), 1)
  await voice.getByRole('button', { name: /Resume sample/ }).click()
  assert.equal(await page.evaluate(() => window.__speech.resumeCount), 1)
  await voice.getByRole('button', { name: 'ES', exact: true }).click()
  await voice.getByRole('button', { name: /Play sample/ }).click()
  assert.equal(await page.evaluate(() => window.__speech.calls.at(-1).lang), 'es-US')
  await voice.getByRole('button', { name: 'Stop', exact: true }).click()

  const faq = page.locator('.faq-item').first()
  await faq.getByRole('button').click()
  assert.equal(await faq.getByRole('button').getAttribute('aria-expanded'), 'true')
  await faq.getByRole('region').waitFor()
  await faq.getByRole('button').click()
  await page.waitForTimeout(300)
  assert.equal(await faq.getByRole('region').count(), 0)
  assert.equal(await page.locator('.contact-form').getAttribute('action'), 'https://formspree.io/f/meovalvq')
  await page.getByLabel('Name', { exact: true }).fill('Demo visitor')
  await page.getByLabel('Email', { exact: true }).fill('demo@example.com')
  // Never submit real lead forms or trigger paid services in this test.

  for (const language of ['en', 'es']) {
    await page.locator('.nav-actions').getByRole('button', { name: language.toUpperCase(), exact: true }).click()
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await page.waitForTimeout(150)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${language} horizontal overflow at ${width}`)
    }
  }
  await page.locator('.mobile-menu-button').click()
  await page.locator('#mobile-navigation a[href="#solutions"]').click()
  assert.equal(await page.locator('#mobile-navigation').count(), 0)
  assert.match(await page.locator('.upcoming-strip').innerText(), /Próximamente/)

  // Reduced motion: visible content, native scrolling, manual steps, no decorative loops.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await page.locator('.call-journey').getByRole('button', { name: /Siguiente paso/ }).click()
  assert.match(await page.locator('.journey-step.current').innerText(), /La AI contesta/)
  await page.waitForTimeout(3550)
  assert.match(await page.locator('.journey-step.current').innerText(), /La AI contesta/)
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto')
  assert.equal(await page.locator('.hero-glow').evaluate((el) => getComputedStyle(el, '::after').animationName), 'none')

  // Browsers without speech synthesis keep the transcript and disable audio controls.
  const noAudio = await browser.newContext({ locale: 'en-US', reducedMotion: 'reduce' })
  await noAudio.addInitScript(() => { delete window.SpeechSynthesisUtterance })
  const fallback = await noAudio.newPage()
  await fallback.goto(process.env.LANDING_URL || 'http://127.0.0.1:4173')
  assert.equal(await fallback.getByRole('button', { name: /Play sample/ }).isDisabled(), true)
  assert.match(await fallback.locator('.voice-disclosure').innerText(), /unavailable/)
  assert.equal(await fallback.locator('.voice-transcript li').count(), 7)
  await noAudio.close()

  if (process.env.SCREENSHOT_DIR) {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('.nav-actions').getByRole('button', { name: 'EN', exact: true }).click()
    for (const [label, width] of [['desktop', 1440], ['mobile', 390]]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded()
        await image.evaluate((el) => el.decode())
      }
      await page.evaluate(() => scrollTo(0, 0))
      await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, `landing-${label}.png`), fullPage: true })
    }
  }
  assert.deepEqual(errors, [])
  await browser.close()
  console.log('PASS: landing journeys, controls, project dialog, service previews, audio controls/fallback, FAQ, EN/ES, mobile, reduced motion. No live forms submitted.')
})().catch((error) => { console.error(error); process.exit(1) })
