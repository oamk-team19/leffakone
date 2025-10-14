import FavoriteList from '../../components/FavoriteList';
import axios from 'axios';
import { useUser } from '../../context/useUser';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

export const FavoritePage = () => {
  const { user } = useUser();
  const { idUser } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    console.log(idUser);
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/searchfavorite`,
          {
            params: { idUser: idUser },
          }
        );
        if (!response.data.error) {
          setFavorites(response.data);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.log('Error in getting a favorite list: ' + error);
        setFavorites([]); // Default movies if error
      }
    };

    const getUserName = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${idUser}`
        );
        if (response.data.username) {
          setUsername(response.data.username);
        } else {
          setUsername('');
        }
      } catch (error) {
        console.log('Error fetching username: ', error);
        setUsername('');
      }
    };

    fetchFavorites();
    getUserName();
  }, []);
  return (
    <>
      {username ? (
        <>
          <Typography variant="h2">{username}'s Favorite Movies</Typography>
          {favorites.length > 0 ? (
            <FavoriteList favoriteMovies={favorites} allowColumn={false} />
          ) : (
            <Typography variant="h6">
              {username} doesn't have favorites yet.
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="h2">404 - User not found</Typography>
      )}
    </>
  );
};
