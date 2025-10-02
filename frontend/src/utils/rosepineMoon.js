// --------------------------------------------------------------------------
// Rosé Pine Moon Theme (Dark)
// --------------------------------------------------------------------------
import { createTheme } from "@mui/material";
import { rosePineMoonPalette } from "./rosepinePalettes";

export const rosePineMoonTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: rosePineMoonPalette.foam, // Foam as primary
      light: '#aed1e9',
      dark: '#82a9bf',
      contrastText: rosePineMoonPalette.base, // Dark background needs light text
    },
    secondary: {
      main: rosePineMoonPalette.iris, // Iris as secondary
      light: rosePineMoonPalette.rose,
      dark: '#d68380',
      contrastText: rosePineMoonPalette.base,
    },
    error: {
      main: rosePineMoonPalette.love,
      light: '#f189ac',
      dark: '#ce5d7f',
      contrastText: rosePineMoonPalette.text,
    },
    warning: {
      main: rosePineMoonPalette.gold,
      light: '#f8d298',
      dark: '#e3ae61',
      contrastText: rosePineMoonPalette.base,
    },
    info: {
      main: rosePineMoonPalette.pine,
      light: '#53b4df',
      dark: '#2f7690',
      contrastText: rosePineMoonPalette.text,
    },
    success: {
      main: rosePineMoonPalette.pine,
      light: '#53b4df',
      dark: '#2f7690',
      contrastText: rosePineMoonPalette.text,
    },
    background: {
      default: rosePineMoonPalette.base,
      paper: rosePineMoonPalette.surface,
    },
    text: {
      primary: rosePineMoonPalette.text,
      secondary: rosePineMoonPalette.subtle,
      disabled: rosePineMoonPalette.muted,
    },
    rosePine: rosePineMoonPalette, // Expose all Rosé Pine Moon colors
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  /*
  Define component overrides here if needed
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: rosePineMoonPalette.overlay,
          color: rosePineMoonPalette.text,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: rosePineMoonPalette.surface,
          color: rosePineMoonPalette.text,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: rosePineMoonPalette.base,
        },
        containedSecondary: {
          color: rosePineMoonPalette.base,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: rosePineMoonPalette.surface,
        },
      },
    },
  },
  */
});