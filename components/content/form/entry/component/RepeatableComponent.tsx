// Base
import { useState } from 'react'

// Packages
import {
  AccordionGroup,
  Accordion,
  AccordionToggle,
  AccordionContent,
  Flex,
  TextButton,
  Stack,
  SimpleMenu,
  MenuItem,
  IconButton
} from '@strapi/design-system'
import { Plus, Drag, Trash } from '@strapi/icons'

// Components
import EntryForm from '@components/content/form/entry/EntryForm'
import EmptyComponent from './EmptyComponent'
import Label from '@components/custom/Label'
import SortableList from '@components/custom/SortableList'

// Interfaces
import { Item } from '@components/content/form/FormData'

// Helpers
import { formatData } from '@helpers/format/formatEntry'
import { fromatTitle } from '@helpers/format/components'

export interface DynamicEntry {
  name: string
  key: string
  entry: [Item[]]
}

interface DynamicValue {
  component: string
  [key: string]: any
}

interface ComponentData {
  item: Item
  data: DynamicValue
}

const RepeatableComponent = ({
  item,
  value,
  dynamic,
  localized,
  parentPath,
  onChange,
  disabled
}: {
  item: Item
  value: any
  localized?: boolean
  dynamic?: boolean
  parentPath: string
  onChange: Function
  disabled: boolean
}) => {
  const [expanded, setExpanded] = useState<number | null>(null)

  const addEntry = async (component?: string) => {
    const formattedData = getFormattedData(component)
    const updatedEntry = value ? [...value, formattedData] : [formattedData]
    onChange(updatedEntry)
    expandEntry(updatedEntry.length - 1)
  }

  const getFormattedData = (component?: string) => {
    if (!dynamic) {
      return formatData(item.entry)
    } else if (component) {
      const dynamicComponent = findDynamicComponent({
        item,
        data: { component }
      })

      return {
        ...formatData(dynamicComponent?.entry),
        component
      }
    }
  }

  const changeField = (key: string, fieldValue: object, index: number) => {
    const updatedEntry = value.map((item: object, i: number) =>
      index == i ? { ...item, [key]: fieldValue } : item
    )
    onChange(updatedEntry, true)
  }

  const deleteEntry = (index: number) => {
    const updatedEntry = value.filter((item: object, i: number) => index != i)

    onChange(updatedEntry, true)
  }

  const changeSort = (data: any[], fromIndex: number, toIndex: number) => {
    if (isExpanded(fromIndex)) {
      setExpanded(toIndex)
    } else if (isExpanded(toIndex)) {
      setExpanded((prevState) => prevState! - 1)
    } else if (expanded) {
      if (fromIndex > expanded && expanded > toIndex) {
        setExpanded((prevState) => prevState! + 1)
      } else if (fromIndex < expanded && expanded < toIndex) {
        setExpanded((prevState) => prevState! - 1)
      }
    }

    onChange(data, true)
  }

  const expandEntry = (i: number) => {
    setExpanded(isExpanded(i) ? null : i)
  }

  const isExpanded = (i: number) => {
    return expanded == i
  }

  const getEntry = ({ item, data }: ComponentData) => {
    if (!dynamic) {
      return item.entry
    } else {
      const component = findDynamicComponent({ item, data })

      if (component) {
        return component.entry
      }
    }
  }

  const getTitle = ({ item, data }: ComponentData) => {
    if (!dynamic) {
      return fromatTitle({ item, data })
    } else {
      const component = findDynamicComponent({ item, data })

      if (component) {
        return component.name
      }
    }
  }

  const findDynamicComponent = ({ item, data }: ComponentData) => {
    const dynamicEntry = getDynamicEntry(item.entry)
    if (dynamicEntry) {
      return dynamicEntry.find(
        (dynamicEntry) => dynamicEntry.key == data.component
      )
    }
  }

  const getDynamicEntry = (entry?: [Item[]]) => {
    if (entry) {
      return entry as unknown as DynamicEntry[]
    }
  }

  if (!value || value.length == 0) {
    return (
      <EmptyComponent
        label={`${item.name} (0)`}
        dynamicComponent={dynamic && getDynamicEntry(item.entry)}
        required={item.required}
        onClick={addEntry}
        disabled={disabled}
      />
    )
  }

  return (
    <div>
      <Label
        label={`${item.name} (${value.length}) `}
        required={item.required}
        localized={localized}
      />
      <AccordionGroup
        footer={
          <Flex justifyContent="center" height="48px" background="primary100">
            {!dynamic ? (
              <TextButton
                onClick={addEntry}
                startIcon={<Plus />}
                disabled={disabled}
              >
                Add an entry
              </TextButton>
            ) : (
              <SimpleMenu label="Add an entry">
                {getDynamicEntry(item.entry)?.map((dynamicItem) => (
                  <MenuItem
                    key={dynamicItem.key}
                    onClick={() => addEntry(dynamicItem.key)}
                  >
                    {dynamicItem.name}
                  </MenuItem>
                ))}
              </SimpleMenu>
            )}
          </Flex>
        }
      >
        <SortableList handle=".drag" list={value} onChange={changeSort}>
          {value.map((data: any, i: number) => (
            <Accordion
              expanded={isExpanded(i)}
              onToggle={() => expandEntry(i)}
              size="S"
              variant="secondary"
              key={i}
            >
              <AccordionToggle
                title={getTitle({ item, data })}
                togglePosition="left"
                action={
                  <Stack horizontal spacing={2}>
                    <IconButton
                      noBorder
                      onClick={() => deleteEntry(i)}
                      label="Delete"
                      icon={<Trash />}
                      disabled={
                        disabled || (value.length == 1 && item.required)
                      }
                    />
                    <IconButton
                      noBorder
                      className="drag"
                      label="Drag"
                      icon={<Drag />}
                      disabled={disabled}
                    />
                  </Stack>
                }
              />
              <AccordionContent>
                <EntryForm
                  entry={getEntry({ item, data })}
                  parentPath={`${parentPath ? `${parentPath}.` : ''}${
                    item.key
                  }[${i}]`}
                  onChangeEntry={(key: string, value: object) =>
                    changeField(key, value, i)
                  }
                  localized={localized}
                />
              </AccordionContent>
            </Accordion>
          ))}
        </SortableList>
      </AccordionGroup>
    </div>
  )
}

export default RepeatableComponent
