// Base
import { useEffect, useState } from 'react'

// Auth
import { useSession } from 'next-auth/react'

// Redux
import { useAppSelector } from '@redux/hooks'

// Helpers
import { authFetch } from '@helpers/api/contentAPI'

// Packages
import { Select, Option, Flex } from '@strapi/design-system'

// COmponents
import { RelationInput } from '@components/content/form/Relation'

type MessageType = 'group' | 'direct'

type GroupType = 'allContacts'

export interface Contact {
  _id: string
  email: string
}

const SelectContacts = ({
  contacts,
  setContacts,
  onLoading
}: {
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
  onLoading: (isLoading: boolean) => void
}) => {
  const [messageType, setMessageType] = useState<MessageType>()

  const handleMessageTypeChange = (type: MessageType) => {
    setMessageType(type)
    setContacts([])
  }

  return (
    <Flex alignItems="start" direction="column" gap={4}>
      <Select
        label="Mesage Type"
        placeholder="Select message type"
        value={messageType}
        onChange={handleMessageTypeChange}
      >
        <Option value="group">Group Message</Option>
        <Option value="direct">Direct Message</Option>
      </Select>

      <SelectMessageContacts
        messageType={messageType}
        contacts={contacts}
        setContacts={setContacts}
        onLoading={onLoading}
      />
    </Flex>
  )
}

const SelectMessageContacts = ({
  messageType,
  contacts,
  setContacts,
  onLoading
}: {
  messageType?: MessageType
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
  onLoading: (isLoading: boolean) => void
}) => {
  switch (messageType) {
    case 'direct':
      return (
        <RelationInput
          relation={{
            name: 'Contacts',
            key: 'contacts',
            path: '/contacts',
            content: {
              name: 'email',
              key: '_id',
              path: 'content/contacts'
            },
            relation: 'multi',
            disabled: false,
            required: false
          }}
          data={contacts}
          onChange={setContacts}
        />
      )
    case 'group':
      return <GroupSelect setContacts={setContacts} onLoading={onLoading} />
    default:
      return null
  }
}

const GroupSelect = ({
  setContacts,
  onLoading
}: {
  setContacts: (contacts: Contact[]) => void
  onLoading: (isLoading: boolean) => void
}) => {
  const { event } = useAppSelector((state) => state.staticProps)

  const { data: session } = useSession()

  const [groupType, setGroupType] = useState<GroupType>()

  useEffect(() => {
    setGroupType(undefined)
  }, [])

  const handleGroupSelect = async (type: GroupType) => {
    if (!session?.jwt) {
      return
    }

    onLoading(true)

    setGroupType(type)

    switch (type) {
      case 'allContacts':
        {
          const contacts: Contact[] = await authFetch({
            url: '/contacts',
            params: {
              _select: ['email']
            },
            token: session?.jwt
          })

          setContacts(contacts)
        }
        break
      default:
        break
    }

    onLoading(false)
  }

  return (
    <Select
      label="Group"
      placeholder="Select group contacts"
      value={groupType}
      onChange={handleGroupSelect}
    >
      <Option value="allContacts">All Contacts</Option>
    </Select>
  )
}

export default SelectContacts
