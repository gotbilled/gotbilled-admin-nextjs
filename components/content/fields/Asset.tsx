// Base
import { useEffect, useState } from 'react'

// Redux
import { showPopup } from '@redux/slices/utilitiesSlice'
import { useAppDispatch } from '@redux/hooks'

// Packages
import {
  CarouselInput,
  CarouselActions,
  CarouselSlide,
  CarouselImage,
  Typography,
  IconButton,
  Flex,
  Box,
  Icon
} from '@strapi/design-system'
import {
  Pencil,
  Plus,
  Trash,
  PicturePlus,
  FileError,
  Earth
} from '@strapi/icons'

// Interfaces
import { Item } from '@components/content/table/view/AssetData'

// Components
import SelectAssetPopup from '@components/media-library/SelectAssetPopup'
import MediaPopup from '@components/media-library/MediaPopup'

// Helpers
import { formatImageSources } from '@helpers/format/image'

const Asset = ({
  label,
  value,
  onChange,
  relation,
  mimetype,
  localized,
  required = false,
  disabled = false
}: {
  label: string
  value: Item
  onChange: Function
  relation?: 'single' | 'multi'
  mimetype?: string
  localized?: boolean
  required?: boolean
  disabled?: boolean
}) => {
  const [slide, setSlide] = useState(0)
  const [assets, setAssets] = useState<Item[]>([])
  const [onHover, setOnHover] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (value instanceof Array) {
      setAssets(value)
    } else if (value) {
      setAssets([value])
    } else {
      setAssets([])
    }
  }, [value])

  const nextSlide = () => {
    setSlide((prevState) =>
      prevState < assets.length - 1 ? prevState + 1 : prevState
    )
  }

  const previousSlide = () => {
    setSlide((prevState) => (prevState > 0 ? prevState - 1 : prevState))
  }

  const openAddAsset = () => {
    setSlide(0)
    dispatch(
      showPopup({
        content: (
          <SelectAssetPopup
            mimetype={mimetype}
            relation={relation}
            selectedAssets={assets}
            onChange={onChange}
          />
        )
      })
    )
  }

  const deleteSingleAsset = (removedAsset: Item) => {
    switch (relation) {
      case 'single':
        onChange(undefined)
        break
      case 'multi':
        onChange(
          assets.filter((asset) => asset._id != removedAsset._id),
          true
        )
        break
    }
  }

  const deleteAllAssets = () => {
    switch (relation) {
      case 'single':
        onChange(null)
        break
      case 'multi':
        onChange([], true)
        break
    }
  }

  const updateAssetDetails = (updatedAsset: Item) => {
    switch (relation) {
      case 'single':
        onChange(updatedAsset)
        break
      case 'multi':
        onChange(
          assets.map((asset) =>
            asset._id == updatedAsset._id ? updatedAsset : asset
          ),
          true
        )
        break
    }
  }

  const openEditAsset = () => {
    dispatch(
      showPopup({
        content: (
          <MediaPopup
            item={assets[slide]}
            onUpdate={updateAssetDetails}
            onDelete={deleteSingleAsset}
          />
        )
      })
    )
  }

  return (
    <CarouselInput
      label={`${label} ${relation == 'multi' ? `(${assets.length})` : ''}`}
      labelAction={localized && <Earth />}
      selectedSlide={slide}
      secondaryLabel={
        assets.length > 0 ? `${assets[slide]?.name}${assets[slide]?.ext}` : ''
      }
      nextLabel="Next slide"
      previousLabel="Previous slide"
      onNext={nextSlide}
      onPrevious={previousSlide}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      actions={
        assets.length > 0 &&
        onHover && (
          <CarouselActions>
            <IconButton label="Add" icon={<Plus />} onClick={openAddAsset} />
            <IconButton
              label="Edit"
              icon={<Pencil />}
              onClick={openEditAsset}
            />
            <IconButton
              label="Delete"
              icon={<Trash />}
              onClick={deleteAllAssets}
            />
          </CarouselActions>
        )
      }
      style={{ height: '100%' }}
      required={required}
      disabled={disabled}
    >
      {assets.length === 0 ? (
        <Box
          paddingTop={4}
          paddingBottom={4}
          onClick={openAddAsset}
          role="button"
        >
          <Flex
            direction="column"
            justifyContent="center"
            gap={4}
            style={{ height: '100%' }}
          >
            <Icon
              width="3rem"
              height="3rem"
              as={PicturePlus}
              color="primary600"
            />
            <p className="text-center">
              <Typography variant="pi" fontWeight="bold" textColor="neutral600">
                Click here to select an asset
              </Typography>
            </p>
          </Flex>
        </Box>
      ) : (
        assets.map((asset, i) => (
          <CarouselSlide
            label={`${i + 1} of ${assets.length} assets`}
            key={asset._id}
          >
            {asset.image ? (
              <CarouselImage
                {...formatImageSources(asset.image.size)}
                alt={asset.alt}
              />
            ) : (
              asset.file && <Typography variant="omega">{asset.ext}</Typography>
            )}
          </CarouselSlide>
        ))
      )}
    </CarouselInput>
  )
}

export default Asset
