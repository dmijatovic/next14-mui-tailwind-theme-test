// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useRouter,useSearchParams,usePathname} from 'next/navigation'

import {rowsPerPageOptions} from '~/config/pagination'
import {QueryParams, buildFilterUrl} from '~/utils/postgrestUrl'
import {getDocumentCookie} from '~/utils/userSettingsClient'
import {organisationSearchParams} from '../apiOrganisationParams'


export default function useOrganisationOverviewParams() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  function createUrl(key: string, value: string | string[]) {
    const params: QueryParams = {
      // take existing params from searchParams
      ...organisationSearchParams(searchParams),
      [key]: value,
    }
    // on each param change we reset page
    if (key !== 'page') {
      params['page'] = 1
    }
    if (typeof params['rows'] === 'undefined' || params['rows'] === null) {
      // extract from cookie or use default
      params['rows'] = getDocumentCookie('rsd_page_rows', rowsPerPageOptions[0])
    }
    // construct url with all query params
    const url = buildFilterUrl(params,'organisations')
    return url
  }

  function handleQueryChange(key: string, value: string | string[]) {
    const url = createUrl(key, value)
    if (key === 'page') {
      // when changin page we scroll to top
      router.push(url, {scroll: true})
    } else {
      // update page url but keep scroll position
      router.push(url, {scroll: false})
    }
  }

  function resetFilters() {
    // remove params from url and keep scroll position
    if (pathname) {
      router.push(pathname, {scroll: false})
    }
  }

  return {
    handleQueryChange,
    resetFilters,
    createUrl
  }
}
