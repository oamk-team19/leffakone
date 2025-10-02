import { useColorMode } from '../context/themeContext'; // Adjust path as needed
import { ToggleButton, ToggleButtonGroup, Box, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode'; // Import icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness2Icon from '@mui/icons-material/Brightness2'; // Example for 'Moon'

export function ThemeToggleButton() {
  const { toggleColorMode, mode } = useColorMode();

  const handleModeChange = (event, newMode) => {
    // Only call toggleColorMode if a newMode is selected (not null)
    if (newMode !== null) {
      toggleColorMode(event, newMode);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ToggleButtonGroup
        value={mode} // The currently selected mode
        exclusive // Ensures only one button can be selected at a time
        onChange={handleModeChange}
        aria-label="theme selection"
        size="small"
        color={'warning'}
      >
        <Tooltip title="Light Mode">
          <ToggleButton value="light" aria-label="light mode">
            <LightModeIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Dark Mode">
          <ToggleButton value="dark" aria-label="dark mode">
            <DarkModeIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Moon Mode">
          <ToggleButton value="moon" aria-label="moon mode">
            <Brightness2Icon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
}
/*

import { useColorMode } from "../context/themeContext";
import { FormControlLabel, Switch } from "@mui/material";

export function ThemeToggleButton() {
  const { toggleColorMode, mode } = useColorMode();
  return (
    <FormControlLabel
      control={
        <Switch
          checked={mode === 'dark'}
          onChange={toggleColorMode}
          name="theme-switch"
          color="primary"
        />
      }
      label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
    />
  );
}

*/
