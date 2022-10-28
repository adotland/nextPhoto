import {
  useColorModeValue,
  Box,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import SEO from "../components/SEO/general";
import styles from "../components/Home.module.css";
import { GoBeaker } from "react-icons/go";
import { FaMapMarkerAlt, FaDice } from "react-icons/fa";
import Image from "next/image";

function HomeTextBox({ children }) {
  return (
    <Flex
      color={useColorModeValue("#111", "#eee")}
      fontSize={["xl", "xl", "2xl"]}
      w={["303px", "333px"]}
      mr={["initial", "initial", "initial", "5em"]}
      zIndex={999}
      pos={"relative"}
      // letterSpacing={"0.2em"}
      my={4}
      p={4}
      justify={"space-between"}
      align={"center"}
      boxShadow={"xl"}
      _after={{
        backgroundColor: useColorModeValue("#eee", "#111"),
        opacity: "80%",
        backdropFilter: "saturate(200%) blur(10px)",
        position: "absolute",
        content: "''",
        zIndex: -1,
        h: "100%",
        w: "100%",
        right: 0,
        top: 0,
        borderRadius: 10
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
  return {
    props: {
      videoLink: `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/video/seattle_video_3mBR_loop_1.mp4`,
      bgLink: `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/general/background_map.jpg`,
    },
  };
}

export default function IndexPage({ videoLink, bgLink }) {
  return (
    <Box mt={[4, 4, 14, 4]}>
      <SEO pageTitle={"Home"} />
      <Box
      className={`${styles.videoBox} ${useColorModeValue("", styles.videoBoxDark)}`}
      >
        <Image
          src={bgLink}
          alt={"background map image"}
          layout="fill"
          objectFit="cover"
          quality={85}
        />
        {/* <video autoPlay loop muted playsInline className={styles.homeVideo}>
          <source src={videoLink} />
        </video> */}
      </Box>
      <Box
        mt={[4, 4, 14, 4]}
        width={"95%"}
        mx={"auto"}
        pt={["1px", "1px", "24px"]}
      >
        <Flex wrap={["wrap", "wrap", "nowrap"]} justify={["space-between"]}>
          <Box w={["100%", "100%", "100%", "40%"]} mr={[0, 0, "24px"]}>
            <HomeTextBox>
              <div>
                Welcome to{" "}
                <span style={{ fontWeight: "bold" }}>TheParkAndTheBike</span>,
                <br />
                an exploration of parks in
                <br />
                the Greater Seattle Area
              </div>
            </HomeTextBox>
          </Box>
          <Flex wrap={"wrap"}>
            <HomeLinkBox link={"/map"}>
              <div>
                Find parks on the <br />
                interactive <span style={{ fontWeight: "bold" }}>Map</span>
              </div>
              <FaMapMarkerAlt size={"1.4em"} />
            </HomeLinkBox>
            <HomeLinkBox link={"/map/seattle-parks-and-health"}>
              <div>
                Explore data in the
                <br />
                <span style={{ fontWeight: "bold" }}>Experiments</span> section
              </div>
              <GoBeaker size={"1.4em"} />
            </HomeLinkBox>
            <HomeLinkBox link={"/featured"}>
              <div>
                See park photos
                <br /> in the random <br />
                <span style={{ fontWeight: "bold" }}>Featured gallery</span>
              </div>
              <FaDice size={"2em"} />
            </HomeLinkBox>
            <HomeTextBox>
              <div>
                <span style={{ fontWeight: "bold" }}>Search</span> for any park,
                or <span style={{ fontWeight: "bold" }}>Filter</span> by image
                type from the Menu above
              </div>
            </HomeTextBox>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
