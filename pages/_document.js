// pages/_document.js

import { ColorModeScript, } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../utils/theme'
// import crypto from 'crypto'

// const cspHashOf = (text) => {
//   const hash = crypto.createHash('sha256')
//   hash.update(text)
//   return `'sha256-${hash.digest('base64')}'`
// }

export default class Document extends NextDocument {

  render() {
    let csp = `default-src 'self'; img-src https://*.jawg.io 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://vitals.vercel-insights.com;`
    if (process.env.NODE_ENV === 'development') {
      csp = `default-src 'self'; img-src https://*.jawg.io 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'unsafe-inline' 'unsafe-eval' 'self';  connect-src 'self' https://vitals.vercel-insights.com;`
    }

// ${cspHashOf(NextScript.getInlineScriptSource(this.props))}
    return (
      <Html lang='en'>
        <Head>
          <meta httpEquiv="Content-Security-Policy" content={csp} />
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
