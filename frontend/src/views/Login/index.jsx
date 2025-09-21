import * as React from 'react';
import { Button, Typography, TextField, Box } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/useUser'; //add useUser
import { useEffect } from 'react';

export const Login = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isAutoLogin, setIsAutoLogin] = useState(true);

  useEffect(() => {
    async function loginasyncFunction() {
      try {
        await autoLogin();
      } catch {
        setIsAutoLogin(false);
        return;
      }
      navigate('/');
    };
    loginasyncFunction();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents refresh
    signIn();
  };

  const signIn = async () => {
    await axios
      .post(
        'http://localhost:3001/auth/signin',
        {
          email: user.email,
          password: user.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      .then((res) => {
        //is done when success
        console.log(res.status + ' ' + res.statusText); //200 OK
        saveUser(res);
        navigate('/Profile'); //Change if you want somewhere else than home page
      })

      .catch((error) => {
        //if fails
        console.log(error);
        setUser({ email: '', password: '', token: '' });
      })
      .finally(() => {
        //Done always, for example empty textfield/input
      });
  };
  const autoLogin = async () => {
    await axios
      .post(
        'http://localhost:3001/autologin',
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        saveUser(res);
      })
      .catch((error) => {
        console.log(error);
        throw (error);
      });
  };

  const saveUser = async (response) => {
    const getToken = response.headers['authorization'];
    const usersData = { email: response.data.email, token: getToken };

    setUser(usersData);
    sessionStorage.setItem('user', JSON.stringify(usersData));
  };

  return (
    <>
      {isAutoLogin ? (
        <p>Logging in...</p>
      ) : (
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
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Button variant="contained" type="submit">
              Sign in
            </Button>
            <Link to={'/register'}>Don't have an account? Sign up!</Link>
          </Box>
        </form>
      )}
    </>
  );
};
