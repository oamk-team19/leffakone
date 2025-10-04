import { createContext, useContext } from 'react';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'moon', // Default mode
});

// Custom hook to use the theme context
export const useColorMode = () => useContext(ColorModeContext);
