import MovieCard from './MovieCard';
import { Stack } from '@mui/material';

const FavoriteList = ({ favoriteMovies }) => {
  return (
    <Stack
      direction={'row'}
      spacing={2}
      sx={{ mb: 2, mt: 2, overflowX: 'auto' }}
    >
      {favoriteMovies.map((movie) => (
        <MovieCard key={movie} movie={movie} />
      ))}
    </Stack>
  );
};

export default FavoriteList;
