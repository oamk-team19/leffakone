
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Tooltip, Button} from "@mui/material"
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GenreChip from '../../components/GenreChip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export const MovieInfo = () => {
    const [movie, setMovie] = useState(null)
    const [trailer, setTrailer] = useState()
    const { id } = useParams()

    useEffect(() => {
        const fetchMovie = async () => {
            try {
            const response = await axios.get(
                'http://localhost:3001/movie/info',
                {
                    params: {id: id}
                }
            );
            setMovie(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error happened',error)
        }
    };
    fetchMovie();
}, [id])

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
            const response = await axios.get(
                'http://localhost:3001/video/trailer',
                {
                    params: {id: id}
                }
            );
            setTrailer(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error happened',error)
        }
    };
    fetchTrailer();
}, [id])

    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
      
        <Card 
         
          sx={{
            display: 'flex',
            mb: 1,
            width: '100%',
        }}
        >
          <Box>
            {/* <Typography variant="h5">Kuva</Typography> */}
            {movie?.poster_path && (
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie?.title}
              sx={{ width: 400}}
            />
            )}
          </Box>
          <CardContent sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
          <Box>
            <Typography variant="h5">{movie?.title} ({new Date(movie?.release_date).getFullYear()})</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="h5">{movie?.release_date} </Typography>
                 {movie?.genres?.map((genre) => (
                <GenreChip key={genre.id} genreid={genre.id} />
              ))}
            <Typography variant="h5">
              {`${Math.floor(movie?.runtime / 60)}h  ${movie?.runtime % 60}m`}
            </Typography>

          </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

              <Tooltip title="Lisää listalle">
                <IconButton aria-label="delete">
                  <FormatListBulletedAddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Lisää suosikkeihin">
                <IconButton aria-label="delete">
                  <FavoriteBorderIcon />
                </IconButton>
              </Tooltip>
              <Button variant="outlined"
                endIcon={<PlayArrowIcon />}
                component="a"
                href={trailer?.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >Trailer
              </Button>
            </Box>
          <Box>
            <Typography variant="h5">{movie?.overview}</Typography>
          </Box>
          <Box>
          </Box>
          </CardContent>
        </Card>
        <Box>
          <Typography variant="h5">Arvostelut</Typography>
        </Box>
      </Box> 
    )
}