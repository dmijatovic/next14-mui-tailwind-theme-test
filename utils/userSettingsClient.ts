// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import cookie from 'cookie'
import logger from '~/utils/logger'

/**
 * Set document cookie.
 * Frontend ONLY!
 * @param value
 * @param name
 * @param path
 */
export function setDocumentCookie(value: string, name: string, path: string = '/') {
  try {
    // match matomo cookie exiration time of 400 days
    const maxAgeInSeconds = 60 * 60 * 24 * (400)
    document.cookie = `${name}=${value};path=${path};SameSite=Lax;Secure;Max-Age=${maxAgeInSeconds};`
  } catch (e: any) {
    logger(`setCookie error: ${e.message}`, 'error')
  }
}

/**
 * Extract cookie from document/page.
 * Frontend ONLY!
 * @param name
 * @param defaultValue
 * @returns
 */

export function getDocumentCookie(name: string, defaultValue: any) {
  if (typeof document === 'undefined') {
    console.log('getDocumentCookie...node...defaultValue...', defaultValue)
    return defaultValue
  }
  if (document.cookie) {
    const cookies = cookie.parse(document.cookie)
    if (cookies.hasOwnProperty(name)) {
      return cookies[name]
    }
    return defaultValue
  }
  return defaultValue
}
