import assert from 'node:assert/strict'
import test from 'node:test'
import { getMediaUrl, normalizeStrapiMediaUrl, normalizeStrapiMediaUrls } from '../src/lib/api/media.ts'

process.env.NEXT_PUBLIC_STRAPI_URL = 'https://admin.drmarisaesthetics.com'

const cases = [
  ['/uploads/a.jpg', '/api/strapi-media/uploads/a.jpg'],
  ['/uploads/a.jpg?width=640', '/api/strapi-media/uploads/a.jpg?width=640'],
  ['https://admin.drmarisaesthetics.com/uploads/a.jpg', '/api/strapi-media/uploads/a.jpg'],
  ['http://localhost:22345/uploads/a.jpg', '/api/strapi-media/uploads/a.jpg'],
  ['/api/strapi-media/uploads/a.jpg', '/api/strapi-media/uploads/a.jpg'],
  ['/api/strapi-media/uploads/a.jpg?v=3', '/api/strapi-media/uploads/a.jpg?v=3'],
  ['https://images.example.com/a.jpg', 'https://images.example.com/a.jpg'],
  ['https://admin.drmarisaesthetics.com/api/a.jpg', 'https://admin.drmarisaesthetics.com/api/a.jpg'],
  ['https://cdn.example.com/uploads/a.jpg', 'https://cdn.example.com/uploads/a.jpg'],
  [
    'https://admin.drmarisaesthetics.com/uploads/patient%20photo.jpg?width=800&v=2',
    '/api/strapi-media/uploads/patient%20photo.jpg?width=800&v=2',
  ],
]

for (const [input, expected] of cases) {
  test(`normalizes ${input}`, () => assert.equal(normalizeStrapiMediaUrl(input), expected))
}

test('normalizes a Strapi media object and its requested format', () => {
  const media = {
    url: 'https://admin.drmarisaesthetics.com/uploads/original.jpg',
    formats: { small: { url: 'https://admin.drmarisaesthetics.com/uploads/small.jpg' } },
  }
  assert.equal(getMediaUrl(media), '/api/strapi-media/uploads/original.jpg')
  assert.equal(getMediaUrl(media, 'small'), '/api/strapi-media/uploads/small.jpg')
})

test('normalizes nested media URL values without changing unrelated URLs', () => {
  const input = {
    image: { url: 'https://admin.drmarisaesthetics.com/uploads/a.jpg' },
    external: 'https://images.example.com/uploads/b.jpg',
  }
  assert.deepEqual(normalizeStrapiMediaUrls(input), {
    image: { url: '/api/strapi-media/uploads/a.jpg' },
    external: 'https://images.example.com/uploads/b.jpg',
  })
})
