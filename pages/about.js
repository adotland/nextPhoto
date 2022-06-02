import { Box, Text } from "@chakra-ui/react";

export default function () {
  return (
    <Box my={30} mx={'auto'} maxW={["90%", "90%", "90%", "50%"]}>
      <Text mb={2}>I got more serious about cycling in 2020 as a way to get exercise and explore the city, and got the idea to ride to every park in the Seattle. I did not expect there to be over four hundred!</Text>
      <Text mb={2}>Along the way, I learned about the P-Patches, so I also rode my bike to every P-Patch.</Text>
      <Text mb={2}>Along the way, I learned about the Port of Seattle owned parks, so I rode my bike to every Port of Seattle owned park.</Text>
      <Text mb={2}>Along the way, I learned about the Seattle Public Utilities owned parks, so, can you guess what I did? I rode my bike to every Seattle Public Utilities owned park.</Text>
      <Text mb={2}>I also covered Mercer Island, and sampled parks from King County, and a few other cities.</Text>
      <Text mb={2}>After completing this challenge, I was down three bikes: one sold, one traded, and one stolen. I was also down 30 lbs and felt much closer to being a Seattlelite. This blog is dedicated to the journey.</Text>
      <Text fontSize={'xs'} mt={10} pt={5}>This blog is in no way affiliated with any of the organizations representing the places or bicycles pictured</Text>
    </Box>
  )
}
