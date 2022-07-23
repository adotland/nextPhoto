// pages/_document.js

import { ColorModeScript } from '@chakra-ui/color-mode'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import config from '../config'
import theme from '../utils/theme'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta httpEquiv="Content-Security-Policy" content={config.csp} />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <script async defer data-website-id="0720928a-0552-4e9c-9964-9bcc3c677ded" data-host-url="https://umami-seven-weld.vercel.app/" src={`${config.endpoints.canonical}/_umami.js`} data-domains="www.theparkandthebike.com,theparkandthebike.com"></script>
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
