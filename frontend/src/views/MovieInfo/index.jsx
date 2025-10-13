
import axios from "axios"
import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Tooltip, Button, TextField, Rating, Stack} from "@mui/material"
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GenreChip from '../../components/GenreChip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useUser } from "../../context/useUser"

export const MovieInfo = () => {
    const [movie, setMovie] = useState(null)
    const [trailer, setTrailer] = useState()
    const { id } = useParams()
    const [value, setValue] = React.useState(null)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [reviewText, setReviewText] = useState('')
    const maxLength = 255
    const { user } = useUser()
    const isLoggedIn = !!user.token
    const [reviews, setReviews] = useState([])
    const navigate = useNavigate()

    const handleTextChange = (event) => {
      const newText = event.target.value;
      if (newText.length <= maxLength) {
      setReviewText(newText);
    }
  }

    const isFormValid = reviewText.trim() !== '' && value !== null

    useEffect(() => {
        const fetchMovie = async () => {
            try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/movie/info`,
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
                `${import.meta.env.VITE_API_URL}/video/trailer`,
                {
                    params: {id: id}
                }
            );
    
            setTrailer(response.data);
            console.log(response.data);
        } catch (error) {
          if (error.response?.status ===404) {
              console.warn('Trailer not found');
              setTrailer(null);
          }
            console.error('Error happened',error)
        }
    };
    fetchTrailer();
  }, [id])


  const handleSubmit = async () => {
    const reviewData = {
      idMovie: id,
      idUser: user.id,
      email: user.email,
      description: reviewText,
      rating: value
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/review/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const savedReview = await response.json();
        console.log('Review saved:', savedReview);

        const updatedReviews = await axios.get(`${import.meta.env.VITE_API_URL}/review`, {
        params: { idMovie: id }
        });
        setReviews(updatedReviews.data);
        setShowReviewForm(false)
        setValue(null)
        setReviewText('')
      } else {
        console.error('Review failed:', await response.json());
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };

    useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/review/`,
        {
          params: {idMovie: id}
        }
      ).then(response =>  {
        setReviews(response.data)
      })
      .catch(error => {
        alert(error.response.data ? error.response.data.message : error)
      })
    }, [id])

    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
      
        <Card 
         
          sx={{
            display: 'flex',
            mb: 1,
            ml: 1,
            width: '100%',
            boxShadow: 'none'
        }}
        >
          <Box>
            {/* <Typography variant="h5">Kuva</Typography> */}
            {movie?.poster_path && (
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie?.title}
              sx={{ width: {
                      xs: 600,
                      sm: 800,
                      md: 1000,
                      lg: 1200
              },
                    minWidth: 200,
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 10 }}
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
            <Box 
             sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

              <Tooltip title="Add to group">
                <IconButton aria-label="delete">
                  <FormatListBulletedAddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add to favorites">
                <IconButton aria-label="delete">
                  <FavoriteBorderIcon />
                </IconButton>
              </Tooltip>
              {trailer && (
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
              )}
            </Box>
          <Box>
            <Typography variant="h5">{movie?.overview}</Typography>
          </Box>
  
          </CardContent>
        </Card>
        <Box>
          <Typography variant="h5"
            sx={{marginLeft: '2rem'}}
          >Reviews</Typography>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}
            sx={{marginTop: '1rem',
              marginBottom: '2rem'
            }}
          >
          <Tooltip title={isLoggedIn ? "Write a review" : "Login to review"}>
            <Button 
              variant="contained" 
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login')
                } else {
                  setShowReviewForm(true)}
                }
              } 
            >Review movie
            </Button>
          </Tooltip>
            {showReviewForm && (
            <>
            <TextField 
            id="filled-multiline-static"
            label="Review"
            multiline
            rows={4}
            variant="filled"
            value={reviewText}
            onChange={handleTextChange}
            sx={{ width: '500px'}}
            />
            <Typography variant="body2" color={reviewText.length >= maxLength ? 'error' : 'textSecondary'}>
             {reviewText.length} / {maxLength}
            </Typography>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
              setValue(newValue);
              }}
            />
            <Box display="flex"  gap={2}>
              <Button variant="outlined"
                onClick={() => {
                  setShowReviewForm(false)
                  setValue(null)
                  setReviewText('')
                }}
              >Cancel</Button>
              <Button 
                variant="contained"
                disabled={!isFormValid}
                onClick={handleSubmit}
              >Send Review</Button>
            </Box>
            </>
            )}
          </Box>
          <Box 
            sx={{
              ml:1,
              mr:1
            }}>
            <Stack spacing={3}
            alignItems={"center"}
            >
              {reviews.length === 0 ? (
                <Typography variant="h6"
                  color="text.secondary"
                  >No Reviews</Typography>
              ) : (
              reviews.map((review, index) =>(
              <Box key={index} 
                sx={{
                  width: '100%',
                  maxWidth: 1000,
                }}>
              <Card  variant="outlined"
                sx={{ borderRadius: 2,
                  borderWidth:4
                }}
              >
                <CardContent>
                  <Typography>{review.email}</Typography>
                  <Typography color="text.secondary">
                    {new Date(review.datetime).toLocaleDateString('fi-FI')}
                  </Typography> 
                  <Typography variant="body1">{review.description}</Typography>
                  <Rating value={review.rating} readOnly/>
                </CardContent>
              </Card>
              </Box>
            )
          ))}
            </Stack>
          </Box>
        </Box>
      </Box> 
    )
}