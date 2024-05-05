'use server'

import {cookies} from 'next/headers'
import {Matomo} from './nodeCookies'

export type MatomoSettings = Matomo & {
  url: string | null
}

const id = process.env.MATOMO_ID ?? null
const url = process.env.MATOMO_URL ?? null

export async function getMatomoSettings():Promise<MatomoSettings>{
  try {
    // check for mtm cookies
    const mtm_consent = cookies().get('mtm_consent')
    const mtm_consent_removed = cookies().get('mtm_consent_removed')

    if (mtm_consent) {
      return {
        id,
        url,
        consent: true
      }
    } else if (mtm_consent_removed) {
      return {
        id,
        url,
        consent: false
      }
    }
    return {
      id,
      url,
      consent: null
    }
  } catch (e: any) {
    return {
      id,
      url,
      consent: null
    }
  }
}
