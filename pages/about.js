import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import styles from './about.module.css';

export default function () {
  return (
    <Box my={30} mx={'auto'} maxW={["90%", "90%", "90%", "50%"]}>
      <Text mb={2}>I got more serious about cycling in 2020 as a way to get exercise and explore the city, and got the idea to ride to every park in the Seattle. I did not expect there to be over four hundred!</Text>
      <Text mb={2}>Along the way, I learned about the P-Patches, so I also rode my bike to every <Link href={'/collection/p-patch'}><a className={styles.aboutLink}>P-Patch</a></Link>.</Text>
      <Text mb={2}>Along the way, I learned about the Port of Seattle owned parks, so I rode my bike to every <Link href={'/collection/non-city'}><a className={styles.aboutLink}>Port of Seattle owned park</a></Link>.</Text>
      <Text mb={2}>Along the way, I learned about the Seattle Public Utilities owned parks, so, can you guess what I did? I rode my bike to every <Link href={'/collection/non-city'}><a className={styles.aboutLink}>Seattle Public Utilities owned park</a></Link>.</Text>
      <Text mb={2}>I also covered <Link href={'/collection/mercer'}><a className={styles.aboutLink}>Mercer Island</a></Link>, and sampled parks from <Link href={'/collection/county'}><a className={styles.aboutLink}>King County</a></Link>, and a few other cities.</Text>
      <Text mb={2}>After completing this challenge, I was down three bikes: one sold, one traded, and one stolen. I was also down 30 lbs and felt much closer to being a Seattlelite. This blog is dedicated to the <Link href={'/map'}><a className={styles.aboutLink}>journey</a></Link>.</Text>
      <Text fontSize={'xs'} mt={10} pt={5}>This blog is in no way affiliated with any of the organizations representing the places or bicycles pictured</Text>
    </Box>
  )
}
