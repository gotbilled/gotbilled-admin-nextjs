// Base
import { useState } from 'react'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { showPopup } from '@redux/slices/utilitiesSlice'

// Packages
import {
  Card,
  CardBody,
  CardContent,
  CardTitle,
  CardSubtitle,
  CardHeader,
  CardCheckbox,
  CardAsset,
  CardBadge,
  CardAction,
  IconButton,
  Loader,
  Typography
} from '@strapi/design-system'
import { Pencil, Trash, Duplicate } from '@strapi/icons'

// Interfaces
import { Item } from '@components/content/table/view/AssetData'

// Components
import MediaPopup from '@components/media-library/MediaPopup'

// Helpers
import { formatImageSources } from '@helpers/format/image'

const AssetItem = ({
  item,
  upload,
  selected,
  loading,
  disableActions,
  onSelect,
  onUpdate,
  onDelete
}: {
  item: Item
  upload?: { imageURL?: string }
  loading?: boolean
  selected?: boolean
  disableActions?: boolean
  onSelect?: Function
  onUpdate?: Function
  onDelete: Function
}) => {
  const [onHover, setOnHover] = useState(false)

  const dispatch = useAppDispatch()

  const openModal = () => {
    dispatch(
      showPopup({
        content: (
          <MediaPopup item={item} onUpdate={onUpdate} onDelete={onDelete} />
        )
      })
    )
  }

  const handleCopy = (item: Item) => {
    const url = item.image?.size.original.url || item.file?.url
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`)
  }

  return (
    <Card
      style={{
        width: '240px'
      }}
      id="third"
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      {loading && <Loader>Loading content...</Loader>}
      <CardHeader>
        {onSelect && <CardCheckbox value={selected} onClick={onSelect} />}
        <CardAction position="end">
          {!disableActions && onHover && (
            <>
              <IconButton
                label="Copy Link"
                onClick={() => handleCopy(item)}
                icon={<Duplicate />}
              />
              <IconButton
                label="Delete"
                onClick={() => onDelete(item)}
                icon={<Trash />}
              />
              {!upload && (
                <IconButton
                  label="Edit"
                  onClick={openModal}
                  icon={<Pencil />}
                />
              )}
            </>
          )}
        </CardAction>
        {item.image ? (
          <CardAsset {...formatImageSources(item.image.size)} />
        ) : upload && upload.imageURL ? (
          <CardAsset src={upload.imageURL} />
        ) : (
          <CardAsset>{item.ext}</CardAsset>
        )}
      </CardHeader>
      <CardBody className="drag">
        <CardContent>
          <CardTitle>
            <Typography ellipsis>{item.name}</Typography>
          </CardTitle>
          <CardSubtitle>
            {item.ext}
            {item.image
              ? ` - ${item.image.size.original.width}x${item.image.size.original.height}`
              : ''}
          </CardSubtitle>
        </CardContent>
        <CardBadge>{item.mimetype}</CardBadge>
      </CardBody>
    </Card>
  )
}

export default AssetItem
