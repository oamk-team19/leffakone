import { createContext, useContext } from 'react';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light', // Default mode
});

// Custom hook to use the theme context
export const useColorMode = () => useContext(ColorModeContext);

