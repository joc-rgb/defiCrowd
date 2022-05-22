import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme(
  {
    fonts: {
      body: 'Rubik, sans-serif',
      heading: 'Syncopate, sans-serif',
    },
  },
  { config }
);

export default theme;
