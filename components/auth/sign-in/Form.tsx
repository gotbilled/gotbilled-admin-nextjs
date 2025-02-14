// Base
import { useState, ChangeEvent, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Redux
import { showMessage } from '@redux/slices/utilitiesSlice'
import { useAppDispatch } from '@redux/hooks'

// Auth
import { signIn } from 'next-auth/react'

// Packages
import { TextInput, Icon, Box, Stack, Button } from '@strapi/design-system'
import { Lock, Eye, EyeStriked, Mail } from '@strapi/icons'
import { useRouter } from 'next/router'

type Input = ChangeEvent<HTMLInputElement>

const Form = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberPassword, setRememberPassword] = useState(false)
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      dispatch(
        showMessage({
          type: 'danger',
          title: 'Attention!',
          text: router.query.error
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!email) {
      dispatch(
        showMessage({
          type: 'danger',
          title: 'Attention!',
          text: 'Email field should not be empty!'
        })
      )
      return
    }

    if (!password) {
      dispatch(
        showMessage({
          type: 'danger',
          title: 'Attention!',
          text: 'Password field should not be empty!'
        })
      )
      return
    }

    setLoading(true)

    signIn('credentials-password', { email, password, callbackUrl: '/' })

    setLoading(false)
  }

  return (
    <section className="sign-in">
      <Box
        shadow="filterShadow"
        background="neutral0"
        borderRadius="4px"
        padding={8}
      >
        <Stack spacing={8}>
          {/* <div className="sign-in__image">
            <Image
              src=""
              fill
              sizes=" 
							(max-width: 1199px) 250px,
							(min-width: 1200px) 450px,
							450px
						"
              priority
              alt=""
            />
          </div> */}

          <form onSubmit={handleSignIn}>
            <Stack spacing={6}>
              <div className="sign-in__image">
                <Image
                  src="/images/logo/main/gotbilled-text.svg"
                  fill
                  sizes=" 
							(max-width: 1199px) 250px,
							(min-width: 1200px) 250px,
							450px
						"
                  priority
                  alt="Main logo"
                />
              </div>

              <TextInput
                placeholder="E-mail Address"
                id="textinput-1"
                type="email"
                aria-label="Email"
                name="email"
                onChange={(e: Input) => setEmail(e.target.value)}
                startAction={<Icon width={`1rem`} height={`1rem`} as={Mail} />}
              />

              <TextInput
                placeholder="Password"
                type={visiblePassword ? 'text' : 'password'}
                aria-label="Password"
                id="textinput-2"
                name="password"
                autoComplete="off"
                onChange={(e: Input) => setPassword(e.target.value)}
                startAction={<Icon width={`1rem`} height={`1rem`} as={Lock} />}
                endAction={
                  <div
                    role="button"
                    onClick={() => {
                      setVisiblePassword((prevState) => !prevState)
                    }}
                  >
                    <Icon
                      width={`1rem`}
                      height={`1rem`}
                      as={visiblePassword ? Eye : EyeStriked}
                    />
                  </div>
                }
              />

              {/* <Flex justifyContent="space-between">
              <Checkbox
                id="checkbox-2"
                onValueChange={(value: boolean) => setRememberPassword(value)}
                value={rememberPassword}
              >
                Remember me
              </Checkbox>
              <Link href="/">
                <Typography variant="omega" textColor="primary600">
                  Forgot password
                </Typography>
              </Link>
            </Flex> */}

              <Button fullWidth onClick={handleSignIn} loading={loading}>
                Log In
              </Button>
              <button></button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </section>
  )
}

export default Form
