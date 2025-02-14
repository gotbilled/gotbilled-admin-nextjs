// Base
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Packages
import { Flex } from '@strapi/design-system'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { editQuery } from '@redux/slices/tableDataSlice'

// Components
import {
  NextLink,
  PageLink,
  PreviousLink,
  Dots
} from '@components/custom/Pagination'

// Helpers
import { updateQuery } from '@helpers/format/filterQuery'

const Pages = ({ disableQuery }: { disableQuery?: boolean }) => {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const [pageAmount, setPageAmount] = useState(1)

  const {
    query: { limit, page },
    count
  } = useAppSelector((state) => state.tableData)

  useEffect(() => {
    setPageAmount(Math.ceil(count / limit) || 1)
  }, [limit, count])

  const editPage = (page: number) => {
    dispatch(editQuery({ page }))

    if (!disableQuery) {
      updateQuery({
        key: 'page',
        value: page > 0 && page.toString(),
        router
      })
    }
  }

  return (
    <Flex gap={2}>
      <PreviousLink page={page - 1} disabled={page == 0} onClick={editPage} />

      {page > 0 && <PageLink page={0} onClick={editPage} />}

      {page > 2 && <Dots>And other pages</Dots>}

      {page > 1 && <PageLink page={page - 1} onClick={editPage} />}

      <PageLink page={page} disabled onClick={editPage} />

      {page < pageAmount - 2 && <PageLink page={page + 1} onClick={editPage} />}

      {page < pageAmount - 3 && <Dots>And other pages</Dots>}

      {page < pageAmount - 1 && (
        <PageLink page={pageAmount - 1} onClick={editPage} />
      )}

      <NextLink
        page={page + 1}
        disabled={page == pageAmount - 1}
        onClick={editPage}
      />
    </Flex>
  )
}

export default Pages
