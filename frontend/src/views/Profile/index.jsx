import * as React from 'react';
import { Button, Box, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/useUser';
import { useNavigate } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteList from '../../components/FavoriteList';

export const Profile = () => {
  const { user, setUser, LogOut } = useUser();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const responseMovieArray = [];

  const handleClick = () => {
    //Copy URI to clipboard
    navigator.clipboard.writeText('http://localhost:5173/profile');
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const searchFavorites = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/user/searchfavorite',
          {
            params: { idUser: user.id },
          }
        );

        //Show favorite list
        if (!response.data.error) {
          //Edit data to array
          for (let index = 0; index < response.data.length; index++) {
            responseMovieArray.push(response.data[index].idMovie);
          }
          setSearchResults(responseMovieArray);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.log('Error in getting a favorite list: ' + error);
        setSearchResults([]); // Default movies if error
      }
    };

    searchFavorites();
  }, []);

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

        {searchResults && searchResults.length > 0 ? (
          <FavoriteList favoriteMovies={searchResults} />
        ) : (
          <Typography>No favorite movies yet!</Typography>
        )}

        <Button startIcon={<ShareIcon />} onClick={handleClick}>
          Share my favorite list
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message="Copied URI to clipboard"
        />

        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={buttonPressedDeleteMe}
        >
          Delete my profile
        </Button>

        <Button variant="contained" onClick={buttonPressedLogOut}>
          Sign out
        </Button>
      </Box>
    </div>
  );
};
