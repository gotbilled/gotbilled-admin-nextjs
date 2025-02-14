// Base
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Redux
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { hideMessage } from '@redux/slices/utilitiesSlice'

// Packages
import { Alert } from '@strapi/design-system'

// Styles
import styles from './Message.module.sass'

const Message = () => {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const {
    message: { show, type, title, text, items }
  } = useAppSelector((state) => state.utilities)

  // Automatically hide message after 5s
  useEffect(() => {
    if (show) {
      const messageTimer = setTimeout(() => {
        dispatch(hideMessage())
      }, 5000)
      return () => clearTimeout(messageTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, type, title, text, items])

  useEffect(() => {
    dispatch(hideMessage())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  const closeMessage = () => {
    dispatch(hideMessage())
  }

  return (
    <div className={`${styles.message} ${show ? styles['show'] : ''}`}>
      <Alert
        closeLabel="Close alert"
        title={title}
        variant={type}
        onClose={closeMessage}
      >
        {text}
        {items && (
          <span className="list">
            {items.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </span>
        )}
      </Alert>
    </div>
  )
}

export default Message
