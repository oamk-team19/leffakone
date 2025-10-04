// --------------------------------------------------------------------------
// Rosé Pine Dawn Theme (Light)
// --------------------------------------------------------------------------
import { createTheme } from "@mui/material";
import { rosePineDawnPalette } from "./rosepinePalettes";

export const rosePineDawnTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: rosePineDawnPalette.foam, // Foam as primary
      light: '#57b4df',
      dark: '#2f7690',
      contrastText: rosePineDawnPalette.surface, // Light background needs dark text
    },
    secondary: {
      main: rosePineDawnPalette.iris, // Iris as secondary
      light: rosePineDawnPalette.rose,
      dark: '#d68380',
      contrastText: rosePineDawnPalette.text,
    },
    error: {
      main: rosePineDawnPalette.love,
      light: '#d07d91',
      dark: '#9c4d62',
      contrastText: rosePineDawnPalette.surface,
    },
    warning: {
      main: rosePineDawnPalette.gold,
      light: '#e49a62',
      dark: '#c07440',
      contrastText: rosePineDawnPalette.surface,
    },
    info: {
      main: rosePineDawnPalette.pine,
      light: '#427c92',
      dark: '#1e4c5b',
      contrastText: rosePineDawnPalette.surface,
    },
    success: {
      main: rosePineDawnPalette.pine,
      light: '#427c92',
      dark: '#1e4c5b',
      contrastText: rosePineDawnPalette.surface,
    },
    background: {
      default: rosePineDawnPalette.base,
      paper: rosePineDawnPalette.surface,
    },
    text: {
      primary: rosePineDawnPalette.text,
      secondary: rosePineDawnPalette.subtle,
      disabled: rosePineDawnPalette.muted,
    },
    rosePine: rosePineDawnPalette,
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
          backgroundColor: rosePineDawnPalette.overlay,
          color: rosePineDawnPalette.text,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: rosePineDawnPalette.surface,
          color: rosePineDawnPalette.text,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: rosePineDawnPalette.surface, // Adjust contrast for light theme
        },
        containedSecondary: {
          color: rosePineDawnPalette.text, // Adjust contrast for light theme
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: rosePineDawnPalette.surface,
        },
      },
    },
  },*/
});