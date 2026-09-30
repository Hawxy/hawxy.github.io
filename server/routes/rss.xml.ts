// Explicit import: Nuxt's typed routes also check this file against the app-side global
import { queryCollection } from '@nuxt/content/nitro'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .select('path', 'title', 'description', 'date')
    .where('path', 'NOT LIKE', '/blog/drafts/%')
    .order('date', 'DESC')
    .all()

  const items = posts.map(post => [
    '    <item>',
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${siteUrl}${post.path}/</link>`,
    `      <guid isPermaLink="true">${siteUrl}${post.path}/</guid>`,
    `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
    `      <description>${escapeXml(post.description ?? '')}</description>`,
    '    </item>'
  ].join('\n'))

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${siteUrl}/blog/</link>`,
    `    <description>${escapeXml(blogDescription)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>'
  ].join('\n')
})
