import { ChakraProvider } from '@chakra-ui/provider';
import Layout from '../components/Layout';
import theme from '../utils/theme'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import '../public/global.css'
import useScrollRestoration from '../utils/hooks/useScrollRestoration';

function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()
  useScrollRestoration(router);

  NProgress.configure({ showSpinner: false })

  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  if (Component.getLayout) {
    return getLayout(<Component {...pageProps} />)
  } else {
    return (
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    )
  }
}

export default App;
