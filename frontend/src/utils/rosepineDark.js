// --------------------------------------------------------------------------
// Rosé Pine Dawn Theme (Light)
// --------------------------------------------------------------------------
import { createTheme } from "@mui/material";
import { rosePinePalette } from "./rosepinePalettes";


// Define your custom Rosé Pine theme
export const rosePineTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: rosePinePalette.foam, // Using foam as primary
      light: '#aed1e9',
      dark: '#82a9bf',
      contrastText: rosePinePalette.base,
    },
    secondary: {
      main: rosePinePalette.iris, // Using iris as secondary
      light: rosePinePalette.rose,
      dark: '#d68380',
      contrastText: rosePinePalette.base,

    },
    error: {
      main: rosePinePalette.love, // Using love for errors
      light: '#f189ac',
      dark: '#ce5d7f',
      contrastText: rosePinePalette.text,
    },
    warning: {
      main: rosePinePalette.gold, // Using gold for warnings
      light: '#f8d298',
      dark: '#e3ae61',
      contrastText: rosePinePalette.base,
    },
    info: {
      main: rosePinePalette.pine, // Using pine for info
      light: '#53b4df',
      dark: '#2f7690',
      contrastText: rosePinePalette.text,
    },
    success: {
      main: rosePinePalette.pine, // Reusing pine for success, TODO: Check for alternatives!
      light: '#53b4df',
      dark: '#2f7690',
      contrastText: rosePinePalette.text,
    },
    background: {
      default: rosePinePalette.base,
      paper: rosePinePalette.surface,
    },
    text: {
      primary: rosePinePalette.text,
      secondary: rosePinePalette.subtle,
      disabled: rosePinePalette.muted,
    },
    rosePine: rosePinePalette,
  },
  
    typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  /*
  Define overrides for components here
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: rosePinePalette.overlay, // Example: AppBar uses overlay
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: rosePinePalette.surface, // Example: Drawer uses surface
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: rosePinePalette.base, // Ensure primary buttons have good contrast text
        },
        containedSecondary: {
          color: rosePinePalette.base,
        },
      },
    },
  },*/
});