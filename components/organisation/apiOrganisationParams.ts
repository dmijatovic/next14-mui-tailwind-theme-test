import {ReadonlyURLSearchParams} from 'next/navigation'
import {rowsPerPageOptions} from '~/config/pagination'
import {decodeQueryParam, decodeSearchParam} from '~/utils/extractQueryParam'

export type OrganisationSearchParams = {
  search?: string
  page?: string
  rows?: string
}

type OrganisationQueryParamsWithDefaults = {
  search?: string
  rows?: number
  page: number
}

/**
 * It extracts, formats or provide default values for searchParams received from server component
 * @param query
 * @returns
 */
export function organisationQueryParams(query: OrganisationSearchParams): OrganisationQueryParamsWithDefaults {
  const rows: number = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: undefined,
    castToType: 'number'
  })
  const page: number = decodeQueryParam({
    query,
    param: 'page',
    defaultValue: 1,
    castToType: 'number'
  })
  const search: string = decodeQueryParam({
    query,
    param: 'search',
    defaultValue: undefined
  })

  return {
    search,
    rows,
    page,
  }
}

/**
 * Parse organisation search parameters using new useSearchParams hook of next.
 * It extracts, formats or provide default values for all params.
 * @param query
 * @returns
 */
export function organisationSearchParams(query: ReadonlyURLSearchParams | null): OrganisationQueryParamsWithDefaults{
  const rows = decodeSearchParam({
    query,
    param: 'rows',
    defaultValue: undefined,
    castToType: 'number'
  })
  const page = decodeSearchParam({
    query,
    param: 'page',
    defaultValue: 1,
    castToType: 'number'
  })
  const search = decodeSearchParam({
    query,
    param: 'search',
    defaultValue: undefined
  })
  return {
    search,
    rows,
    page,
  }
}
