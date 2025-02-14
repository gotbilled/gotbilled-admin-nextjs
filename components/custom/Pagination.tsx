// Packages
import { Dots, Box, Typography, Icon } from '@strapi/design-system'
import { ChevronLeft, ChevronRight } from '@strapi/icons'

const PreviousLink = ({
  page,
  disabled = false,
  onClick
}: {
  page: number
  disabled?: boolean
  onClick: Function
}) => {
  return (
    <div
      role="button"
      className={disabled ? 'disabled' : ''}
      onClick={() => onClick(page)}
    >
      <Box
        disabled
        paddingTop={2}
        paddingBottom={2}
        paddingLeft={3}
        paddingRight={3}
      >
        <Icon
          width={`${12 / 16}rem`}
          height={`${12 / 16}rem`}
          color="neutral1000"
          as={ChevronLeft}
        />
      </Box>
    </div>
  )
}

const NextLink = ({
  page,
  disabled = false,
  onClick
}: {
  page: number
  disabled?: boolean
  onClick: Function
}) => {
  return (
    <div
      role="button"
      className={disabled ? 'disabled' : ''}
      onClick={() => onClick(page)}
    >
      <Box paddingTop={2} paddingBottom={2} paddingLeft={3} paddingRight={3}>
        <Icon
          width={`${12 / 16}rem`}
          height={`${12 / 16}rem`}
          color="neutral1000"
          as={ChevronRight}
        />
      </Box>
    </div>
  )
}

const PageLink = ({
  page,
  disabled = false,
  onClick
}: {
  page: number
  disabled?: boolean
  onClick: Function
}) => {
  return (
    <div
      role="button"
      className={disabled ? 'disabled' : ''}
      onClick={() => onClick(page)}
    >
      <Box
        shadow="filterShadow"
        background="neutral0"
        borderRadius="4px"
        paddingTop={2}
        paddingBottom={2}
        paddingLeft={3}
        paddingRight={3}
      >
        <Typography variant="omega">{page + 1}</Typography>
      </Box>
    </div>
  )
}

export { PreviousLink, NextLink, PageLink, Dots }
