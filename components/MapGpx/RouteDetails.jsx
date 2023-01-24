import {
  Box,
  Heading,
  Text,
  Link as ChakraLink,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import RouteInteractions from "./RouteInteractions";

function Detail({ title, data }) {
  return (
    <Box>
      <Text display={"inline-block"} fontWeight={"bold"}>
        {title}:
      </Text>
      &nbsp;
      <Text display={"inline-block"} ml={2}>
        {data}
      </Text>
    </Box>
  );
}

function meterToFoot(m) {
  return (Number(m) / 0.3048).toFixed(0);
}

function IconDetail({ title, text, icon }) {
  return (
    <Flex justifyContent={["center", "center", "center", "flex-start"]} alignItems={'center'}>
      {title}:<Text mx={2}>{text}</Text>{icon}
    </Flex>
  )
}

function ElevationDetail({ data }) {
  return (
    <Box>
      <Text display={"inline-block"} fontWeight={"bold"}>
        Elevation Profile:
      </Text>
      <Box ml={2}>
        &nbsp;
        <Box display={"inline-block"} ml={2}>
          <IconDetail title={"climb"} text={`${meterToFoot(data.pos)} ft`} icon={<BsArrowUpRight />} />
          <IconDetail title={"descend"} text={`${meterToFoot(data.neg)} ft`} icon={<BsArrowDownRight />} />
        </Box>
      </Box>
    </Box>
  )
}

export default function RouteDetails({ data, ...props }) {

  return (
    <Box {...props}>
      <Heading
        as={"h1"}
        pb={3}
        color={useColorModeValue("blackAlpha.800", "whiteAlpha.800")}
      >
        {data.routeName}
      </Heading>
      <RouteInteractions slug={data.slug} />

      {data.distance && <Detail title={"Distance"} data={`${data.distance} mi`} />}
      {data.elevation && <ElevationDetail data={data.elevation} />}
      {data.parkNameList?.length > 0 && (
        <Detail title={"Parks Featured"} data={data.parkNameList.join(", ")} />
      )}
    </Box>
  );
}
