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
