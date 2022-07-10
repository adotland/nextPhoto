import { useColorModeValue, Box, Flex, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import SEO from "../components/SEO/general";
import styles from "../components/Home.module.css";
import { GoBeaker } from "react-icons/go";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaDice } from "react-icons/fa";

function HomeTextBox({ children }) {
  return (
    <Flex
      color={useColorModeValue("#111", "#eee")}
      fontSize={["xl", "xl", "2xl"]}
      maxW={['initial','initial',"333px"]}
      w={['100%']}
      mr={['initial',"5em"]}
      zIndex={999}
      pos={"relative"}
      // letterSpacing={"0.2em"}
      my={4}
      p={4}
      justify={"space-between"}
      align={"center"}
      _after={{
        backgroundColor: useColorModeValue("#eee", "#111"),
        opacity: "60%",
        backdropFilter: "saturate(200%) blur(10px)",
        position: "absolute",
        content: "''",
        zIndex: -1,
        h: "100%",
        w: "100%",
        right: 0,
        top: 0,
      }}
    >
      {children}
    </Flex>
  );
}
function HomeLinkBox({ link, children }) {
  return (
    <Link href={link} passHref>
      <ChakraLink>
        <HomeTextBox>{children}</HomeTextBox>
      </ChakraLink>
    </Link>
  );
}

export async function getStaticProps() {
  return { props: { videoLink: `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/video/seattle_video_3mBR_loop_1.mp4`, } };
}

export default function IndexPage({videoLink}) {
  return (
    <Box mt={[4, 4, 14, 4]}>
      <SEO pageTitle={"Home"} />
      <Box className={styles.videoBox}>
        <video autoPlay loop muted playsInline className={styles.homeVideo}>
          <source src={videoLink} />
        </video>
        <Box className={styles.overlay}></Box>
      </Box>
      <Box mt={[4, 4, 14, 4]} width={"95%"} mx={"auto"} pt={["1px", "1px", "24px"]}>
        <Flex wrap={["wrap", "wrap", "nowrap"]} justify={['space-between']}>
          <Box w={["100%", "100%", "40%"]} mr={[0,0,'24px']}>
            <HomeTextBox>
              Welcome to TheParkAndTheBike,
              <br />
              an exploration of the Greater Seattle Area parks
            </HomeTextBox>
          </Box>
          <Flex wrap={"wrap"}>
            <HomeLinkBox link={"/map"}>
              <Box w={"100%"}>Find parks via the interactive Map </Box>
              <FaMapMarkerAlt size={"1.4em"} />
            </HomeLinkBox>
            <HomeLinkBox link={"/map/seattle-parks-and-health"}>
              Explore data in the experiments section
              <GoBeaker size={"1.4em"} />
            </HomeLinkBox>
            <HomeLinkBox link={"/featured"}>
              See featured photos in the randomized feature gallery
              <FaDice size={"2.4em"} />
            </HomeLinkBox>
            <HomeTextBox>
              From the Menu, Search for any park, or Filter image types
            </HomeTextBox>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
