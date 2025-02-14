// Base
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

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
  Combobox,
  ComboboxOption,
  Flex
} from '@strapi/design-system'

// Components
import SelectContacts, { Contact } from './SelectContacts'

// Helpers
import { useFetch } from '@helpers/api/useFetch'
import { authCreate, authFetch } from '@helpers/api/contentAPI'

interface Template {
  id: string
  name: string
  image_path: string
  created_at: string
  variables: {
    variables: object[]
    personalization: object[]
  }
}

const EmailModal = () => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])

  const [templateId, setTemplateId] = useState<string>()
  const [emailImage, setEmailImage] = useState<string>()

  const {
    data: templates,
    validating
  }: { data: Template[]; validating: boolean } = useFetch(
    session && {
      url: '/emails/templates',
      token: session.jwt
    },
    authFetch,
    []
  )

  const handleEmailSend = async () => {
    if (!session?.jwt) {
      return
    }

    setLoading(true)

    try {
      await authCreate({
        url: '/emails/send',
        body: {
          recipients: contacts.map((contact) => ({
            email: contact.email,
            contactId: contact._id
          })),
          templateId
        },
        token: session.jwt
      })

      dispatch(
        showMessage({
          type: 'success',
          title: 'Success!',
          text: 'Email has been scheduled to send to all recipients.'
        })
      )
    } catch {
      dispatch(
        showMessage({
          type: 'danger',
          title: 'Attention!',
          text: 'Something went wrong, please contact developer.'
        })
      )
    }

    dispatch(hidePopup())

    setLoading(false)
  }

  const handleSelectTemplate = (selectedTemplateId: string) => {
    setTemplateId(selectedTemplateId)

    const template = templates.find(
      (template) => template.id == selectedTemplateId
    )

    if (template) {
      setEmailImage(template.image_path)
    } else {
      setEmailImage(undefined)
    }
  }

  const closePopup = () => {
    if (!loading) {
      dispatch(hidePopup())
    }
  }

  const handleSetContacts = (updatedContacts: Contact[]) => {
    setContacts(
      updatedContacts.filter(
        (value, index, self) =>
          index === self.findIndex((contact) => contact.email === value.email)
      )
    )
  }

  return (
    <ModalLayout onClose={closePopup} labelledBy="delete">
      <ModalHeader>
        <Typography variant="beta">Send Email</Typography>
      </ModalHeader>
      <ModalBody>
        <Flex justifyContent="space-between">
          <Flex alignItems="start" direction="column" gap={4}>
            <SelectContacts
              contacts={contacts}
              setContacts={handleSetContacts}
              onLoading={setLoading}
            />
            <Combobox
              label="Email Template"
              value={templateId}
              onChange={handleSelectTemplate}
              disabled={validating}
            >
              {templates
                ?.filter(
                  (template) =>
                    template.variables.variables.length == 0 &&
                    template.variables.personalization.hasOwnProperty(
                      'contactId'
                    )
                )
                .map((template) => (
                  <ComboboxOption value={template.id} key={template.id}>
                    {`${template.name} (${template.id})`}
                  </ComboboxOption>
                ))}
            </Combobox>
          </Flex>
          {emailImage && (
            <Image
              src={emailImage}
              width={396}
              height={298}
              alt="Email Preview"
              unoptimized
            />
          )}
        </Flex>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button loading={loading} onClick={closePopup} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button
            loading={loading}
            onClick={handleEmailSend}
            variant="default"
            disabled={contacts.length == 0 || !templateId}
          >
            Send {contacts.length} Emails
          </Button>
        }
      />
    </ModalLayout>
  )
}

export default EmailModal
