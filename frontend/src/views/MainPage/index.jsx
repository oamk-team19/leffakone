import * as React from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Alert,
  IconButton,
  ListItemButton,
  Select,
  MenuItem,
  Rating,
  Autocomplete,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import GenreChip from '../../components/GenreChip';
import GenreSelector from '../../components/GenreSelector';
import { useUser } from '../../context/useUser';

import { Link } from 'react-router-dom';

import { getLangs } from '../../utils/langCodes';

const IMG_HEIGHT = 200;
const IMG_WIDTH = IMG_HEIGHT / 1.5;

const ratings = [...Array(20).keys()].map((x) => x / 2).reverse();

export const MainPage = () => {
  const { user } = useUser();
  const [wantedGenres, setWantedGenres] = useState([]);
  const [unwantedGenres, setUnwantedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [langFilters, setLangFilters] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > 1) {
      const fetchMovies = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/movies/search`,
            {
              params: { query: debouncedSearchQuery },
            }
          );
          setSearchResults(response.data.results);
        } catch (error) {
          console.error('There was an error!', error);
        }
      };

      fetchMovies();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (searchResults.length === 0) return setFilteredResults([]);
    setFilteredResults(
      searchResults
        .filter((movie) =>
          wantedGenres.every(
            (wanted) => movie?.genre_ids && movie.genre_ids.includes(wanted.id)
          )
        )
        .filter((movie) =>
          unwantedGenres.every(
            (unwanted) =>
              movie?.genre_ids && !movie.genre_ids.includes(unwanted.id)
          )
        )
        .filter((movie) =>
          minRating > 0 ? movie.vote_average >= minRating : true
        )
        .filter((movie) =>
          langFilters.length > 0
            ? movie.original_language &&
              langFilters.map((l) => l.code).includes(movie.original_language)
            : true
        )
    );
  }, [wantedGenres, unwantedGenres, searchResults, minRating, langFilters]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/favorite`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${user.token}`,
            },
          }
        );
        setFavorites(response.data || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
    fetchFavorites();
  }, []);

  const addOrRemoveFavorite = (movieId) => async () => {
    if (favorites.some((fav) => fav === movieId)) {
      // Movie is in favorites, remove it (DELETE)
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/user/favorite`,
          {
            data: { movieId: movieId },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${user.token}`,
            },
          }
        );
        console.log('Removed favorite:', response.data);
        // Update local state
        setFavorites(favorites.filter((fav) => fav !== movieId));
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    } else {
      // Movie is not in favorites, add it (POST)
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/favorite`,
          {
            movieId: movieId,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log('Added favorite:', response.data);
        // Update local state
        setFavorites([...favorites, movieId]);
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };
  console.log('favorites:', favorites);
  return (
    <Box>
      <Typography variant="h4">Welcome to Leffakone</Typography>
      <TextField
        id="outlined-basic"
        label="Search for movies!"
        variant="outlined"
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />
      <Box sx={{ mt: 2, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <GenreSelector
              disabledOptions={[...wantedGenres, ...unwantedGenres]}
              label={'Wanted tags'}
              selectedGenres={wantedGenres}
              onChange={(_e, newValue) => setWantedGenres(newValue)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <GenreSelector
              disabledOptions={[...wantedGenres, ...unwantedGenres]}
              label={'Unwanted tags'}
              selectedGenres={unwantedGenres}
              onChange={(_e, newValue) => setUnwantedGenres(newValue)}
            />
          </Grid>
          <Grid size={{ xs: 3, md: 2, lg: 1 }}>
            <Select
              labelId="select-rating"
              id="select-rating"
              value={minRating}
              label="Minimum rating"
              onChange={(e) => setMinRating(e.target.value)}
              fullWidth
            >
              {ratings.map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating ? `≥ ${rating}` : `All`}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 9, md: 10, lg: 3 }}>
            <Autocomplete
              multiple
              fullWidth
              id="langSelect"
              options={getLangs() ?? []}
              getOptionLabel={(option) => option.name}
              defaultValue={langFilters}
              value={langFilters}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Languages" />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  {option.code.toUpperCase()} - {option.name}
                </Box>
              )}
              onChange={(_e, newValue) => setLangFilters(newValue)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredResults &&
          filteredResults.length > 0 &&
          filteredResults.map((movie) => (
            <Card
              key={movie.id}
              sx={{
                display: 'flex',
                mb: 1,
                width: '100%',
                height: IMG_HEIGHT,
              }}
            >
              {/* Poster Section */}
              <Box sx={{ flexShrink: 0, width: IMG_WIDTH }}>
                {movie.poster_path ? (
                  <CardMedia
                    component="img"
                    sx={{
                      height: IMG_HEIGHT,
                      width: IMG_WIDTH,
                      objectFit: 'cover',
                    }}
                    image={`https://image.tmdb.org/t/p/w${IMG_WIDTH < 200 ? 200 : IMG_WIDTH}/${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width={IMG_WIDTH}
                    height={IMG_HEIGHT}
                  />
                )}
              </Box>

              {/* Content section */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 2,
                }}
              >
                {/* Top part of content */}
                <Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <ListItemButton component={Link} to={`/movies/${movie.id}`}>
                      <Typography variant="h6">{movie.title}</Typography>
                    </ListItemButton>
                    <Rating
                      sx={{ display: { xs: 'none', md: 'flex' } }}
                      precision={0.1}
                      name="customized-10"
                      value={movie.vote_average}
                      max={10}
                      readOnly
                    />
                    <Typography sx={{ display: { xs: 'flex', md: 'none' } }}>
                      <Rating value={1} max={1} readOnly></Rating>{' '}
                      {`${movie.vote_average?.toFixed(1) ?? '-'}/10`}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      mb: 1,
                    }}
                  >
                    {movie.overview}
                  </Typography>
                </Box>

                {/* Bottom part for genres and actions */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {movie &&
                      movie.genre_ids &&
                      movie.genre_ids.map((genreid) => (
                        <GenreChip key={genreid} genreid={genreid} />
                      ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton>
                      {favorites.some((fav) => fav === movie.id) ? (
                        <FavoriteIcon
                          color="error"
                          fontSize="large"
                          onClick={addOrRemoveFavorite(movie.id)}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          color={
                            favorites.some((fav) => fav === movie.id)
                              ? 'error'
                              : 'inherit'
                          }
                          fontSize="large"
                          onClick={addOrRemoveFavorite(movie.id)}
                        />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
      </Box>
      {searchQuery.length > 0 && filteredResults.length === 0 && (
        <Alert severity="info">
          We searched far and wide but found nothing! Consider easing filters or
          search words
        </Alert>
      )}
    </Box>
  );
};
