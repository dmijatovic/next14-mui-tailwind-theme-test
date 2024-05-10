
import {getOrganisationsSitemap} from '~/sitemap/apiOrganisationsSitemap'

export async function GET() {

  // generate the XML sitemap for organisations
  const content = await getOrganisationsSitemap()

  // create new response with headers
  const response = new Response(content, {
    status: 200,
    headers: {
      'Content-Type':'text/xml;charset=UTF-8'
    }
  })

  return response
}
