import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";
import LayoutNoChakra from "../components/LayoutNoChakra";
import styles from './socials.module.css'

import SEO from "../components/SEO/general";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import config from "../config";
import GalleryForSocials from "../components/GalleryForSocials";

export async function getServerSideProps() {
  const api_url = config.endpoints.api
  const response = await fetch(`${api_url}/api/featured/`)
  const { props } = await response.json()
  return {
    props: { dataList: props.dataList }
  }
}

function PageLink({ name, url }) {
  return (
    <Box className={styles.pageLink}>
      <Link href={url}>
        <a>{name}</a>
      </Link>
    </Box>
  )
}

export default function Socials({ dataList }) {
  return (
    <Flex justifyContent="center" mt={'0.75rem'} className={styles.socialsPage} flexDir={'column'}>
      <SEO pageTitle={'Socials'} />
      <Flex justifyContent="center" alignItems={'center'} flexDir={'column'} as="header">
        <Box className={styles.profileImage}>
          <Image
            src={'/profile.jpg'}
            alt={"profile image"}
            layout={"fixed"}
            width={100}
            height={100}
            objectFit={"cover"}
          />
        </Box>
        <Box mt={10} as={'h1'} fontSize={'large'}>TheParkAndTheBike</Box>
      </Flex>
      <Flex as={'main'} mt={'1rem'} flexDir={'column'} alignItems={'center'}>
        <Flex as={'section'}>
          <Box>
            <ChakraLink
              href="https://twitter.com/TheParkAndTheB1"
              target={"_blank"}
              title="twitter"
            >
              <BsTwitter size={33} />
            </ChakraLink>
          </Box>
          <Box ml={'2rem'}>
            <ChakraLink
              href="https://instagram.com/theparkandthebike"
              target={"_blank"}
              title="instagram"
            >
              <BsInstagram size={33} />
            </ChakraLink>
          </Box>
        </Flex>
        <Flex as={'section'} className={styles.linksSection}>
          <PageLink name={'What is this?'} url={'/about'} />
          <PageLink name={'Best Parks'} url={'/featured'} />
          <PageLink name={'Map'} url={'/map/'} />
          <PageLink name={'Experiments'} url={'/map/seattle-parks-and-health'} />
        </Flex>
        <GalleryForSocials dataList={dataList}/>
      </Flex>
    </Flex>
  );
}

Socials.getLayout = function (page) {
  return <LayoutNoChakra>{page}</LayoutNoChakra>
}
