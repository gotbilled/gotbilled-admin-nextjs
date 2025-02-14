// Packages
import { Typography, Box } from '@strapi/design-system'

interface HomeSectionProps {
  title: string
  subtitle?: string
  children: JSX.Element | JSX.Element[]
}

const HomeSection = ({ title, subtitle, children }: HomeSectionProps) => (
  <Box padding={4}>
    <Box paddingBottom={2}>
      <Typography variant="beta">{title}</Typography>
    </Box>
    {subtitle && (
      <Box paddingBottom={2}>
        <Typography variant="epsilon">{subtitle}</Typography>
      </Box>
    )}
    {children}
  </Box>
)

export default HomeSection
