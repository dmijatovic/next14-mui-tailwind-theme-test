// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getDomain, getSitemap, SitemapInfo} from './apiSitemap'

async function getSoftwareList() {
  try {
    const baseUrl = getBaseUrl()
    // we set max on 50k
    const query = 'select=slug,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/software?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getSoftwareList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getSoftwareList...${e.message}`, 'error')
    return []
  }
}


export async function getSoftwareSitemap() {
  // get software list & domain
  const [items, domain] = await Promise.all([
    getSoftwareList(),
    getDomain()
  ])

  return getSitemap({
    baseUrl:`${domain}/software`,
    items
  })
}
