import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {app} from '~/config/app'

/**
 * LOGOUT ROUTE. It will remove rsd token cookie and redirect to homepage
 * @param request
 */
export async function GET(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get(app.rsdTokenId)

  if (token?.value) {
    cookieStore.delete(app.rsdTokenId)
  }

  // redirect to HOMEPAGE
  redirect('/')
}
