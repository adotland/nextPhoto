import { Box, Flex, Heading } from "@chakra-ui/react";
import PageWrap from "../../components/PageWrap";
import SEO from "../../components/SEO/general";
import Link from "next/link";
import styles from "./Blog.module.css"; // Import the CSS module
import { BsFillArrowRightCircleFill } from "react-icons/bs";


export async function getStaticProps() {

  return { props: {} };
}

const BlogLink = function ({ href, text }) {
  return (
    <Flex className={styles.blogLink} alignItems={'center'}>
      <Link href={href}>
        <a>{text}</a>
      </Link>
      <Box className={styles.arrow}>
        <BsFillArrowRightCircleFill />
      </Box>
    </Flex>
  )
}


export default function MericaCarsBikeLanes({ }) {

  return (
    <>
      <SEO pageTitle={'Seattle Park Data Map - Health'} />
      <PageWrap>
        <Flex flexDir={'column'} mt={5} mb={8} align={'center'} textAlign={'center'}>
          <Flex flexDir={'column'} maxW={['100%', '100%', '100%', '75%']}>
            <Heading mb={4}>Posts</Heading>
            <BlogLink href={'/blog/merica-cars-bikes-and-lanes'} text={"'Merica, Cars, Bikes, and Lanes"} />
            <BlogLink href={'/blog/seattle-parks-and-health'} text={'Parks and Health in Seattle'} />
          </Flex>
        </Flex>
      </PageWrap>
    </>
  )
}
