// Base
import { useState } from 'react'

// Auth
import { useSession } from 'next-auth/react'

// Packages
import { SimpleMenu, MenuItem, IconButton } from '@strapi/design-system'
import { Download } from '@strapi/icons'

// Redux
import { useAppSelector } from '@redux/hooks'

// Helpers
import { searchMultipleFields } from '@helpers/api/endpoints'
import { filterToObject } from '@helpers/format/filterQuery'
import { authFetch } from '@helpers/api/contentAPI'
import fileDownload from 'js-file-download'

const ExportData = () => {
  const { data: session } = useSession()

  const { query } = useAppSelector((state) => state.tableData)

  const {
    listView: { path, populate, filter = [] },
    searchFields
  } = useAppSelector((state) => state.staticProps)

  const [exportInProgress, setExportInProgress] = useState(false)

  const exportData = async (type: 'page' | 'all') => {
    // setExportInProgress(true)

    if (session?.jwt) {
      const data = await authFetch({
        url: `${path}/export`,
        params: {
          _populate: populate,
          _skip: type == 'page' && query.page * query.limit,
          _limit: type == 'page' && query.limit,
          _sort: query.sort && `${query.sort.key}:${query.sort.order}`,
          ...searchMultipleFields({
            conditional: '_or',
            fields: searchFields,
            value: query.search,
            operation: '~'
          }),
          ...filterToObject([...filter, ...query.filter])
        },
        token: session.jwt
      })

      fileDownload(data.file, data.filename)
    }

    // setExportInProgress(false)
  }

  return (
    <SimpleMenu
      disabled={exportInProgress}
      label="Export"
      as={IconButton}
      icon={<Download />}
    >
      <MenuItem onClick={() => exportData('page')}>
        Export Current Page Entries
      </MenuItem>
      <MenuItem onClick={() => exportData('all')}>Export All Entries</MenuItem>
    </SimpleMenu>
  )
}

export default ExportData
