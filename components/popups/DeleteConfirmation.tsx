// Base
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { hidePopup } from '@redux/slices/utilitiesSlice'

// Packages
import {
  Button,
  Typography,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Icon
} from '@strapi/design-system'
import { ExclamationMarkCircle } from '@strapi/icons'

// Helpers
import { authRemove } from '@helpers/api/contentAPI'

const DeleteConfirmation = ({
  description,
  endpoint,
  ids,
  onComplete
}: {
  description: string
  endpoint: string
  ids: string[]
  onComplete?: Function
}) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const closePopup = () => {
    if (!loading) {
      dispatch(hidePopup())
    }
  }

  const deleteAndConfirm = async () => {
    setLoading(true)

    if (!session?.jwt) {
      throw Error('Missing session token')
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      await authRemove({
        url: `${endpoint}/${id}`,
        token: session?.jwt
      })
    }

    if (onComplete) {
      onComplete()
      dispatch(hidePopup())
    } else {
      router.reload()
    }
  }

  return (
    <ModalLayout onClose={closePopup} labelledBy="delete">
      <ModalHeader>
        <Typography variant="beta">Please confirm</Typography>
      </ModalHeader>
      <ModalBody>
        <Flex direction="column" gap={4}>
          <Icon
            width={6}
            height={6}
            color="danger600"
            as={ExclamationMarkCircle}
          />
          <Typography variant="omega" textColor="danger600">
            {description}
          </Typography>
        </Flex>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button loading={loading} onClick={closePopup} variant="tertiary">
            No, Cancel
          </Button>
        }
        endActions={
          <Button loading={loading} onClick={deleteAndConfirm} variant="danger">
            Finish
          </Button>
        }
      />
    </ModalLayout>
  )
}

export default DeleteConfirmation
