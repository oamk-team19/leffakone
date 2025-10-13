

import { Stack } from '@mui/material';
import ShowtimeCard from './ShowtimeCard';

const ShowtimeList = ({ times, actionButton, hideIcon }) => {
  
  return (
    <Stack
        direction={'column'}
        spacing={2}
        sx={{
            mb:2,
            mt:2
        }}>
        {times.map((show) => (
            <ShowtimeCard key={show.ID} show={show} actionButton={actionButton ? actionButton(show) : undefined} hideIcon={hideIcon}/>
    ))}
    </Stack>
    

      
    
  );
};

export default ShowtimeList;