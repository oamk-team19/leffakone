import * as React from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { getGenres } from '../utils/genres';

const GenreSelector = ({
  label,
  disabledOptions,
  selectedGenres,
  onChange,
}) => {
  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={getGenres() ?? []}
      getOptionLabel={(option) => option.genre}
      defaultValue={selectedGenres}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={label} />
      )}
      getOptionDisabled={(option) =>
        disabledOptions.map((o) => o.id).includes(option.id)
      }
      onChange={onChange}
    />
  );
};

export default GenreSelector;
