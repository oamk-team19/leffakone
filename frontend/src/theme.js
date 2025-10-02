import { rosePineTheme } from './utils/rosepineDark';
import { rosePineMoonTheme } from './utils/rosepineMoon';
import { rosePineDawnTheme } from './utils/rosepineDawn';

export const getRosyTheme = (mode) => {
  switch (mode) {
    case 'moon':
      return rosePineMoonTheme;
    case 'dark':
      return rosePineTheme;
    case 'light':
      return rosePineDawnTheme;
    default:
      return rosePineTheme; // Fallback to dark theme
  }
};
