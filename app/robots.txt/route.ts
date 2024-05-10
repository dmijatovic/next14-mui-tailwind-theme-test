import {generateRobotsFile, getDomain} from '~/sitemap/apiSitemap'

export async function GET() {
  // extract domain
  const domain = await getDomain()
  // generate content
  const content = await generateRobotsFile(domain)
  // create new response
  const response = new Response(content)
  // return response
  return response
}
