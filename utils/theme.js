import { extendTheme } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  useSystemColorMode: true,
  initialColorMode: 'system',
  colors: {
    brand: {
      50: '#f8f0f2',
      100: '#d9d9d9',
      200: '#bfbfbf',
      300: '#a6a6a6',
      400: '#8c8c8c',
      500: '#737373',
      600: '#595959',
      700: '#404040',
      800: '#262626',
      900: '#120b0d',
    }
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  styles: {
    global: props => ({
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('whiteAlpha.100', '#191a1a')(props),
      },
    }),
  },
  components: {
    Menu: {
      // setup light/dark mode component defaults
      baseStyle: props => ({
        dialog: {
          bg: mode('white', '#141214')(props),
        },
      }),
    },
  }
});

export default theme;

