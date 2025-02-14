// Base
import { useRouter } from 'next/router'

// Packages
import { Select, Option } from '@strapi/design-system'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { editQuery } from '@redux/slices/tableDataSlice'

// Helpers
import { updateQuery } from '@helpers/format/filterQuery'

const Limit = ({ disableQuery }: { disableQuery?: boolean }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    query: { limit }
  } = useAppSelector((state) => state.tableData)

  const editLimit = (limit: string) => {
    dispatch(editQuery({ limit: parseInt(limit) }))

    if (!disableQuery) {
      updateQuery({
        key: 'limit',
        value: limit != '10' && limit,
        router
      })
    }
  }

  return (
    <Select
      selectButtonTitle="Carret Down Button"
      value={limit.toString()}
      onChange={editLimit}
    >
      <Option value="10">10</Option>
      <Option value="20">20</Option>
      <Option value="50">50</Option>
    </Select>
  )
}

export default Limit
