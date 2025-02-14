// Base
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

// Packages
import {
  MainNav,
  Divider,
  NavSections,
  NavSection,
  NavLink,
  NavUser,
  NavCondense,
  Box,
  Popover,
  Typography,
  Icon,
  Flex
} from '@strapi/design-system'
import { Cog, House, Landscape, Exit, Earth } from '@strapi/icons'

// Auth
import { signOut } from 'next-auth/react'

// Data
import routers from 'public/views/routers.json'

// Redux
import { useAppSelector } from '@redux/hooks'

// Components
import RoleAllow from '@components/content/RoleAllow'
import Placeholder from './Placeholder'
import StrapiIcon from '@components/custom/StrapiIcon'

const Navigation = () => {
  const user = useAppSelector((state) => state.userData)

  const [condensed, setCondensed] = useState(false)
  const [openPopover, setOpenPopover] = useState(false)
  const [availableRouters, setAvailableRouters] = useState(loadRouters())

  const buttonRef = useRef()

  const router = useRouter()

  useEffect(() => {
    setAvailableRouters(loadRouters())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function loadRouters() {
    if (user.role.name == 'Admin') {
      return routers.content
    } else {
      return routers.content.filter(({ path }) =>
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
      <MainNav condensed={condensed} className="main-nav">
        <div className="main-nav__wrapper">
          <div className="nav-logo">
            <Image
              src={`/images/logo/main/gotbilled-${
                condensed ? 'logo' : 'text'
              }.svg`}
              width={condensed ? 36 : 140}
              height={36}
              alt="Main logo"
              priority
            />
          </div>
          <Divider />
          <NavSections>
            <NavLink
              as={NextLink}
              href="/"
              icon={<House />}
              className={router.pathname == '/' ? 'active' : ''}
            >
              Dashboard
            </NavLink>
            <NavSection label="Content">
              <Placeholder
                loading={availableRouters.length == 0}
                template={{
                  width: 194,
                  height: 36,
                  direction: 'column',
                  repeat: routers.content.length,
                  gap: 2
                }}
              >
                {availableRouters.map(({ title, path, icon }, index) => (
                  <Box
                    paddingBottom={index < availableRouters.length - 1 ? 2 : 0}
                    key={path}
                  >
                    <NavLink
                      as={NextLink}
                      href={`/entry/content/${path}`}
                      icon={<StrapiIcon name={icon} />}
                      className={router.query.path == path ? 'active' : ''}
                    >
                      {title}
                    </NavLink>
                  </Box>
                ))}
              </Placeholder>
            </NavSection>
            <NavSection label="General">
              <Placeholder
                loading={!user.role.name}
                template={{
                  width: 194,
                  height: 36,
                  repeat: 3,
                  gap: 2
                }}
              >
                <RoleAllow role={user.role} content="assets">
                  <Box paddingBottom={2}>
                    <NavLink
                      as={NextLink}
                      href="/general/media-library"
                      icon={<Landscape />}
                      className={
                        router.pathname.includes('media-library')
                          ? 'active'
                          : ''
                      }
                    >
                      Media library
                    </NavLink>
                  </Box>
                </RoleAllow>
                <Box>
                  <NavLink
                    as={NextLink}
                    href="/general/settings"
                    icon={<Cog />}
                    className={
                      router.pathname.includes('settings') ? 'active' : ''
                    }
                  >
                    Settings
                  </NavLink>
                </Box>
              </Placeholder>
            </NavSection>
          </NavSections>
          <Box>
            <NavUser
              initials={
                user.details.firstName &&
                `${user.details.firstName[0]}${user.details.lastName[0]}`
              }
              ref={buttonRef}
              onClick={() => setOpenPopover((prevState: boolean) => !prevState)}
            >
              <Placeholder
                loading={!user.details.firstName}
                template={{
                  width: 120,
                  height: 20
                }}
              >
                {user.details.firstName} {user.details.lastName}
              </Placeholder>
            </NavUser>
            {openPopover && (
              <Popover source={buttonRef} spacing={16}>
                <ul style={{ width: '200px' }}>
                  <Box color="neutral800" padding={3} as="li" role="button">
                    <Flex justifyContent="space-between">
                      <Typography
                        textColor="danger600"
                        onClick={() => {
                          signOut({ callbackUrl: '/auth/sign-in' })
                        }}
                      >
                        Log Out
                      </Typography>
                      <Icon as={Exit} color="danger600" />
                    </Flex>
                  </Box>
                </ul>
              </Popover>
            )}
            <NavCondense
              onClick={() => setCondensed((prevState) => !prevState)}
            >
              {condensed ? 'Expanded the navbar' : 'Collapse the navbar'}
            </NavCondense>
          </Box>
        </div>
      </MainNav>
    </Box>
  )
}

export default Navigation
