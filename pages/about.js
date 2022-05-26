import { Box, Text } from "@chakra-ui/react";

export default function () {
  return (
    <Box my={30} mx={'auto'} maxW={["90%", "90%", "90%", "50%"]}>
      I started riding my bicycle more often in 2020 as a way to stay healthy and explore the city. Along the way, I got the idea to ride to every park in the Seattle. I did not expect there to be close to four hundred! After completing this challenge, I was down three bikes: one sold, one traded, and one stolen. I was also down 30 lbs and felt much closer to being a Seattlelite. This blog is dedicated to the journey.
      <Text fontSize={'xs'} mt={10} pt={5}>This blog is in no way affiliated with any of the organizations representing the places or bicycles pictured</Text>
    </Box>
  )
}

