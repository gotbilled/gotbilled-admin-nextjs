// Base
import { ChangeEvent, useState } from 'react'
import { useSession } from 'next-auth/react'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { hidePopup } from '@redux/slices/utilitiesSlice'
import { refreshData } from '@redux/slices/tableDataSlice'

// Packages
import {
  Button,
  Typography,
  CardAsset,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  TextInput
} from '@strapi/design-system'
import { filesize } from 'filesize'

// Interfaces
import { Item } from '@components/content/table/view/AssetData'

// Helpers
import { formatLongDate } from '@helpers/format/formatDate'
import { authModify, authRemove, publicRemove } from '@helpers/api/contentAPI'
import { formatImageSources } from '@helpers/format/image'

const MediaPopup = ({
  item,
  onUpdate,
  onDelete
}: {
  item: Item
  onUpdate?: Function
  onDelete: Function
}) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const [altInput, setAltInput] = useState(item.alt || '')
  const [loading, setLoading] = useState(false)

  const closePopup = () => {
    if (!loading) {
      dispatch(hidePopup())
    }
  }

  const closeAndDelete = async () => {
    dispatch(hidePopup())

    onDelete(item)
  }

  const updateAndClose = async () => {
    setLoading(true)

    if (!session?.jwt) {
      throw Error('Missing session token')
    }

    const updatedAsset = await authModify({
      url: `/assets/${item._id}`,
      body: { alt: altInput },
      token: session?.jwt
    })

    onUpdate && onUpdate(updatedAsset)

    dispatch(refreshData())
    dispatch(hidePopup())
    setLoading(false)
  }

  return (
    <ModalLayout onClose={closePopup} labelledBy="media">
      <ModalHeader>
        <Flex gap={4}>
          <Typography
            fontWeight="bold"
            textColor="neutral800"
            as="h2"
            id="details"
          >
            {item.name}
          </Typography>
        </Flex>
      </ModalHeader>
      <ModalBody>
        <Flex alignItems="stretch" gap={6}>
          <Box flex="3" className="media">
            {item.image ? (
              <CardAsset {...formatImageSources(item.image.size)} />
            ) : (
              item.file && <CardAsset>{item.ext}</CardAsset>
            )}
          </Box>

          <Box flex="2">
            <Box paddingBottom={5}>
              <Flex wrap="wrap" background="neutral100">
                <AssetInformation
                  label="Created At"
                  value={formatLongDate(item.createdAt)}
                />
                <AssetInformation
                  label="Updated At"
                  value={formatLongDate(item.updatedAt)}
                />
                <AssetInformation label="Extension" value={item.ext} />
                <AssetInformation label="Mimetype" value={item.mimetype} />
                {item.image ? (
                  <>
                    <AssetInformation
                      label="Size"
                      value={`${filesize(item.image?.size.original.size)}`}
                    />
                    <AssetInformation
                      label="Dimensions"
                      value={`${item.image.size.original.width}x${item.image.size.original.height}`}
                    />
                  </>
                ) : (
                  <>
                    <AssetInformation
                      label="Size"
                      value={`${filesize(item.file?.size)}`}
                    />
                    <AssetInformation />
                  </>
                )}
              </Flex>
            </Box>

            <TextInput
              label="Alternative text"
              hint="This text will be displayed if the asset can't be shown."
              aria-label="alt"
              name="alt"
              value={altInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAltInput(e.target.value)
              }
            />
          </Box>
        </Flex>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={closePopup} loading={loading} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <>
            <Button onClick={closeAndDelete} loading={loading} variant="danger">
              Delete
            </Button>
            <Button onClick={updateAndClose} loading={loading}>
              Update
            </Button>
          </>
        }
      />
    </ModalLayout>
  )
}

const AssetInformation = ({ label = '', value = '' }) => (
  <Box padding={4} style={{ width: '50%' }}>
    <Box paddingBottom={2}>
      <Typography variant="sigma">{label}</Typography>
    </Box>

    <Box>
      <Typography variant="omega">{value}</Typography>
    </Box>
  </Box>
)

export default MediaPopup
