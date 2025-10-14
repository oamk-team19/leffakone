import MovieCard from './MovieCard';
import { Stack } from '@mui/material';

const FavoriteList = ({ favoriteMovies, allowColumn }) => {
  return (
    <Stack
      direction={allowColumn ? 'column' : 'row'}
      spacing={2}
      width={1}
      sx={{ mb: 2, mt: 2, overflowX: 'scroll' }}
    >
      {favoriteMovies.map((movie) => (
        <MovieCard key={movie} movie={movie} />
      ))}
    </Stack>
  );
};

export default FavoriteList;
