
import {Metadata} from 'next'
import Link from 'next/link'

import MainContent from '~/components/layout/MainContent'
import {app} from '~/config/app'
import {getDomain} from '~/sitemap/apiSitemap'

const testProjects = [
  {label:'Test project 1', href:'/projects/test-1'},
  {label:'Test project 2', href:'/projects/test-2'},
  {label:'Test project 3', href:'/projects/test-3'},
]

/**
 * Dynamically generate metadata headers using generateMetadata function supported by next/app
 * for metadata props see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
 * @param param0
 * @returns
 */
export async function generateMetadata(): Promise<Metadata> {
  const domain = await getDomain()

  return {
    title: `Projects | ${app.title}`,
    description: 'Show all projects in the RSD',
    metadataBase: new URL(domain),
    alternates: {
      canonical: '/projects'
    },
    // adds og and twitter headers!
    openGraph: {
      title: `Projects | ${app.title}`,
      description: 'Show all projects in the RSD',
      siteName: app.title,
      url:`${domain}/projects`
    }
  }
}

export default function PagesTestPage() {
  return (
    <>
      <MainContent className='pb-12'>
        <h1>Projects test page in the app folder</h1>

        {testProjects.map(item => {
          return (
            <Link key={item.href} href={item.href} className="py-2">{item.label}</Link>
          )
        })}
      </MainContent>
    </>
  )
}
