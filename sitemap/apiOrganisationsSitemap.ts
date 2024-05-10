import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {SitemapInfo, getDomain, getSitemap} from './apiSitemap'


async function getOrganisationList() {
  try {
    const baseUrl = getBaseUrl()
    // select only top level organisations (parent IS NULL)
    const query = 'select=slug,updated_at&parent=is.NULL&limit=50000&offset=0'
    const url = `${baseUrl}/organisation?${query}`

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


export async function getOrganisationsSitemap() {
  // get projects list & domain
  const [items, domain] = await Promise.all([
    getOrganisationList(),
    getDomain()
  ])

  return getSitemap({
    baseUrl: `${domain}/projects`,
    items
  })
}
