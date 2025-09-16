import * as React from 'react';
import { Button, Typography, TextField, Box } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../../context/useUser" //add useUser

export const Login = () => {
  const { user, setUser } = useUser();
  
  //const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents refresh

    await axios
      .post('http://localhost:3001/auth/signin', {
        email: user.email,
        password: user.password,
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
          onChange={e => setUser({...user, email: e.target.value})}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          onChange={e => setUser({...user, password: e.target.value})}
        />
        <Button variant="contained" type="submit">
          Sign in
        </Button>
        <Link to={'/register'}>Don't have an account? Sign up!</Link>
      </Box>
    </form>
  );
};
