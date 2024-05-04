import MainContent from '~/components/layout/MainContent'

type ProjectPageParams = {
  params: {
    slug:string
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
