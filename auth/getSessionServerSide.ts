'use server'

import {cookies} from 'next/headers'

import {app} from '~/config/app'
import logger from '@/utils/logger'
import verifyJwt, {decodeJwt} from './jwtUtils'
import {defaultSession} from './AuthProvider'
import {RsdUser, Session} from './index'


/**
 * Extract token from rsd_token HttpOnly cookie on the server and validate the token.
 * This method can only used on server side (node).
 * @returns
 */
export async function getSessionSeverSide() {
  // get token from cookie
  const token = await getRsdTokenNode()
  // create session from token
  const session = await createSession(token)
  // remove invalid cookie
  if (session.status === 'invalid') {
    // console.log('remove rsd cookies...')
    await removeRsdTokenNode()
    // return default
    return defaultSession
  }
  // return session
  return session
}

/**
 * Extract JWT from rsd_token, validate and decode it.
 * Available only on the server side, using plain Node request
 * @param req
 * @returns Session
 */
export async function getRsdTokenNode() {
  // check for cookies
  const token = cookies().get(app.rsdTokenId)
  if (token && token?.value) {
    // validate and decode
    return token?.value
  } else {
    return null
  }
}

/**
 * Create session from the token.
 * It verifies and decodes JWT received as cookie.
 * @param token
 * @returns Session
 */
export async function createSession(token: string | null): Promise<Session> {
  if (token) {
    const result = verifyJwt(token)
    if (result === 'valid') {
      // decode JWT
      const decoded = decodeJwt(token)
      return {
        user: decoded as RsdUser,
        token,
        status: 'authenticated'
      }
    }
    return {
      user: null,
      token,
      status: result
    }
  }
  return {
    user: null,
    token: '',
    status: 'missing'
  }
}

/**
 * Remove rsd_token cookie. Use it for logout or when invalid token
 * Use this function from _middleware functions of Next SSR
 * @param res
 */
export async function removeRsdTokenNode() {
  try {
    cookies().delete(app.rsdTokenId)
    // res.setHeader(
    //   'Set-Cookie', [
    //     'rsd_token=deleted; Max-Age=0; Secure; HttpOnly; Path=/; SameSite=Lax;'
    //   ]
    // )
  } catch (e: any) {
    logger(`removeRsdTokenCookie: ${e?.message}`, 'error')
  }
}
