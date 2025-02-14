// Packages
import {
  Flex,
  IconButton,
  Box,
  Typography,
  SimpleMenu,
  MenuItem
} from '@strapi/design-system'
import { Plus } from '@strapi/icons'

// Components
import Label from '@components/custom/Label'

// Interfaces
import { DynamicEntry } from './RepeatableComponent'

const EmptyComponent = ({
  label,
  dynamicComponent,
  required,
  onClick,
  disabled
}: {
  label: string
  dynamicComponent?: DynamicEntry[] | false
  required?: boolean
  onClick: Function
  disabled?: boolean
}) => {
  return (
    <div className="empty-component">
      <Label label={label} required={required} />
      <Box padding={4} background="neutral100">
        <Flex direction="column" gap={2}>
          {!dynamicComponent ? (
            <IconButton
              onClick={onClick}
              aria-label="Add"
              label="Add an Entry"
              icon={<Plus />}
              disabled={disabled}
            />
          ) : (
            <SimpleMenu label="Add an entry">
              {dynamicComponent.map((dynamicItem) => (
                <MenuItem
                  key={dynamicItem.key}
                  onClick={() => onClick(dynamicItem.key)}
                >
                  {dynamicItem.name}
                </MenuItem>
              ))}
            </SimpleMenu>
          )}
          <Typography>
            No entry yet. Click the button above to add one.
          </Typography>
        </Flex>
      </Box>
    </div>
  )
}

export default EmptyComponent
