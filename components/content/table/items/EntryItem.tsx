// Packages
import { Typography, AvatarGroup, Status, Badge } from '@strapi/design-system'

// Interfaces
import { Item } from '@components/content/table/view/EntryData'

// Components
import SelectStatus from '@components/content/fields/SelectStatus'
import AssetAvatar from '@components/content/fields/AssetAvatar'

// Helpers
import { formatLongDate, formatShortDate } from '@helpers/format/formatDate'
import { getDefaultCurrency } from '@helpers/format/formatCurrency'

const EntryItem = ({ item }: { item: Item }) => {
  switch (item.type) {
    case 'string':
      return <Typography textColor="neutral800">{item.value || '-'}</Typography>
    case 'number':
      return (
        <Typography textColor="neutral800">
          {item.value || item.value === 0 ? item.value : '-'}
        </Typography>
      )
    case 'boolean':
      return item.value ? (
        <Status variant="success" size="S" showBullet={false}>
          <Typography textColor="success700">True</Typography>
        </Status>
      ) : (
        <Status variant="danger" size="S" showBullet={false}>
          <Typography textColor="danger700">False</Typography>
        </Status>
      )
    case 'select':
      return item.value ? <SelectStatus item={item} /> : <p>-</p>
    case 'asset':
      if (Array.isArray(item.value)) {
        return (
          <AvatarGroup>
            {item.value.map((singleItem, i) => (
              <AssetAvatar item={singleItem} key={i} />
            ))}
          </AvatarGroup>
        )
      } else {
        return <AssetAvatar item={item.value} />
      }
    case 'date':
      return (
        <Typography textColor="neutral800">
          {formatShortDate(item.value) || '-'}
        </Typography>
      )
    case 'datetime':
      return (
        <Typography textColor="neutral800">
          {formatLongDate(item.value) || '-'}
        </Typography>
      )
    case 'array':
      return item.value ? <Badge>{item.value.length}</Badge> : <p>-</p>
    case 'currency':
      return (
        <Typography textColor="neutral800">
          {getDefaultCurrency()?.symbol}{' '}
          {item.value || item.value === 0 ? item.value : '-'}
        </Typography>
      )
    default:
      return null
  }
}

export default EntryItem
