import * as React from 'react';
import { Button, Typography, TextField, Box } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents refresh

    await axios
      .post('http://localhost:3001/auth/signin', {
        email,
        password,
      })
      .then((res) => {
        //is done when success
        console.log(res.status + ' ' + res.statusText); //200 OK
        //console.log(res); //data

        //set token to session storage
        sessionStorage.setItem('user',JSON.stringify(res.data));

        navigate('/'); //Change if you want somewhere else than home page
      })
      .catch((error) => {
        //if fails
        console.log(error);
      })
      .finally(() => {
        //Done always, for example empty textfield/input
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        <Typography variant="h4">Login</Typography>
        <TextField
          id="outlined-email-input"
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Sign in
        </Button>
        <Link to={'/register'}>Don't have an account? Sign up!</Link>
      </Box>
    </form>
  );
};
