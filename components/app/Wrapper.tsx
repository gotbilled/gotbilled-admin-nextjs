// Base
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Components
import Message from './message/Message'
import Popup from './Popup'
import ProgressBar from './ProgressBar'

// Auth
import { useSession } from 'next-auth/react'

// Redux
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { setUser } from '@redux/slices/userSlice'

// Helpers
import { authFetch } from '@helpers/api/contentAPI'

const Wrapper = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const router = useRouter()

  const { data: session } = useSession()

  const dispatch = useAppDispatch()

  const loadUser = async () => {
    if (session?.jwt) {
      try {
        const user = await authFetch({
          url: '/users/auth/me',
          params: {
            _populate: 'role'
          },
          token: session.jwt
        })
        dispatch(
          setUser({
            token: session.jwt,
            ...user
          })
        )
      } catch {
        signOut()
      }
    }
  }

  const signOut = () => {
    router.push('/auth/sign-out')
  }

  useEffect(() => {
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <div>
      <ProgressBar />
      <Popup />
      <Message />
      {children}
    </div>
  )
}

export default Wrapper
