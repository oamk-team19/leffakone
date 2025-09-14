import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, TextField, Box } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      alert('Passwords must match');
      return;
    } else if (password.length < 8) {
      alert('Password must contain 8 or more characters');
      return;
    } else if (password.search(/[A-Z]/) == -1) {
      alert('Password must contain at least one upper case letter');
      return;
    } else if (password.search(/[a-z]/) == -1) {
      alert('Password must contain at least one lower case letter');
      return;
    } else if (password.search(/[0-9]/) == -1) {
      alert('Password must contain at least one number');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/auth/signup', {
        email,
        username,
        password,
      });
      console.log(res);
      navigate('/login');
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        <Typography variant="h4">Registration</Typography>
        <Typography variant="body1">Please fill out the form:</Typography>
        <TextField
          id="outlined-email-input"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-username-input"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          id="outlined-repeat-password-input"
          label="Repeat Password"
          variant="outlined"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
        <Link to={'/login'}>Already signed up? Sign in!</Link>
      </Box>
    </form>
  );
};
