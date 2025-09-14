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
  Autocomplete,
  Alert,
  CardActionArea,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import GenreChip from '../../components/GenreChip';
import GenreSelector from '../../components/GenreSelector';
import { getGenres } from '../../utils/genres';
const imageMaxHeight = 200;
const imageMaxWidth = imageMaxHeight / 1.5;

export const MainPage = () => {
  const [wantedGenres, setWantedGenres] = useState([]);
  const [unwantedGenres, setUnwantedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > 3) {
      const fetchMovies = async () => {
        try {
          const response = await axios.get(
            'http://localhost:3001/movies/search',
            {
              params: { query: debouncedSearchQuery },
            }
          );
          console.log(response.data.results);
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
        label="Outlined"
        variant="outlined"
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth={true}
      />
      <Box>
        <GenreSelector
          disabledOptions={[...wantedGenres, ...unwantedGenres]}
          label={'Wanted tags'}
          selectedGenres={wantedGenres}
          onChange={(_e, newValue) => setWantedGenres(newValue)}
        ></GenreSelector>
        <GenreSelector
          disabledOptions={[...wantedGenres, ...unwantedGenres]}
          label={'Unwanted tags'}
          selectedGenres={unwantedGenres}
          onChange={(event, newValue) => setUnwantedGenres(newValue)}
        ></GenreSelector>
      </Box>
      <Box mt={2}>
        {
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-start',
              flexDirection: 'column',
            }}
          >
            {filteredResults.map((movie) => (
              <Card
                key={movie.id}
                sx={{ display: 'flex', mb: 1, width: '100%' }}
              >
                <Grid container spacing={3}>
                  <Grid size="auto">
                    {movie.poster_path ? (
                      <CardMedia
                        component="img"
                        sx={{
                          maxHeight: '200px',
                        }}
                        image={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                      />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        width={imageMaxWidth}
                        height={imageMaxHeight}
                      />
                    )}
                  </Grid>
                  <Grid size="grow" sx={{ minWidth: '500px' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography variant="h6">{movie.title}</Typography>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                      >
                        {movie.overview}
                      </Typography>
                      <Typography>{movie.genre_ids.join(' ')}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid>
                    <GenreChip />
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        }
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
