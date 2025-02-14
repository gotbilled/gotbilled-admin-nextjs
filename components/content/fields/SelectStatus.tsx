// Base
import { useState } from 'react'

// Packages
import { Typography, Status } from '@strapi/design-system'

// Interfaces
import { Item } from '@components/content/table/view/EntryData'

// Helpers
// import { publicFetch } from '@helpers/api/contentAPI'

const SelectStatus = ({ item }: { item: Item }) => {
  const getStatus = () => {
    const defaultStatus = { name: item.value as string, color: 'neutral' }

    if (!item.options) {
      return defaultStatus
    } else {
      let formattedOptions: { key: string; name: string; color?: string }[] = []

      // if (Array.isArray(item.options)) {
      formattedOptions = item.options
      // } else {
      //   const fetchedOptions = await publicFetch({ url: item.options })
      //   formattedOptions = fetchedOptions
      // }

      const selectedOption = formattedOptions.find(
        (option) => option.key == item.value
      )

      if (!selectedOption) {
        return defaultStatus
      } else {
        return {
          name: selectedOption.name,
          color: selectedOption.color || 'neutral'
        }
      }
    }
  }

  const [status, setStatus] = useState<{ name: string; color: string }>(
    getStatus()
  )

  // useEffect(() => {
  //   getStatus()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <Status variant={status.color} size="S" showBullet={false}>
      <Typography textColor={`${status.color}700`}>{status.name}</Typography>
    </Status>
  )
}

export default SelectStatus
