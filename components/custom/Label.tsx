// Packages
import { Box, Typography, Icon } from '@strapi/design-system'
import { Earth } from '@strapi/icons'

const Label = ({
  label,
  required,
  localized
}: {
  label: string
  required?: boolean
  localized?: boolean
}) => (
  <Box paddingBottom={1}>
    <Typography variant="pi" fontWeight="bold">
      {label}
      <span style={{ color: '#d02b20' }}>{required ? '* ' : ''}</span>
      {localized && <Icon as={Earth} color="neutral500" />}
    </Typography>
  </Box>
)

export default Label
