
import { Typography, Box, Card } from '@mui/material';
import { Link } from 'react-router-dom';






function decodeHTMLEntities(text) {
  const element = document.createElement('div');
  element.innerHTML = text;
  return element.textContent;
}

const ShowtimeCard = ({ show, hideIcon = false, actionButton = null }) => {
  



  return (
          <Card
              sx={{
                  margin: 2,
                  border: 2,
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  boxShadow: 3
              }}
          >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
              <Box>
                  <Typography
                      variant='h5'
                      color="text.primary"
                      component={Link}
                      to={`/shows/${show.EventID}`}
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                            fontWeight: 'bold',
                            color: 'text.primary',
                            textDecoration: 'none'
                        }
                      }}
                      
                  >
                      {decodeHTMLEntities(show.Title)}</Typography>
                  <Box>
                      <Typography color='text.secondary'>{new Date(show.dttmShowStart).toLocaleDateString('fi-FI')}</Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                          {new Date(show.dttmShowStart).toLocaleTimeString('fi-FI', {
                              hour: '2-digit',
                              minute: '2-digit',
                          })}
                      </Typography>
                      <Typography>{show.Theatre}</Typography>
                  </Box>
              </Box>
              <Box sx={{
                textAlign: 'right'
              }}>
                {!hideIcon && actionButton}
              </Box>
            </Box>
          </Card>   
  )
}

export default ShowtimeCard;
