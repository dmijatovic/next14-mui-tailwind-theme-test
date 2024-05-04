import Link from 'next/link'
import MainContent from '~/components/layout/MainContent'

const testProjects = [
  {label:'Test project 1', href:'/projects/test-1'},
  {label:'Test project 2', href:'/projects/test-1/test-2'},
  {label:'Test project 3', href:'/projects/test-3'},
]


export default function PagesTestPage() {
  return (
    <MainContent className='pb-12'>
      <h1>Projects test page in the app folder</h1>

      {testProjects.map(item => {
        return (
          <Link key={item.href} href={item.href} className="py-2">{item.label}</Link>
        )
      })}
    </MainContent>
  )
}
