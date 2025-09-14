import { Chip } from '@mui/material';
import { getGenre } from '../utils/genres';

const GenreChip = ({ genreid }) => {
  return <Chip label={getGenre(genreid)}> </Chip>;
};

export default GenreChip;
