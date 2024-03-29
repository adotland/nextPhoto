import Head from 'next/head';

import { Box, Flex } from '@chakra-ui/layout'
import { SkipNavLink, SkipNavContent } from '@chakra-ui/skip-nav'

import Footer from './Footer';
import Navbar from './Navbar';

import styles from './layout.module.css'

export default function Layout({ children }) {
  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <Head>
        <meta name="robots" content="follow, index" />
      </Head>
      <Box style={{ position: 'relative', minHeight: '100vh' }}>
        {/* <Flex flexDir={'column'} maxWidth='1500px' m='auto' className={styles.tileBg}> */}
        <Flex flexDir={'column'} maxWidth='1500px' m='auto'>
          <header>
            <Navbar />
          </header>
          <SkipNavContent />
          <Box as='main' paddingTop={["4rem", "4rem", "4rem", "6rem",]} paddingBottom={'6rem'}>
            {children}
          </Box>
        </Flex>
        <footer style={{ position: 'absolute', bottom: 0, width: '100%', height: '6rem' }}>
          <Footer />
        </footer>
      </Box>
    </>
  );
}
