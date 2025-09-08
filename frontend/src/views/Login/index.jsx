import * as React from 'react';
import { Button, Typography, TextField, Link } from '@mui/material';

export const Login = () => {
  return (
    <>
      <Typography variant="h4">Login</Typography>
      <div>
        <TextField
          id="outlined-email-input"
          label="Email"
          type="email"
        />
      </div>
      <div>
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
        />
      </div>
      <div>
        <Button variant="contained">Sign in</Button>
      </div>
      <Link
        component="button"
        variant="body2"
        onClick={() => {
          console.info("I'm a button.");
        }}
      >
        Don't have an account? Sign up!
      </Link>
    </>

  );

};
