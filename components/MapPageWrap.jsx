import { Box } from "@chakra-ui/react";

export default function MapPageWrap({ children }) {
  return (
    <Box
      mx={4}
      mt={"-85px"}
    >
      {children}
    </Box>
  )
}
