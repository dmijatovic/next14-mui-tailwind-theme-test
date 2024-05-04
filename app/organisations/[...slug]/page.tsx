import MainContent from '~/components/layout/MainContent'

type OrganisationTestPageParams = {
  params: {
    slug:string[]
  }
}

export default function OrganisationTestPage({params}:OrganisationTestPageParams) {
  return (
    <MainContent className='pb-12'>
      <h1>Organisation test page in the app folder for slug</h1>
      <pre>{JSON.stringify(params)}</pre>
    </MainContent>
  )
}
