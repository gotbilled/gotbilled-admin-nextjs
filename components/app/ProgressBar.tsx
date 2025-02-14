import { useEffect } from 'react'
import { useRouter } from 'next/router'

import NProgress from 'nprogress'

const ProgressBar = () => {
  const router = useRouter()

  useEffect(() => {
    NProgress.configure({ showSpinner: false })

    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteDone)
    router.events.on('routeChangeError', handleRouteDone)

    return () => {
      router.events.off('routeChangeComplete', handleRouteDone)
      router.events.off('routeChangeError', handleRouteDone)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default ProgressBar
