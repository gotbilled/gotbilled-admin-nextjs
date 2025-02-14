// Packages
import { Avatar, Initials } from '@strapi/design-system'

// Helpers
import { formatImageSources } from '@helpers/format/image'

const AssetAvatar = ({ item }: { item: any }) => {
  if (!item) {
    return <p>-</p>
  }

  if (item.image) {
    return (
      <Avatar
        {...formatImageSources(item.image.size)}
        alt={item.alt || ''}
        preview
      />
    )
  } else {
    return <Initials>{item.name[0]}</Initials>
  }
}

export default AssetAvatar
