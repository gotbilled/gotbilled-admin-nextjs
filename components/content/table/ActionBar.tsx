// Base
import { useState } from 'react'

// Packages
import { Box } from '@strapi/design-system'

// Interfaces
import { Info } from '../actions/ListEntries'

// Components
import Search from './Search'
import Filter from './Filter'

const ActionBar = ({
  info,
  disableQuery
}: {
  info?: Info
  disableQuery?: boolean
}) => {
  const [showFilter, setShowFilter] = useState(false)

  const toggleFilter = () => {
    setShowFilter((prevState) => !prevState)
  }

  return (
    <Box paddingTop={4} paddingBottom={4}>
      <Search setShowFilter={toggleFilter} disableQuery={disableQuery} />

      <Filter info={info} showFilter={showFilter} disableQuery={disableQuery} />
    </Box>
  )
}

export default ActionBar
