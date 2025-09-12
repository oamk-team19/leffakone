import * as React from 'react';
import { Button, Typography, TextField, Box, Link } from '@mui/material';

export const Register = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
      <Typography variant="h4">Registration</Typography>
      <Typography variant="body1">Please fill out the form:</Typography>
      <TextField id="email" label="Email" variant="outlined"/>
      <TextField id="username" label="Username" variant="outlined" />
      <TextField id="password" label="Password" variant="outlined" />
      <TextField id="repeat-password" label="Repeat Password" variant="outlined" />
      <Button variant="contained">Submit</Button>
      <Link href="/login">Already signed up? Sign in!</Link>
    </Box>
  );
};
