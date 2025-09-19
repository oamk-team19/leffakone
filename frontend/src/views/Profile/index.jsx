import * as React from 'react';
import { Button, Box, Grid } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/useUser';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, setUser, LogOut } = useUser();
  const navigate = useNavigate();

  const buttonPressedDeleteMe = async () => {
    try {
      const res = await axios.delete('http://localhost:3001/auth/deleteuser', {
        data: { email: user.email },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      buttonPressedLogOut();
    } catch (error) {
      console.log('Error in deleting the user: ' + error);
    }
  };

  const buttonPressedLogOut = async () => {
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
    <div>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        <h2>My profile</h2>
        <Button variant="outlined" onClick={buttonPressedDeleteMe}>
          Delete my profile
        </Button>
        <Button variant="contained" onClick={buttonPressedLogOut}>
          Sign out
        </Button>
      </Box>
    </div>
  );
};
