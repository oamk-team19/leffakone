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
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import GenreChip from '../../components/GenreChip';
import GenreSelector from '../../components/GenreSelector';

const IMG_HEIGHT = 200;
const IMG_WIDTH = IMG_HEIGHT / 1.5;

export const MainPage = () => {
  const [wantedGenres, setWantedGenres] = useState([]);
  const [unwantedGenres, setUnwantedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > 1) {
      const fetchMovies = async () => {
        try {
          const response = await axios.get(
            'http://localhost:3001/movies/search',
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
    setFilteredResults(
      searchResults
        .filter((movie) =>
          wantedGenres.every((wanted) => movie.genre_ids.includes(wanted.id))
        )
        .filter((movie) =>
          unwantedGenres.every(
            (unwanted) => !movie.genre_ids.includes(unwanted.id)
          )
        )
    );
  }, [wantedGenres, unwantedGenres, searchResults]);
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
          <Grid size={{ xs: 12, md: 6 }}>
            <GenreSelector
              disabledOptions={[...wantedGenres, ...unwantedGenres]}
              label={'Wanted tags'}
              selectedGenres={wantedGenres}
              onChange={(_e, newValue) => setWantedGenres(newValue)}
            ></GenreSelector>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GenreSelector
              disabledOptions={[...wantedGenres, ...unwantedGenres]}
              label={'Unwanted tags'}
              selectedGenres={unwantedGenres}
              onChange={(event, newValue) => setUnwantedGenres(newValue)}
            ></GenreSelector>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredResults &&
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
                  <Typography variant="h6">{movie.title}</Typography>
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
                    {movie.genre_ids &&
                      movie.genre_ids.map((genreid) => (
                        <GenreChip key={genreid} genreid={genreid} />
                      ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton>
                      <FavoriteBorderIcon />
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
