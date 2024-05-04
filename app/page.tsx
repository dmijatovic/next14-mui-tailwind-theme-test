import MainContent from '~/components/layout/MainContent'
import PageContainer from '~/components/layout/PageContainer'

export default function Home() {
  return (
    <main className="flex-1 bg-base-100 dark:bg-base-900 dark:text-base-100">
      <PageContainer>
        <h1>This is main body of homepage in the app folder</h1>
      </PageContainer>
    </main>
  )
}
