// Packages
import { Box, HeaderLayout, Typography, Flex } from '@strapi/design-system'

// Redux
import { useAppSelector } from '@redux/hooks'

const Header = ({
  children
}: {
  children?: JSX.Element | JSX.Element[] | false
}) => {
  const {
    details: { title }
  } = useAppSelector((state) => state.staticProps)

  return (
    <Flex
      justifyContent="space-between"
      paddingTop={4}
      paddingRight={4}
      paddingBottom={2}
      paddingLeft={4}
    >
      <Typography variant="alpha">{title}</Typography>
      {children}
    </Flex>
  )
}

export default Header
