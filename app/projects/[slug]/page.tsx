import {Metadata} from 'next'

import {app} from '~/config/app'
import MainContent from '~/components/layout/MainContent'
import {getDomain} from '~/sitemap/apiSitemap'

type ProjectPageParams = {
  params: {
    slug:string
  }
}

/**
 * Dynamically generate metadata headers using generateMetadata function supported by next/app
 * for metadata props see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
 * @param param0
 * @returns
 */
export async function generateMetadata({params}:ProjectPageParams): Promise<Metadata> {
  const domain = await getDomain()

  return {
    title: `Projects | ${app.title}`,
    description: 'Show all projects in the RSD',
    metadataBase: new URL(domain),
    alternates: {
      canonical: `/projects/${params?.slug.toString()}`
    },
    // adds og and twitter headers!
    openGraph: {
      title: `Projects | ${app.title}`,
      description: 'Show all projects in the RSD',
      siteName: app.title,
      url:'https://research.software/projects'
    },
  }
}


export default function ProjectTestPage({params}:ProjectPageParams) {

  return (
    <MainContent className='pb-12'>
      <h1>Projects test page in the app folder for slug</h1>
      <pre>{JSON.stringify(params)}</pre>
    </MainContent>
  )
}
