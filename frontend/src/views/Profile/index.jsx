import * as React from 'react';
import { Button, Box } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/useUser';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, setUser, LogOut } = useUser();
  const navigate = useNavigate();

  const buttonPressed = async () => {
    try {
      await axios.post(
        'http://localhost:3001/auth/signout',
        {},
        { withCredentials: true }
      );
      LogOut();
      navigate('/login');
    } catch (error) {
      console.log('Error while signing out: ', error);
      return;
    }
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <h2>Omasivu</h2>
      <Button variant="contained" onClick={buttonPressed}>
        Sign out
      </Button>
    </Box>
  );
};
