
import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getDomain, getSitemap, SitemapInfo} from './apiSitemap'

async function getProjectsList() {
  try {
    const baseUrl = getBaseUrl()
    const query = 'select=slug,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/project?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getProjectsList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getProjectsList...${e.message}`, 'error')
    return []
  }
}


export async function getProjectsSitemap() {
  // get projects list & domain
  const [items, domain] = await Promise.all([
    getProjectsList(),
    getDomain()
  ])

  return getSitemap({
    baseUrl: `${domain}/projects`,
    items
  })
}
