import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { experience, featuredWork } from '../src/data/experience.js'
import { content } from '../src/data/content.js'

for (const lang of ['en', 'es']) {
  test(`${lang}: four active services, localized demo, two coming-soon offerings`, () => {
    const data = experience[lang]
    assert.deepEqual(data.services.map((s) => s.id), ['website', 'calls', 'reviews', 'seo'])
    assert.equal(data.steps.length, 4)
    assert.equal(data.stageTitles.length, 4)
    assert.equal(data.stageNotes.length, 4)
    assert.equal(data.labels.length, data.values.length)
    assert.ok(data.script.length > 4)
    assert.match(data.voiceDisclosure, /Vapi/)
    const tiers = content[lang].pricing.tiers
    assert.equal(tiers.filter((t) => !t.comingSoon).length, 4)
    assert.equal(tiers.filter((t) => t.comingSoon).length, 2)
    const website = tiers.find((t) => t.stripeLinkKey === 'websiteSetup')
    assert.equal(website.price, '$50')
    assert.match(website.priceNote, /499/)
    assert.equal(content[lang].pricing.bundle.crossed, null)
    for (const tier of tiers.filter((t) => t.comingSoon)) assert.ok(!tier.stripeLinkKey)
  })
}
test('all experience translations have matching keys', () => {
  assert.deepEqual(Object.keys(experience.en).sort(), Object.keys(experience.es).sort())
})
test('three featured sites have local optimized images and bilingual project notes', () => {
  assert.equal(featuredWork.length, 3)
  for (const project of featuredWork) {
    assert.ok(existsSync(`public${project.image}`))
    assert.match(project.image, /\.webp$/)
    assert.equal(new URL(project.url).protocol, 'https:')
    for (const lang of ['en', 'es']) {
      assert.ok(project.goal[lang])
      assert.ok(project.delivery[lang])
    }
    assert.ok(!project.metrics, 'Do not manufacture project performance metrics')
  }
})
