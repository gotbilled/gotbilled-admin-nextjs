// Base
import Image from 'next/image'

// Packages
import { Typography, Link, Flex } from '@strapi/design-system'
import HomeSection from './HomeSection'

const Shortcuts = () => (
  <HomeSection
    title="Useful Links"
    subtitle="Shortcuts to project relevant websites"
  >
    <Flex alignItems="center" gap={4} wrap="wrap">
      <Shortcut
        name="Analytics"
        url="https://www.google.com"
        image="/images/logo/providers/analytics.png"
      />
      <Shortcut
        name="Facebook"
        url="https://www.facebook.com"
        image="/images/logo/providers/facebook.png"
      />
      <Shortcut
        name="Hotjar"
        url="https://www.hotjar.com"
        image="/images/logo/providers/hotjar.png"
      />
    </Flex>
  </HomeSection>
)

const Shortcut = ({
  name,
  url,
  image
}: {
  name: string
  url: string
  image: string
}) => {
  return (
    <Link href={url}>
      <Flex alignItems="center" gap={2}>
        <Image src={image} width={16} height={16} alt={name} />
        <Typography variant="delta">{name}</Typography>
      </Flex>
    </Link>
  )
}

export default Shortcuts
