import * as React from 'react';
import { Button, Typography, TextField, Link } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents refresh

    await axios.post('http://localhost:3001/auth/signin', {
      email, password
    }).then((res) => {
      //then tehdään jos onnistuu
      console.log(res);
    }).catch((error) =>{
      //jos epäonistuu
      console.log(error)
    }).finally( () => {
      //tehdään aina, esim tyhjätään hakukenttä
    }) 
  };

  return (
    <>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="outlined-email-input"
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div></div>
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <Button variant="contained" type="submit">
            Sign in
          </Button>
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
      </form>
    </>
  );
};
