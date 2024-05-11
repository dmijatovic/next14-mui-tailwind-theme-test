
'use client'

import Link from 'next/link'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import {buildFilterUrl} from '~/utils/postgrestUrl'

type ClientPaginationProps = {
  numPages: number
  page: number
  rows?: number
  search?: string
}

export default function ClientPagination({numPages,...params}: ClientPaginationProps) {
  return (
    <div className="flex flex-wrap justify-center mb-10">
      <Pagination
        count={numPages}
        page={params.page}
        renderItem={item => {
          if (item.page !== null) {
            // build filter url
            const url = buildFilterUrl(params,'organisations')
            return (
              <Link href={url}>
                <PaginationItem {...item}/>
              </Link>
            )
          } else {
            return (
              <PaginationItem {...item}/>
            )
          }
        }}
      />
    </div>
  )
}
