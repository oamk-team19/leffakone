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

