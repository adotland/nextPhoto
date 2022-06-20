import { Box } from "@chakra-ui/react";

export default function PageWrap({ children }) {
  return (
    <Box
      mx={4}
      mt={[4, 14, 14, 4]}
    >
      {children}
    </Box>
  )
}
