
import {getProjectsSitemap} from '~/sitemap/apiProjectsSitemap'

export async function GET() {

  // generate the XML sitemap for projects
  const content = await getProjectsSitemap()

  // create new response with headers
  const response = new Response(content, {
    status: 200,
    headers: {
      'Content-Type':'text/xml;charset=UTF-8'
    }
  })

  return response
}
