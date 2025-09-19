import { Box, Divider, Grid, Typography } from '@mui/material';

export const GroupPage = () => {
  const groupName = 'Ryhmän nimi';

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ paddingY: 2 }} align="center">
        {groupName}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Shared movies</Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Shared showtimes</Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Box>
        </Grid>
        <Divider size={1} orientation="vertical" variant="fullWidth" flexItem />
        <Grid size={3}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Members</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
