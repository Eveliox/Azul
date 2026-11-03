// Run against the landing-site Vite server. Uses an installed Playwright package.
// PLAYWRIGHT_MODULE=/path/to/playwright LANDING_URL=http://localhost:5175 node tests/workflow-browser.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')
const base = process.env.LANDING_URL || 'http://localhost:5175'

;(async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      localStorage.setItem('azul-cookies', JSON.stringify({ analytics: false }))
      localStorage.setItem('azul-lang', 'en')
    })
    await page.goto(base)
    await page.locator('.is-scroll-driven').waitFor()
    assert.match(await page.locator('h1').innerText(), /A better website/)
    assert.match(await page.locator('h1').innerText(), /More booked estimates/)
    await page.evaluate(async () => { window.workflowTestTriggers = (await import('/src/lib/gsap.js')).ScrollTrigger })

    for (const width of [1440, 375, 320]) {
      const height = width === 1440 ? 1000 : 812
      await page.setViewportSize({ width, height })
      await page.locator('.is-scroll-driven').waitFor()
      await page.waitForTimeout(700)
      const source = await page.locator('.workflow-film video').getAttribute('src')
      assert.equal(source.includes('-mobile'), width <= 700, 'Only the matching film is selected')
      for (const fraction of [.1, .14757, .15625, .25, .42, .6, .76, .94, .2]) {
        await page.evaluate(value => {
          const trigger = window.workflowTestTriggers.getAll().find(item => item.trigger?.classList.contains('workflow-stage'))
          window.scrollTo(0, trigger.start + (trigger.end - trigger.start) * value)
        }, fraction)
        await page.waitForTimeout(750)
        const state = await page.evaluate(() => {
          const video = document.querySelector('.workflow-film video')
          const bounds = document.querySelector('.workflow-stage').getBoundingClientRect()
          return {
            time: video.currentTime, paused: video.paused, bottom: bounds.bottom,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            chapter: [...document.querySelectorAll('.workflow-chapters button')].findIndex(button => button.getAttribute('aria-pressed') === 'true'),
          }
        })
        const targetTime = .65 + fraction * (29.45 - .65)
        const chapter = Math.floor(targetTime / 5)
        assert.equal(state.chapter, chapter)
        assert.equal(state.paused, true)
        assert.equal(state.overflow, false)
        assert.ok(state.bottom <= height + 3, `Pinned content fits at ${width}px: ${state.bottom}`)
        assert.ok(Math.abs(state.time - targetTime) < .35, 'Video follows scroll in both directions')
      }
    }
    await page.locator('.workflow-chapters button').nth(3).click()
    await page.waitForTimeout(1400)
    assert.equal(await page.locator('.workflow-chapters button').nth(3).getAttribute('aria-pressed'), 'true')
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(1000)
    await page.locator('.site-header .languages button').filter({ hasText: 'ES' }).click()
    await page.locator('.is-scroll-driven').waitFor()
    assert.equal(await page.locator('.pin-spacer').count(), 1)
    assert.match(await page.locator('.workflow-film video').getAttribute('src'), /es-mobile/)
    assert.match(await page.locator('h1').innerText(), /Una mejor web/)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForTimeout(300)
    assert.equal(await page.locator('.pin-spacer').count(), 0)
    assert.equal(await page.locator('.workflow-film video').evaluate(video => video.controls), true)
    await page.locator('.workflow-chapters button').nth(2).click()
    assert.equal(await page.locator('.workflow-chapters button').nth(2).getAttribute('aria-pressed'), 'true')
    assert.deepEqual(errors, [])
    console.log('PASS: concrete headline, adaptive films, all chapters, reverse scroll, pin fit, EN/ES, reduced motion.')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exit(1) })
