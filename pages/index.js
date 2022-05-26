
import { Box, Image, useColorModeValue } from "@chakra-ui/react";
import { ff } from "fssf";
import Link from "next/link";

const compare = (a, b) => {
  const ap = Number(a.split('_')[0]);
  const bp = Number(b.split('_')[0]);
  return ap > bp ? -1 : 1
}

export async function getServerSideProps() {
  // const images = await ff.readdir(ff.path('./public/photos'));
  // return { props: { images: images.sort(compare) } }

  // const imagesUrl = 'https://picsum.photos/v2/list'
  // const response = await fetch(imagesUrl);
  // const data = await response.json();
  // return { props: { images: data.map(d=>d.download_url)} }

  const data = await ff.readJson(ff.path('./data/db.json'));
  // console.log(data);
  return { props: { data } };
}

export default function App({ data }) {
  // function getId(src) {
  //   return encodeURIComponent(src.split('.')[0]);
  // }
  return (
    <Box
      padding={4}
      w="100%"
      // maxW="900px"
      mx="auto"
      bg={useColorModeValue("gray.100", "gray.800")}
      sx={{ columnCount: [1, 2, 3], columnGap: "8px" }}
    >
      {data.map((d, index) => (
        <Link href={`/parks/${d.id}`} key={index} url={d.download_url}>
          <a>
            <Image
              key={index}
              w="100%"
              mb={2}
              d="inline-block"
              src={`${d.download_url}`}
              alt="park"
            /></a>
        </Link>
      ))}
    </Box>
  );
}
