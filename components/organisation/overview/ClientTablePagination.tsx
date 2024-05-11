'use client'
import {MouseEvent, ChangeEvent} from 'react'
import TablePagination from '@mui/material/TablePagination'

import useOrganisationOverviewParams from './useOrganisationOverviewParams'
import {rowsPerPageOptions} from '~/config/pagination'
import {setDocumentCookie} from '~/utils/userSettingsClient'

type ClientPaginationProps = {
  count: number
  page: number
  rows?: number
}

export default function ClientTablePagination({count,page,rows}:ClientPaginationProps) {
  const {handleQueryChange} = useOrganisationOverviewParams()

  // console.group('ClientPagination')
  // console.log('rows...', rows)
  // console.log('page...', page)
  // console.log('count...', count)
  // console.log('data...', data)
  // console.groupEnd()

  // next/previous page button
  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    // Pagination component starts counting from 0, but we need to start from 1
    handleQueryChange('page',(newPage + 1).toString())
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    handleQueryChange('rows', event.target.value)
    // save to cookie
    setDocumentCookie(event.target.value,'rsd_page_rows')
  }


  return (
    <TablePagination
      component="nav"
      count={count}
      // uses 0 based index
      page={page>0 ? page-1 : 0}
      labelRowsPerPage="Items"
      onPageChange={handleTablePageChange}
      rowsPerPage={rows ?? rowsPerPageOptions[0]}
      rowsPerPageOptions={rowsPerPageOptions}
      onRowsPerPageChange={handleItemsPerPage}
    />
  )
}
