import {
  Box,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsMoonFill, BsFillCircleFill } from "react-icons/bs";

export default function ColorModeToggle({ setIsOpen }) {
  const { colorMode, toggleColorMode } = useColorMode();

  const handleChange = () => {
    setIsOpen(false);
    toggleColorMode();
  };

  return (
    <Box
      mx={"auto"}
      bg={useColorModeValue("white", "#191a1a")}
      p={2}
      borderRadius={"md"}
      _hover={{ background: useColorModeValue("#eee", "555") }}

    >
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="colorModeToggle" mb="0" cursor={"pointer"}>
          {colorMode === "light" ? <BsFillCircleFill /> : <BsMoonFill />}
        </FormLabel>
        <Switch
          id="colorModeToggle"
          size={"md"}
          onChange={handleChange}
          colorScheme="green"
          title="Light/Dark Mode"
        />
      </FormControl>
    </Box>
  );
}
