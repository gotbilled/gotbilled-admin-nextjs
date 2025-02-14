// Base
import { ChangeEvent, useState } from 'react'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { hidePopup } from '@redux/slices/utilitiesSlice'
import { refreshData } from '@redux/slices/tableDataSlice'

// Interfaces
import { Item } from '@components/content/table/view/AssetData'

// Packages
import {
  Button,
  Typography,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  Icon,
  IconButton
} from '@strapi/design-system'
import { CloudUpload, ChevronLeft } from '@strapi/icons'

// Helpers
import { authCreate } from '@helpers/api/contentAPI'

// Components
import AssetItem from '@components/content/table/items/AssetItem'
import { useSession } from 'next-auth/react'

export interface Asset {
  name: string
  mimetype: string
  ext: string
  url: string
  file: File
  status: 'draft' | 'uploading' | 'completed'
}

const getAssetID = (asset: Asset) => {
  return `${asset.name}-${asset.mimetype}`
}

const UploadAssetPopup = ({
  onUploaded,
  mimetype
}: {
  onUploaded?: Function
  mimetype?: string
}) => {
  const dispatch = useAppDispatch()

  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)

  const closePopup = () => {
    if (!loading) {
      dispatch(hidePopup())
    }
  }

  return (
    <ModalLayout onClose={closePopup} labelledBy="media">
      <ModalHeader>
        <Flex gap={4}>
          {assets.length > 0 && (
            <IconButton
              onClick={() => {
                !loading && setAssets([])
              }}
              label="Back"
              icon={<ChevronLeft />}
            />
          )}
          <Typography
            fontWeight="bold"
            textColor="neutral800"
            as="h2"
            id="details"
          >
            Upload Assets
          </Typography>
        </Flex>
      </ModalHeader>
      <ModalBody>
        {assets.length == 0 ? (
          <ImportAssets setAssets={setAssets} mimetype={mimetype} />
        ) : (
          <PreviewAssets
            assets={assets}
            setAssets={setAssets}
            loading={loading}
          />
        )}
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={closePopup} loading={loading} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          assets.length > 0 && (
            <UploadAssetsButton
              assets={assets}
              setAssets={setAssets}
              loading={loading}
              setLoading={setLoading}
              onUploaded={onUploaded}
            />
          )
        }
      />
    </ModalLayout>
  )
}

const ImportAssets = ({
  setAssets,
  mimetype
}: {
  setAssets: Function
  mimetype?: string
}) => {
  const importAssets = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    const importedAssets: Asset[] = []
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        const splittedName = file.name.split('.')

        importedAssets.push({
          name: splittedName.slice(0, -1).join(),
          mimetype: file.type,
          ext: `.${splittedName[splittedName.length - 1]}`,
          url: URL.createObjectURL(file),
          file,
          status: 'draft'
        })
      }

      setAssets(importedAssets)
    }
  }

  return (
    <Box
      background="neutral100"
      padding={6}
      borderWidth={`2px`}
      borderColor="neutral200"
      borderStyle="dashed"
    >
      <div className="upload-asset">
        <Flex direction="column" gap={3}>
          <Icon
            as={CloudUpload}
            width={`3rem`}
            height={`3rem`}
            color="neutral200"
          />
          <Typography variant="omega" fontWeight="semiBold">
            Drag & drop to upload or
          </Typography>
          <Button>Browse files</Button>

          <input
            type="file"
            name="asset"
            id="asset"
            accept={mimetype}
            multiple
            onChange={(e) => {
              importAssets(e)
            }}
          />
        </Flex>
      </div>
    </Box>
  )
}

const PreviewAssets = ({
  assets,
  setAssets,
  loading
}: {
  assets: Asset[]
  setAssets: Function
  loading: boolean
}) => {
  const deleteAsset = (deletedAsset: Item) => {
    if (loading) {
      return
    }

    setAssets((prevState: Asset[]) =>
      prevState.filter((asset: Asset) => getAssetID(asset) != deletedAsset._id)
    )
  }

  return (
    <Box>
      <Box paddingBottom={6}>
        <Flex justifyContent="space-between">
          <Box>
            <Box>
              <Typography variant="pi" fontWeight="bold">
                {assets.length} assets selected
              </Typography>
            </Box>
            <Box>
              <Typography variant="pi" textColor="neutral500">
                Manage the assets before adding them to the Media Library
              </Typography>
            </Box>
          </Box>
        </Flex>
      </Box>

      <Flex gap={4} wrap="wrap">
        {assets.map((asset) => (
          <AssetItem
            item={{
              _id: getAssetID(asset),
              name: asset.name,
              ext: asset.ext,
              mimetype: asset.mimetype,
              createdAt: '',
              updatedAt: ''
            }}
            upload={{
              imageURL: asset.mimetype.includes('image') ? asset.url : undefined
            }}
            loading={asset.status == 'uploading'}
            disableActions={asset.status != 'draft'}
            onDelete={deleteAsset}
            key={getAssetID(asset)}
          />
        ))}
      </Flex>
    </Box>
  )
}

const UploadAssetsButton = ({
  assets,
  setAssets,
  loading,
  setLoading,
  onUploaded
}: {
  assets: Asset[]
  setAssets: Function
  loading: boolean
  setLoading: Function
  onUploaded?: Function
}) => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const uploadAssets = async () => {
    setLoading(true)

    setAssets((prevState: Asset[]) =>
      prevState.map((assets: Asset) => ({ ...assets, status: 'uploading' }))
    )

    const uploadedAssets = await uploadMultipleAssets(assets)

    const fulfilledAssets: Item[] = []

    uploadedAssets.forEach((asset) => {
      if (asset.status == 'fulfilled') {
        fulfilledAssets.push(asset.value as Item)
      }
    })

    onUploaded && onUploaded(fulfilledAssets)
    dispatch(refreshData())
    dispatch(hidePopup())
    setLoading(false)
  }

  const uploadMultipleAssets = (uploadAssets: Asset[]) => {
    return Promise.allSettled(
      uploadAssets.map((asset) => uploadSingleAsset(asset))
    )
  }

  const uploadSingleAsset = (asset: Asset) => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData()
      formData.append('file', asset.file)

      if (!session?.jwt) {
        return reject('Missing session token')
      }

      const uploadedAsset = await authCreate({
        url: '/assets',
        body: formData,
        token: session.jwt
      })

      setAssets((prevState: Asset[]) =>
        prevState.map((currentAsset) => {
          if (getAssetID(currentAsset) == getAssetID(asset)) {
            return {
              ...currentAsset,
              status: 'completed'
            }
          } else {
            return currentAsset
          }
          return
        })
      )
      resolve(uploadedAsset)
    })
  }

  return (
    <Button onClick={uploadAssets} loading={loading}>
      Upload
    </Button>
  )
}

export {
  UploadAssetPopup as default,
  ImportAssets,
  PreviewAssets,
  UploadAssetsButton
}
