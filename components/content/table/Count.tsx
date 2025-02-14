// Base
import { useEffect, useState } from 'react'

// Auth
import { useSession } from 'next-auth/react'

// Packages
import { Box, Typography } from '@strapi/design-system'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { editTableData } from '@redux/slices/tableDataSlice'

// Interfaces
import { Info } from '@components/content/actions/ListEntries'

// Helpers
import { authFetch } from '@helpers/api/contentAPI'
import { searchMultipleFields } from '@helpers/api/endpoints'
import { useFetch } from '@helpers/api/useFetch'
import { filterToObject } from '@helpers/format/filterQuery'

// Components
import Placeholder from '@components/app/Placeholder'

const Count = ({ info }: { info?: Info }) => {
  const { data: session } = useSession()

  const dispatch = useAppDispatch()

  const staticProps = useAppSelector((state) => state.staticProps as Info)

  const [
    {
      listView: { path, filter = [] },
      searchFields
    },
    setInfo
  ] = useState<Info>(info || staticProps)

  const { count, query, refresh } = useAppSelector((state) => state.tableData)

  const {
    data: fetchedCount,
    refresh: refreshCount,
    validating
  } = useFetch(
    session &&
      query.loaded && {
        url: `${path}/count`,
        params: {
          ...searchMultipleFields({
            conditional: '_or',
            fields: searchFields,
            value: query.search,
            operation: '~'
          }),
          ...filterToObject([...filter, ...query.filter])
        },
        token: session.jwt
      },
    authFetch,
    [path, query.loaded, query.search, query.filter, session?.jwt]
  )

  useEffect(() => {
    setInfo(info || staticProps)
  }, [info, staticProps])

  useEffect(() => {
    if (refresh > 0) {
      refreshCount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  useEffect(() => {
    if (fetchedCount) {
      dispatch(editTableData({ count: fetchedCount.count }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedCount])

  return (
    <Placeholder
      loading={validating}
      template={{
        width: 100,
        height: 20,
        alignContent: 'flex-start'
      }}
    >
      <Box>
        <Typography textColor="neutral600">{count} entries found</Typography>
      </Box>
    </Placeholder>
  )
}

export default Count
