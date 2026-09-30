import test from 'node:test'
import assert from 'node:assert/strict'
import { insightArticles, insightsCopy, filterInsights, readingMinutes } from '../src/data/insights.js'
import { serviceSlugs } from '../src/data/services.js'

for (const lang of ['en', 'es']) {
  test(`${lang}: every insight has a complete article and a valid related service`, () => {
    assert.equal(new Set(insightArticles.map(a => a.slug)).size, insightArticles.length)
    for (const article of insightArticles) {
      const copy = insightsCopy[lang].articles[article.slug]
      assert.ok(copy.title && copy.dek && copy.takeaway)
      assert.ok(copy.sections.length >= 3)
      assert.equal(new Set(copy.sections.map(s => s.id)).size, copy.sections.length)
      assert.ok(copy.sections.every(s => s.title && s.paragraphs.every(p => p.length > 80)))
      assert.ok(copy.checklist.length >= 3)
      assert.ok([...serviceSlugs, 'custom-ai-agents'].includes(article.service))
      assert.ok(insightsCopy[lang].filters.some(f => f.value === article.category))
      assert.ok(readingMinutes(copy) > 0)
      for (const source of article.sources) assert.equal(new URL(source.url).protocol, 'https:')
    }
  })
}
test('search combines topic and words, ignoring case and Spanish accents', () => {
  assert.equal(filterInsights(insightArticles, insightsCopy.en, 'all', '').length, 6)
  assert.deepEqual(filterInsights(insightArticles, insightsCopy.es, 'reviews', 'RESENAS').map(a => a.slug), ['the-honest-review-playbook'])
  assert.deepEqual(filterInsights(insightArticles, insightsCopy.en, 'websites', 'both languages').map(a => a.slug), ['a-business-that-speaks-both-languages'])
  assert.equal(filterInsights(insightArticles, insightsCopy.en, 'local', 'both languages').length, 0)
  assert.equal(filterInsights(insightArticles, insightsCopy.en, 'all', 'no-such-topic').length, 0)
})
test('English and Spanish articles expose the same structure and anchor destinations', () => {
  const keys = value => Object.entries(value).flatMap(([key, item]) => item && typeof item === 'object' ? keys(item).map(nested => `${key}.${nested}`) : key)
  assert.deepEqual(keys(insightsCopy.en), keys(insightsCopy.es))
  for (const article of insightArticles) assert.deepEqual(insightsCopy.en.articles[article.slug].sections.map(s => s.id), insightsCopy.es.articles[article.slug].sections.map(s => s.id))
})
