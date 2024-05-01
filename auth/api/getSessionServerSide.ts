'use server'

import {IncomingMessage, OutgoingMessage} from 'http'
import cookie from 'cookie'

import logger from '@/utils/logger'
import verifyJwt, {decodeJwt} from '~/auth/jwtUtils'
import {defaultSession} from '~/auth//AuthProvider'
import {RsdUser, Session} from '~/auth/index'


/**
 * Extract token from rsd_token HttpOnly cookie on the server and validate the token.
 * This method can only used on server side (node).
 * @param req
 * @param res
 * @returns
 */
export function getSessionSeverSide(req: IncomingMessage | undefined, res: OutgoingMessage | undefined) {
  // if reqest or response missing we abort
  // this method is only avaliable server side
  if (!req || !res) return null

  // get token from cookie
  const token = getRsdTokenNode(req)
  // create session from token
  const session = createSession(token)
  // remove invalid cookie
  if (session.status === 'invalid') {
    // console.log('remove rsd cookies...')
    removeRsdTokenNode(res)
    // return default
    return defaultSession
  }
  // return session
  return session
}

/**
 * Extract JWT from rsd_token.
 * Available only on the server side, using plain Node request
 * @param req
 * @returns Session
 */
export function getRsdTokenNode(req: IncomingMessage) {
  // check for cookies
  if (req?.headers?.cookie) {
    // parse cookies from node request
    const cookies = cookie.parse(req.headers.cookie)
    // validate and decode
    const token = cookies?.rsd_token
    return token
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
export function createSession(token: string | null): Session {
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
export function removeRsdTokenNode(res: OutgoingMessage) {
  try {
    res.setHeader(
      'Set-Cookie', [
        'rsd_token=deleted; Max-Age=0; Secure; HttpOnly; Path=/; SameSite=Lax;'
      ]
    )
  } catch (e: any) {
    logger(`removeRsdTokenCookie: ${e?.message}`, 'error')
  }
}
