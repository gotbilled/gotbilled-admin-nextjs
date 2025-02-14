// Base
import { useState } from 'react'

// Packages
import {
  NumberInput,
  AccordionGroup,
  Accordion,
  AccordionToggle,
  AccordionContent,
  Stack,
  IconButton
} from '@strapi/design-system'
import { Trash } from '@strapi/icons'
import Label from '@components/custom/Label'
import EntryBox from '@components/content/form/entry/EntryBox'

const Coordinates = ({
  label,
  value,
  onChange,
  localized,
  required = false,
  disabled = false
}: {
  label: string
  value:
    | {
        type: string
        coordinates: number[]
      }
    | undefined
  onChange: Function
  localized?: boolean
  required?: boolean
  disabled?: boolean
}) => {
  const [coordinatesValue, setCoordinatesValue] = useState(
    value?.coordinates || [0, 0]
  )
  const [expanded, setExpanded] = useState<boolean>(false)

  const deleteEntry = () => {
    onChange(null)
  }

  const expandEntry = () => {
    setExpanded((prevState) => !prevState)
  }

  const onChangeCoordinates = (updatedValue: number[]) => {
    console.log(updatedValue)
    onChange({
      type: 'Point',
      coordinates: updatedValue
    })

    setCoordinatesValue(updatedValue)
  }

  return (
    <div>
      <Label label={label} localized={localized} required={required} />
      <AccordionGroup>
        <Accordion
          expanded={expanded}
          onToggle={expandEntry}
          size="S"
          variant="secondary"
        >
          <AccordionToggle
            title="Coordinates"
            togglePosition="left"
            action={
              !required && (
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
            <EntryBox padding={6}>
              <div className="content-row" key={2}>
                <NumberInput
                  label="Latitude"
                  name="Latitude"
                  value={coordinatesValue[1] || 0}
                  onValueChange={(latitudeValue: number) =>
                    onChangeCoordinates([
                      coordinatesValue[0],
                      latitudeValue || 0
                    ])
                  }
                  required={required}
                  disabled={disabled}
                />
                <NumberInput
                  label="Longitude"
                  name="Longitude"
                  value={coordinatesValue[0] || 0}
                  onValueChange={(longitudeValue: number) =>
                    onChangeCoordinates([
                      longitudeValue || 0,
                      coordinatesValue[1]
                    ])
                  }
                  required={required}
                  disabled={disabled}
                />
              </div>
            </EntryBox>
          </AccordionContent>
        </Accordion>
      </AccordionGroup>
    </div>
  )
}

export default Coordinates
