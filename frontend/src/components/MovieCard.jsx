import {
  Card,
  CardMedia,
  Skeleton,
  Typography,
  Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_IMG_HEIGHT = 500;
const BASE_IMG_WIDTH = BASE_IMG_HEIGHT / 1.5;
const MovieCard = ({ movie }) => {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/movie/info`,
          {
            params: { id: movie },
          }
        );
        setMovieDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error happened', error);
      }
    };
    fetchMovie();
  }, []);

  const responsiveImageDimensions = {
    xs: { width: BASE_IMG_WIDTH / 2, height: BASE_IMG_HEIGHT / 2 },
    sm: { width: (BASE_IMG_WIDTH * 2) / 3, height: (BASE_IMG_HEIGHT * 2) / 3 },
    md: { width: BASE_IMG_WIDTH, height: BASE_IMG_HEIGHT },
  };

  const getResponsiveDimension = (dimension) => ({
    xs: responsiveImageDimensions.xs[dimension],
    sm: responsiveImageDimensions.sm[dimension],
    md: responsiveImageDimensions.md[dimension],
  });

  return (
    <Link
      to={`/movies/${movieDetails?.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card
        sx={{
          maxWidth: getResponsiveDimension('width'),
          margin: 2,
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        {movieDetails?.poster_path ? (
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              '&:hover .title-overlay': {
                background: 'rgba(0, 0, 0, 0.85)',
                height: '100%',
                paddingTop: '40px',
              },
              '&:hover .overlay-content': {
                opacity: 1,
                maxHeight: '200px',
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: getResponsiveDimension('height'),
                width: getResponsiveDimension('width'),
                objectFit: 'cover',
                display: 'block',
              }}
              image={`https://image.tmdb.org/t/p/w${500}/${movieDetails.poster_path}`}
              alt={`${movieDetails.title} poster`}
            />

            {/* Title overlay */}
            <Box
              className="title-overlay"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                color: 'white',
                padding: '20px 16px 16px',
                height: 'auto',
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 600,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                  marginBottom: '8px',
                }}
              >
                {movieDetails?.title}
              </Typography>
              {/* Additional content that appears on hover */}
              <Box
                className="overlay-content"
                sx={{
                  opacity: 0,
                  maxHeight: 0,
                  overflow: 'hidden',
                  transition:
                    'opacity 0.3s ease-in-out, max-height 0.3s ease-in-out',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.4,
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {movieDetails?.overview || 'No description available.'}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Skeleton
            variant="rectangular"
            width={getResponsiveDimension('width')}
            height={getResponsiveDimension('height')}
          />
        )}
      </Card>
    </Link>
  );
};

export default MovieCard;
