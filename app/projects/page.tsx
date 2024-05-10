import Link from 'next/link'
import MainContent from '~/components/layout/MainContent'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import CitationMeta from '~/components/seo/CitationMeta'
import OgMetaTags from '~/components/seo/OgMetaTags'
import PageMeta from '~/components/seo/PageMeta'
import {app} from '~/config/app'

const testProjects = [
  {label:'Test project 1', href:'/projects/test-1'},
  {label:'Test project 2', href:'/projects/test-2'},
  {label:'Test project 3', href:'/projects/test-3'},
]

const title = `Project overview| ${app.title}`
const desc = 'Project overview page contains xxx projects'


export default function ProjectTestPage() {
  return (
    <>
      {/* TODO! Improve this approach does not works */}
      <PageMeta
        title={title}
        description={desc}
      />
      {/* TODO! Improve this approach does not works */}
      <CitationMeta
        title="{software?.brand_name}"
        author="{author}"
        publication_date="{software.created_at}"
        concept_doi="{software.concept_doi}"
      />
      {/* TODO! Improve this approach does not works */}
      <OgMetaTags
        title="{software?.brand_name}"
        description="{software.short_statement ?? ''}"
      />
      {/* TODO! Improve this approach does not works */}
      <CanonicalUrl />
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
