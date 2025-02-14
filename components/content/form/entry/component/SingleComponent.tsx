// Base
import { useState } from 'react'

// Packages
import {
  AccordionGroup,
  Accordion,
  AccordionToggle,
  AccordionContent,
  Stack,
  IconButton
} from '@strapi/design-system'
import { Trash } from '@strapi/icons'

// Components
import EntryForm from '@components/content/form/entry/EntryForm'
import EmptyComponent from './EmptyComponent'
import Label from '@components/custom/Label'

// Interfaces
import { Item } from '@components/content/form/FormData'

// Helpers
import { formatData } from '@helpers/format/formatEntry'
import { fromatTitle } from '@helpers/format/components'

const SingleComponent = ({
  item,
  value,
  parentPath,
  localized,
  onChange,
  disabled
}: {
  item: Item
  value: any
  parentPath: string
  localized?: boolean
  onChange: Function
  disabled?: boolean
}) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const addEntry = async () => {
    onChange(formatData(item.entry))
    setExpanded(true)
  }

  const changeField = (key: string, fieldValue: object, override: boolean) => {
    onChange({ ...value, [key]: fieldValue }, override)
  }

  const deleteEntry = () => {
    onChange(null)
  }

  const expandEntry = () => {
    setExpanded((prevState) => !prevState)
  }

  if (!value) {
    return (
      <EmptyComponent
        label={item.name}
        required={item.required}
        onClick={addEntry}
        disabled={disabled}
      />
    )
  }

  if (item.raw) {
    return (
      <EntryForm
        entry={item.entry}
        parentPath={`${parentPath ? `${parentPath}.` : ''}${item.key}`}
        raw={item.raw}
      />
    )
  }

  return (
    <div>
      {/* {item.primary && <Label label={item.name} required={item.required} />} */}
      <Label label={item.name} required={item.required} localized={localized} />
      <AccordionGroup>
        <Accordion
          expanded={expanded}
          onToggle={expandEntry}
          size="S"
          variant="secondary"
        >
          <AccordionToggle
            title={fromatTitle({ item, data: value })}
            togglePosition="left"
            action={
              !item.required && (
                <Stack horizontal spacing={0}>
                  <IconButton
                    noBorder
                    onClick={deleteEntry}
                    label="Delete"
                    icon={<Trash />}
                    disabled={disabled}
                  />
                </Stack>
              )
            }
          />
          <AccordionContent>
            <EntryForm
              entry={item.entry}
              parentPath={`${parentPath ? `${parentPath}.` : ''}${item.key}`}
              onChangeEntry={(key: string, value: object, override: boolean) =>
                changeField(key, value, override)
              }
              localized={localized}
            />
          </AccordionContent>
        </Accordion>
      </AccordionGroup>
    </div>
  )
}

export default SingleComponent
