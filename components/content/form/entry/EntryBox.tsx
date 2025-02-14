// Packages
import { Box, Flex } from '@strapi/design-system'

const EntryBox = ({
  children,
  padding = 6
}: {
  children: JSX.Element | JSX.Element[]
  padding?: number
}) => {
  return (
    <Box padding={padding}>
      <Flex direction="column" alignItems="stretch" gap={6}>
        {children}
      </Flex>
    </Box>
  )
}

export default EntryBox
