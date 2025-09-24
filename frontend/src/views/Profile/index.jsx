import * as React from 'react';
import { Button, Box, Grid } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/useUser';
import { useNavigate } from 'react-router-dom';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import ShareIcon from '@mui/icons-material/Share';

export const Profile = () => {
  const { user, setUser, LogOut } = useUser();
  const navigate = useNavigate();

  const searchFavorites = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3001/user/searchfavorite',
        {
          data: { email: user.email },
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        //Show favorite list
      } else {
        console.log(res.status);
      }
    } catch (error) {
      console.log('Error in getting a favorite list: ' + error);
    }
  };

  //searchFavorites();
  const buttonPressedDeleteMe = async () => {
    /*14 Poista suosikkilistan jakaminen ja se uri*/
    try {
      const res = await axios.delete('http://localhost:3001/user/deleteuser', {
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
        <h3>My favorite movie list</h3>
        <p>Insert a list here...</p>
        <ShareIcon />
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
