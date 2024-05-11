'use client'

import Searchbox from '~/components/form/Searchbox'
import useOrganisationOverviewParams from './useOrganisationOverviewParams'


export default function ClientSearch({search}:{search?:string}) {
  const {handleQueryChange} = useOrganisationOverviewParams()

  function handleSearch(searchFor: string) {
    handleQueryChange('search',searchFor)
  }

  return (
    <Searchbox
      placeholder='Find organisation'
      onSearch={handleSearch}
      defaultValue={search}
    />
  )
}
