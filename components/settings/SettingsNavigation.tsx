// Base
import { useEffect, useState } from 'react'
import NextLink from 'next/link'

// Packages
import {
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavLink,
  Box
} from '@strapi/design-system'

// Data
import routers from 'public/views/routers.json'

// Redux
import { useAppSelector } from '@redux/hooks'

// Components
import Placeholder from '@components/app/Placeholder'
import StrapiIcon from '@components/custom/StrapiIcon'

const SettingsNavigation = () => {
  const user = useAppSelector((state) => state.userData)

  const [availableRouters, setAvailableRouters] = useState(loadRouters())

  useEffect(() => {
    setAvailableRouters(loadRouters())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function loadRouters() {
    if (user.role.name == 'Admin') {
      return routers.settings
    } else {
      return routers.settings.filter(({ path }) =>
        user.role.access.some(({ content }) => content == path)
      )
    }
  }

  return (
    <Box
      style={{
        height: '100vh'
      }}
    >
      <SubNav ariaLabel="Settings Navigation">
        <SubNavHeader label="Settings" />
        <Placeholder
          loading={availableRouters.length == 0}
          template={{
            width: 194,
            height: 35,
            direction: 'column',
            repeat: routers.settings.length,
            gap: 3
          }}
        >
          <SubNavSections>
            {availableRouters.map(({ title, path, icon }) => (
              <SubNavLink
                as={NextLink}
                href={`/entry/settings/${path}`}
                icon={<StrapiIcon name={icon} />}
                key={path}
              >
                {title}
              </SubNavLink>
            ))}
          </SubNavSections>
        </Placeholder>
      </SubNav>
    </Box>
  )
}

export default SettingsNavigation
