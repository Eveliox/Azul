// Local product film checks. Never connects to a customer workspace.
// PLAYWRIGHT_MODULE=/path/to/playwright LANDING_URL=http://localhost:5175 node tests/workflow-browser.cjs
// Optional CHROME_PATH=/path/to/chrome when Playwright's own Chromium isn't installed.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')
const base = process.env.LANDING_URL || 'http://localhost:5175'
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Use a local landing-site server')

const chapters = '.film-chapters button'
const titles = {
  EN: ['A new lead, already in your workspace.', 'A fast response. A useful conversation.', 'An appointment, with the context included.'],
  ES: ['Un nuevo cliente en su panel.', 'Una respuesta rápida. Una conversación útil.', 'Una cita con todos los detalles.'],
}
// Opacity of the n-th alternative inside a swap (1-based), e.g. which status pill is showing.
const shown = (page, name, n) => page.evaluate(([name, n]) => Number(getComputedStyle(document.querySelector(`[data-film="${name}"] > span:nth-child(${n})`)).opacity), [name, n])
const opacity = (page, name) => page.evaluate(name => Number(getComputedStyle(document.querySelector(`[data-film="${name}"]`)).opacity), name)
// The cursor's hotspot (its element origin) must sit inside the target's on-screen box.
const onTarget = (page, name) => page.evaluate(name => {
  const c = document.querySelector('[data-film="cursor"]').getBoundingClientRect(), t = document.querySelector(`[data-film="${name}"]`).getBoundingClientRect()
  return c.left >= t.left && c.left <= t.right && c.top >= t.top && c.top <= t.bottom
}, name)
const setLang = async (page, lang) => {
  await page.locator('.site-header .languages button').filter({ hasText: lang }).click()
  await page.waitForFunction(l => document.documentElement.lang === l, lang.toLowerCase())
}

;(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
  const errors = []
  try {
    // Reduced motion: no autoplay, a finished still (Booked, no cursor), chapter buttons jump to stills.
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      localStorage.setItem('azul-cookies', JSON.stringify({ analytics: false }))
      localStorage.setItem('azul-lang', 'en')
    })
    await page.goto(base)
    await page.getByRole('heading', { name: 'Turn new leads into booked estimates.', exact: true }).waitFor()
    assert.equal(await page.locator(chapters).count(), 3)
    assert.equal(await page.locator('.pin-spacer, .workflow-film video').count(), 0)
    assert.ok(await page.getByRole('button', { name: 'Play walkthrough', exact: true }).isVisible())
    assert.equal(await page.locator('.film-viewport').getAttribute('aria-hidden'), 'true')
    assert.ok((await page.locator('.film-frame .sr-only').textContent()).includes('Alex Morgan'), 'the film has a text alternative')
    assert.ok(await page.getByText('Interactive example · Sample data').isVisible())
    await page.waitForTimeout(300)
    assert.equal(await page.locator(chapters).nth(2).getAttribute('aria-pressed'), 'true', 'poster is the Book chapter')
    assert.equal(await shown(page, 's-row-status', 3), 1, 'poster shows the lead as Booked')
    assert.equal(await page.locator('.lead-film.is-still').count(), 1, 'no cursor on the still')
    assert.equal(await page.locator('.film-end').isVisible(), false, 'end card hidden on the poster')

    for (const lang of ['EN', 'ES']) {
      await page.evaluate(() => scrollTo(0, 0))
      await setLang(page, lang)
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 })
        await page.waitForTimeout(250)
        for (let index = 0; index < 3; index++) {
          const button = page.locator(chapters).nth(index)
          await button.click()
          assert.equal(await button.getAttribute('aria-pressed'), 'true')
          assert.equal(await page.locator('.lead-demo-copy h2').textContent(), titles[lang][index])
          if (index === 0) assert.equal(await shown(page, 's-send', 2), 1, `${lang} ${width}px capture still shows the form sent`)
          if (index === 1) assert.ok(await opacity(page, 'line') > .9, `${lang} ${width}px call still shows the transcript`)
          if (index === 2) { assert.equal(await shown(page, 's-drawer-status', 2), 1); assert.equal(await opacity(page, 'slot'), 1, `${lang} ${width}px book still shows the visit`) }
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${lang} ${width}px has no horizontal overflow`)
        }
        await page.screenshot({ path: `/tmp/azul-film-${lang.toLowerCase()}-${width}.png`, fullPage: true })
      }
    }
    await page.close()

    // Normal motion, on a fake clock: autoplay, cursor on target in both languages, pause, keyboard, language switch mid-play, end card.
    for (const lang of ['en', 'es']) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
      const film = await ctx.newPage()
      film.on('pageerror', error => errors.push(error.message))
      await ctx.addInitScript(l => { localStorage.setItem('azul-cookies', JSON.stringify({ analytics: false })); localStorage.setItem('azul-lang', l) }, lang)
      await film.clock.install()
      await film.goto(base)
      await film.locator('.film-frame').scrollIntoViewIfNeeded()
      await film.clock.runFor(500)
      assert.ok(await film.getByRole('button', { name: lang === 'en' ? 'Pause walkthrough' : 'Pausar recorrido', exact: true }).isVisible(), 'autoplays when in view')
      await film.locator(chapters).nth(0).click()
      await film.clock.runFor(3400)
      assert.ok(await onTarget(film, 'in-name'), `${lang}: cursor is on the Name field`)
      await film.clock.runFor(6000)
      assert.ok(await onTarget(film, 'send'), `${lang}: cursor is on the Send button`)
      await film.clock.runFor(4000)
      assert.equal(await film.locator(chapters).nth(1).getAttribute('aria-pressed'), 'true', `${lang}: advances to Call`)
      if (lang === 'en') {
        await film.getByRole('button', { name: 'Pause walkthrough', exact: true }).click()
        await film.clock.runFor(10000)
        assert.equal(await film.locator(chapters).nth(1).getAttribute('aria-pressed'), 'true', 'stays put while paused')
        await film.getByRole('button', { name: 'Play walkthrough', exact: true }).click()
        // Language switch mid-play rebuilds the film and keeps the chapter.
        await film.evaluate(() => scrollTo(0, 0))
        await setLang(film, 'ES')
        await film.locator('.film-frame').scrollIntoViewIfNeeded()
        await film.clock.runFor(400)
        assert.equal(await film.locator(chapters).nth(1).getAttribute('aria-pressed'), 'true', 'language switch keeps the chapter')
        assert.equal(await film.locator('.lead-demo-copy h2').textContent(), titles.ES[1])
        await film.evaluate(() => scrollTo(0, 0))
        await setLang(film, 'EN')
        await film.locator('.film-frame').scrollIntoViewIfNeeded()
        await film.locator(chapters).nth(2).focus()
        await film.keyboard.press('Enter')
        assert.equal(await film.locator(chapters).nth(2).getAttribute('aria-pressed'), 'true', 'keyboard selects a chapter')
        await film.clock.runFor(7500)
        const cta = film.locator('.film-end a')
        assert.ok(await cta.isVisible(), 'end card shows the booking link')
        assert.equal(await cta.getAttribute('href'), await film.locator('.lead-demo-actions .offer-ctas a').getAttribute('href'))
        await film.screenshot({ path: '/tmp/azul-film-end.png' })
      }
      await ctx.close()
    }
    assert.deepEqual(errors, [])
    console.log('PASS: three chapters with stills, Booked poster without cursor, cursor on target (EN/ES), autoplay/pause, keyboard, language switch mid-play, end card CTA, reduced motion, desktop/tablet/phone widths.')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exit(1) })
