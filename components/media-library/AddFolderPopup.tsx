// Base
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { hidePopup, showMessage } from '@redux/slices/utilitiesSlice'

// Packages
import {
  Button,
  Typography,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  TextInput
} from '@strapi/design-system'
import { publicCreate } from '@helpers/api/contentAPI'

type Input = ChangeEvent<HTMLInputElement>

const AddFolderPopup = ({ parentId }: { parentId: string }) => {
  const router = useRouter()
  const [nameInput, setNameInput] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  const closePopup = () => {
    dispatch(hidePopup())
  }

  const saveAndClosePopup = async () => {
    if (nameInput) {
      setLoading(true)
      await publicCreate({
        url: '/directories',
        body: {
          name: nameInput,
          parent: parentId != 'root' ? parentId : null
        }
      })
      router.reload()
    } else {
      dispatch(
        showMessage({
          type: 'danger',
          title: 'Attention!',
          text: 'Empty folder name.'
        })
      )
    }
  }

  return (
    <ModalLayout onClose={closePopup} labelledBy="media">
      <ModalHeader>
        <Typography
          fontWeight="bold"
          textColor="neutral800"
          as="h2"
          id="details"
        >
          Create Folder
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Box>
          <TextInput
            label="Folder Name"
            name="name"
            value={nameInput}
            onChange={(e: Input) => setNameInput(e.target.value)}
            required
          />
        </Box>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={closePopup} loading={loading} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button onClick={saveAndClosePopup} loading={loading}>
            Create
          </Button>
        }
      />
    </ModalLayout>
  )
}

export default AddFolderPopup
