// Packages
import { Box } from '@strapi/design-system'

const EntryBox = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <Box paddingTop={0} paddingBottom={4} paddingLeft={4} paddingRight={4}>
      {children}
    </Box>
  )
}

export default EntryBox
