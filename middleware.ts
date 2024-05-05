import {NextRequest, NextResponse} from 'next/server'
import {getCspHeader} from './utils/contentSecurityPolicy'

/**
 * Middleware used to set CSP headers to each request/response
 * Note! node crypto module need to addressed as in line 12 in the middleware. *
 * @param request
 * @returns response:NextResponse
 */
export function middleware(request: NextRequest) {
  // taken from documentation https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  // create csp header string
  const cspHeader = getCspHeader(nonce)

  // set nonce to request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  // set CSP to request header
  requestHeaders.set(
    'Content-Security-Policy',
    cspHeader
  )
  // create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  // set CSP heder to response
  response.headers.set(
    'Content-Security-Policy',
    cspHeader
  )
  // return response
  return response
}
