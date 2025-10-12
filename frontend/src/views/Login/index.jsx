import * as React from 'react';
import {
  Button,
  Typography,
  TextField,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormControl,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/useUser'; //add useUser
import { useEffect } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const Login = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isAutoLogin, setIsAutoLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    async function loginasyncFunction() {
      try {
        await autoLogin();
      } catch {
        setIsAutoLogin(false);
        return;
      }
      navigate('/');
    }
    loginasyncFunction();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents refresh
    signIn();
  };

  const signIn = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signin`,
        { email: email, password: password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      //is done when success
      console.log(res.status + ' ' + res.statusText); //200 OK
      saveUser(res);
      navigate('/Profile'); //Change if you want somewhere else than home page
    } catch (error) {
      //if fails
      setError('Wrong email or/and password.');
    } finally {
      //Done always, for example empty textfield/input
      setEmail('');
      setPassword('');
    }
  };

  const autoLogin = async () => {
    await axios
      .post(
        `${import.meta.env.VITE_API_URL}/autologin`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        saveUser(res);
      })
      .catch((error) => {
        throw error;
      });
  };

  const saveUser = async (response, id) => {
    const getToken = response.headers['authorization'];
    const usersData = {
      email: response.data.email,
      id: response.data.iduser,
      token: getToken,
    };

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Button variant="contained" type="submit">
              Sign in
            </Button>
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            <Link to={'/register'}>Don't have an account? Sign up!</Link>
          </Box>
        </form>
      )}
    </>
  );
};
