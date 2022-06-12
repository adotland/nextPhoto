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
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
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
