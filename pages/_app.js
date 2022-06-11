import { ChakraProvider } from '@chakra-ui/provider';
import Layout from '../components/Layout';
import theme from '../utils/theme'
import '@fontsource/raleway/400.css'
import '@fontsource/open-sans/700.css'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import '../public/global.css'
import useScrollRestoration from '../utils/hooks/useScrollRestoration';

function App({ Component, pageProps }) {
  const router = useRouter()
  useScrollRestoration(router);

  NProgress.configure({ showSpinner: false })

  useEffect(() => {
    const handleStart = (url) => {
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

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
