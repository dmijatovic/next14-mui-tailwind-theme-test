import Link from 'next/link'
import MainContent from '~/components/layout/MainContent'

const testOrganisations = [
  {label:'Test organisation 1', href:'/organisations/test-1'},
  {label:'Test organisation 2', href:'/organisations/test-1/test-2'},
  {label:'Test organisation 3', href:'/organisations/test-3'},
]

export default function OrganisationTestPage() {
  return (
    <MainContent className='pb-12'>
      <h1>This is organisations test page in app folder</h1>
      {testOrganisations.map(item => {
        return (
          <Link key={item.href} href={item.href} className="py-2">{item.label}</Link>
        )
      })}
    </MainContent>
  )
}
