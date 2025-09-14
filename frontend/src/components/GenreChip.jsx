import { Chip } from '@mui/material';
import { getGenre } from '../utils/genres';

const GenreChip = () => {
  return <Chip label={getGenre(16)}> </Chip>;
};

export default GenreChip;
