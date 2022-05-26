import Head from 'next/head';

import { Box, } from '@chakra-ui/react'

import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>TheParkAndTheBike</title>
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
