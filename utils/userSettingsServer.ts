// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import {cookies} from 'next/headers'
import {rowsPerPageOptions} from '~/config/pagination'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'

/**
 * Extract user settings cookies
 * Available only on the server side, using cookies
 */
export async function getUserSettings() {
  // check for cookies
  try {
    const page_layout = cookies().get('rsd_page_layout')?.value ?? 'masonry'
    const page_rows = cookies().get('rsd_page_rows')
    const token = cookies().get('rsd-token')?.value
    return {
      rsd_page_layout: page_layout as LayoutType,
      rsd_page_rows: page_rows ? parseInt(page_rows.value) : rowsPerPageOptions[0],
      token
    }

  } catch (e) {
    return {
      rsd_page_layout: 'masonry' as LayoutType,
      rsd_page_rows: rowsPerPageOptions[0]
    }
  }
}
