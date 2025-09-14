import * as React from 'react';
import { Button, Typography, TextField, Box, Alert } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { use } from 'react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessageForButton, setErrorMessageForButton] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents refresh
    
    
    await axios
      .post('http://localhost:3001/auth/signin', {
        email,
        password,
      })
      .then((res) => {
        setErrorMessageForButton('');
        //is done when success
        console.log(res.status + ' ' + res.statusText); //200 OK
        //console.log(res); //data

        //set token to session storage
        sessionStorage.setItem('user', JSON.stringify(res.data));

        navigate('/'); //Change if you want somewhere else than home page
      })
      .catch((error) => {
        //if fails
        console.log(error);
        //Laita käyttäjälle näkyviin
        setErrorMessageForButton('No valid email or password');
      })
      .finally(() => {
        //Done always, for example empty textfield/input
        setEmail('');
        setPassword('');        
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
          value={email}
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Sign in
        </Button>
        {errorMessageForButton && (
          <Alert severity="error">{errorMessageForButton}</Alert>
        )}
        <Link to={'/register'}>Don't have an account? Sign up!</Link>
      </Box>
    </form>
  );
};
