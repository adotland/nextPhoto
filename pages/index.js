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
import { FaTree } from "react-icons/fa";
import Image from "next/image";
import { BsMap, BsPinMapFill } from "react-icons/bs";
import IG from "../components/IG";
import Script from 'next/script';

function MainHomeTextBox({ children }) {
  return (
    <Flex
      flexDir={'column'}
      color={"#111"}
      fontSize={["l", "l", "xl"]}
      w={["100%", "333px"]}
      h={['initial']}
      maxH={'420px'}
      mr={["initial", "initial", "initial", "5em"]}
      alignItems={'flex-start'}
      zIndex={1}
      pos={"relative"}
      // letterSpacing={"0.2em"}
      my={4}
      p={4}
      textAlign={"center"}
      // boxShadow={"xl"}
      _after={{
        backgroundColor: useColorModeValue("rgba(255,255,255,0.5)", "rgba(255,255,255,0.2)"),
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
      <Box className={styles.profileImage}>
        <Image
          src={'/profile.jpg'}
          alt={"profile image"}
          layout={"fixed"}
          width={'161px'}
          height={'161px'}
          objectFit={"cover"}
        />
      </Box>
    </Flex>
  );
}

function HomeTextBox({ children }) {
  return (
    <Flex
      color={useColorModeValue("#111", "#eee")}
      fontSize={["xl", "xl", "2xl"]}
      w={["100%", "333px"]}
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
    <Link href={link} passHref >
      <ChakraLink style={{ display: 'contents' }}>
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
      mainImgLink: `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/310_1301_Discovery-Park.jpg`,
    },
  };
}

export default function IndexPage({ videoLink, bgLink, mainImgLink, posts }) {
  const gradColor = useColorModeValue('#33d0ff', '#33d0ff')
  const bgColor = useColorModeValue('white', 'black')
  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
      />

      <Box mt={[4, 4, 14, 4]}>
        <SEO pageTitle={"Home"} />
        <Box
          // className={`${styles.videoBox} ${useColorModeValue("", styles.videoBoxDark)}`}
          className={`${styles.videoBox}`}
          _after={{ backgroundImage: `linear-gradient(0deg, ${bgColor}, ${gradColor})` }}
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
          <Flex wrap={["wrap", "wrap", "nowrap"]} justify={["space-between"]} >
            <Box w={["100%", "100%", "100%", "40%"]} mr={[0, 0, "24px"]}>
              <MainHomeTextBox img={mainImgLink}>
                Exploring the parks of the Greater Seattle Area by bike
              </MainHomeTextBox>
            </Box>
            <Flex wrap={"wrap"}>
              <HomeLinkBox link={"/routes"}>
                <div>
                  Discover parks on <br />
                  <span style={{ fontWeight: "bold" }}>Routes</span>
                </div>
                <BsPinMapFill size={"1.4em"} />
              </HomeLinkBox>
              <HomeLinkBox link={"/map"}>
                <div>
                  Find parks on the <br />
                  interactive <span style={{ fontWeight: "bold" }}>Map</span>
                </div>
                <BsMap size={"1.4em"} />
              </HomeLinkBox>
              <HomeLinkBox link={"/blog"}>
                <div>
                  Explore data in the
                  <br />
                  <span style={{ fontWeight: "bold" }}>Blog</span> section
                </div>
                <GoBeaker size={"1.4em"} />
              </HomeLinkBox>
              <HomeLinkBox link={"/featured"}>
                <div>
                  See park photos
                  <br /> in the random <br />
                  <span style={{ fontWeight: "bold" }}>Featured gallery</span>
                </div>
                <FaTree size={"2em"} />
              </HomeLinkBox>
              {/* <HomeTextBox>
                <div>
                  <span style={{ fontWeight: "bold" }}>Search</span> for any park,
                  or <span style={{ fontWeight: "bold" }}>Filter</span> by image
                  type from the Menu above
                </div>
              </HomeTextBox> */}
              <IG />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
