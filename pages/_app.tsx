import type { AppProps } from 'next/app'

// Strapi Design
import { ThemeProvider, lightTheme } from '@strapi/design-system'

// Global Styles
import '../styles/globals.sass'
import 'nprogress/nprogress.css'

// Redux
import { Provider as ReduxProvider } from 'react-redux'
import { useStore } from '@redux/store'

// Components
import Wrapper from '../components/app/Wrapper'

//Auth
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <ReduxProvider store={store}>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider theme={lightTheme}>
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  )
}
