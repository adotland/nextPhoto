import Head from 'next/head';

import { Box } from '@chakra-ui/layout'

import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Head>
      </Head>
      <Box maxWidth='1500px' m='auto'>
        <header>
          <Navbar />
        </header>
        <main style={{paddingTop: "88px"}}> {/* feature not bug */}
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </Box>
    </>
  );
}
