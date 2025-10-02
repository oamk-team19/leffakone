import { rosePineTheme } from './utils/rosepineDark';
import { rosePineMoonTheme } from './utils/rosepineMoon';
import { rosePineDawnTheme } from './utils/rosepineDawn';



export const getRosyTheme = (mode) => {
  if (mode === 'light') {
    // Create a light version of the theme
    return rosePineDawnTheme
  }
  return rosePineTheme; // Default to dark theme
};

