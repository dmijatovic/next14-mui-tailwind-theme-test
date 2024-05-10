'use server'

import {headers} from 'next/headers'
import logger from '~/utils/logger'

export async function getDomain() {
  try {
    const host = headers().get('host') ?? 'localhost'
    // by default we use https protocol
    let protocol = 'https'

    if (host.startsWith('localhost') === true) {
      // we use http when local host
      protocol = 'http'
    }

    return `${protocol}://${host}`

  } catch (e: any) {
    logger(`getDomain...${e.message}`, 'error')
    return 'http://localhost:3000'
  }
}

export async function generateRobotsFile(domain: string) {
  return `User-agent: *

Disallow: /admin/
Disallow: /auth/
Disallow: /invite/
Disallow: /login/
Disallow: /user/

Sitemap: ${domain}/sitemap/software.xml
Sitemap: ${domain}/sitemap/projects.xml
Sitemap: ${domain}/sitemap/organisations.xml
`
}

export type SitemapInfo = {
  slug: string,
  updated_at: string
}

type SitemapProps = {
  baseUrl: string
  items: SitemapInfo[]
}

export async function getSitemap({baseUrl, items}: SitemapProps) {
  // write sitemap.xml file
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${items.map(item => {
    return `
  <url>
    <loc>${`${baseUrl}/${item.slug}`}</loc>
    <lastmod>${item.updated_at}</lastmod>
  </url>
  `
  }).join('')}
</urlset>
 `
}
