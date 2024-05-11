import {Metadata} from 'next'

import {app} from '~/config/app'
import {getUserSettings} from '~/utils/userSettingsServer'
import MainContent from '~/components/layout/MainContent'
import {getOrganisationsList} from '~/components/organisation/apiOrganisations'
import PageTitle from '~/components/layout/PageTitle'
import ClientSearch from '~/components/organisation/overview/ClientSearch'
import ClientTablePagination from '~/components/organisation/overview/ClientTablePagination'
import OrganisationGrid from '~/components/organisation/overview/OrganisationGrid'
import ClientPagination from '~/components/organisation/overview/ClientPagination'
import {OrganisationSearchParams, organisationQueryParams} from '~/components/organisation/apiOrganisationParams'

export const metadata: Metadata = {
  title: `Organisations | ${app.title}`,
  description: 'List of organizations involved in the development of research software.'
}

export default async function OrganisationTestPage({searchParams}: { searchParams: OrganisationSearchParams }) {
  // extract user settings from cookie
  const {rsd_page_rows,token} = await getUserSettings()
  // extract searchParams
  const {search, rows, page} = organisationQueryParams(searchParams)
  // if rows is provided in url we use it
  // otherwise we use value from getUserSettings which includes the default value
  let page_rows = rows ?? rsd_page_rows
  // get data
  const {count, data} = await getOrganisationsList({
    search,
    rows: page_rows,
    // api uses 0 based index
    page: page>0 ? page-1 : 0,
    token,
  })
  // calculate number of pages
  const numPages = Math.ceil(count / page_rows)

  // console.group('OrganisationTestPage')
  // console.log('searchParams...', searchParams)
  // console.log('token...', token)
  // console.log('search...', search)
  // console.log('rows...', rows)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.log('page_rows...', page_rows)
  // console.log('page...', page)
  // console.log('count...', count)
  // console.log('data...', data)
  // console.groupEnd()

  return (
    <MainContent className="py-4">
      {/* Page title with search and pagination */}
      <div className="px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-[9]">
        <PageTitle title="Organisations">
          <div className="md:flex flex-wrap justify-end">
            <div className="flex items-center lg:ml-4">
              <ClientSearch
                search={search}
              />
            </div>
            <ClientTablePagination
              count={count ?? 0}
              page={page}
              rows={page_rows}
            />
          </div>
        </PageTitle>
      </div>
      {/* Organizations cards */}
      <OrganisationGrid
        organisations={data}
      />
      {/* Pagination */}
      {numPages > 1 ?
        <ClientPagination
          numPages={numPages}
          page={page}
          rows={page_rows}
          search={search}
        />
        : null
      }
    </MainContent>
  )
}
