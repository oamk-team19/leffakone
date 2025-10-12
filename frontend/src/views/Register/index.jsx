import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  TextField,
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [passwordWarningText, setPasswordWarningText] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [signupError, setSignupError] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Reset email and password error message
  React.useEffect(() => {
    setSignupError(false);
    setPasswordAlert(false);
  }, [email, password, repeatPassword]);

  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setSignupError(true);
      setSignupErrorMessage('Please enter a valid email address');
      return;
    }

    if (password !== repeatPassword) {
      setPasswordWarningText('Passwords must match');
      setPasswordAlert(true);
      return;
    }
    if (password.length < 8) {
      setPasswordWarningText('Password must contain 8 or more characters');
      setPasswordAlert(true);
      return;
    }
    if (password.search(/[A-Z]/) == -1) {
      setPasswordWarningText(
        'Password must contain at least one upper case letter'
      );
      setPasswordAlert(true);
      return;
    }
    if (password.search(/[a-z]/) == -1) {
      setPasswordWarningText(
        'Password must contain at least one lower case letter'
      );
      setPasswordAlert(true);
      return;
    }
    if (password.search(/[0-9]/) == -1) {
      setPasswordWarningText('Password must contain at least one number');
      setPasswordAlert(true);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          email,
          username,
          password,
        }
      );
      console.log(res);
      navigate('/login');
    } catch (error) {
      if (error.response.status === 409) {
        setSignupError(true);
        setSignupErrorMessage(error.response.data.error || 'Email error');
        console.log(error);
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
          sx={{ m: 0, width: '25ch' }}
          id="outlined-email-input"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ m: 0, width: '25ch' }}
          id="outlined-username-input"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormControl sx={{ m: 0, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordStrength(e.target.value);
            }}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {passwordStrength != 0 && (
            <Box sx={{ paddingTop: 2 }}>
              <Typography variant="h7">Password strength:</Typography>{' '}
              {'★'.repeat(passwordStrength)}
              {'☆'.repeat(5 - passwordStrength)}
            </Box>
          )}
        </FormControl>
        <FormControl sx={{ m: 0, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-repeat-password">
            Repeat Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-repeat-password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Alert severity="info">
          Password must contain 8 or more characters, at least one upper case
          letter, one lower case letter and one number.
        </Alert>
        {passwordAlert && <Alert severity="error">{passwordWarningText}</Alert>}
        {signupError && <Alert severity="error">{signupErrorMessage}</Alert>}
        <Button variant="contained" type="submit">
          Submit
        </Button>
        <Link to={'/login'}>Already signed up? Sign in!</Link>
      </Box>
    </form>
  );
};
