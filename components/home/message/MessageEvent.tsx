// Packages
import { Typography, Button } from '@strapi/design-system'
import { Envelop, Discuss } from '@strapi/icons'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { showPopup } from '@redux/slices/utilitiesSlice'

// Components
import EntryBox from '@components/content/form/entry/EntryBox'
import EmailModal from './EmailModal'

const MessageEvent = () => {
  const dispatch = useAppDispatch()

  const openEmailModal = () => {
    dispatch(
      showPopup({
        content: <EmailModal />
      })
    )
  }

  return (
    <EntryBox>
      <Typography variant="pi" fontWeight="bold">
        Contacts
      </Typography>
      <Button
        loading={false}
        startIcon={<Envelop />}
        onClick={openEmailModal}
        variant="default"
      >
        Send Email
      </Button>
    </EntryBox>
  )
}

export default MessageEvent
