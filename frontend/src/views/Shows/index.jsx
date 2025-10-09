import { Box, Typography, Card, CardMedia, CardContent, Button} from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


import { useState, useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"

export const Movies = () => {
  const [movie, setMovie] = useState(null)
  const { id } = useParams()

  const xmlToJson = useCallback((node) => {
    const json = {}

    let children = [...node.children]
    //console.log(node.nodeName)
    //console.log(node.innerHTML)

    if (!children.length) return node.innerHTML

    for (let child of children) {
      const hasSiblings = children.filter(c => c.nodeName === child.nodeName).length > 1

      if (hasSiblings) {
        if (json[child.nodeName] === undefined) {
          json[child.nodeName] = [xmlToJson(child)]
        } else {
          json[child.nodeName].push(xmlToJson(child))
        }
      } else {
        json[child.nodeName] = xmlToJson(child)
      }
    }
    return json
  }, [])

  const parseXML = useCallback((xml) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'application/xml')
    const eventNode = xmlDoc.querySelector("Event")
    return eventNode ? xmlToJson(eventNode) : null

  }, [xmlToJson])

  useEffect(() => {
    fetch(`https://www.finnkino.fi/xml/Events/?eventID=${id}`)
      
      .then((res) => res.text())
      .then((xml) => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml)
        console.log("Parsed event JSON",json)
        setMovie(json)
      })
      .catch(error => {
        console.log(error)
      })
  }, [id]);

  function decodeHTMLEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  }

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
            <CardMedia
              component="img"
              image={decodeHTMLEntities(movie?.Images.EventLargeImagePortrait)}
              alt={decodeHTMLEntities(movie?.Title)}
              sx={{ width: 400}}
            />
          </Box>
          <CardContent sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
          <Box>
            <Typography variant="h5">{decodeHTMLEntities(movie?.Title)} ({movie?.ProductionYear})</Typography>
          </Box>
          <Box>
            <Typography variant="h5">{movie?.Genres.replace(/, ?/g, ' ')} {`${Math.floor(movie?.LengthInMinutes / 60)}h ${movie?.LengthInMinutes % 60}m`}</Typography>
              {movie?.Videos?.EventVideo && (
              <Button 
              variant="outlined" 
              endIcon={<PlayArrowIcon />}
              component="a"
              href={`https://youtu.be/${movie?.Videos.EventVideo.Location}`}
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
            <Typography variant="h5">{decodeHTMLEntities(movie?.Synopsis)}</Typography>
          </Box>
          </CardContent>
        </Card>
        <Box>
            <Typography variant="h5">Jotakin lisätietoja ?</Typography>
        </Box>
      </Box>
    )
}
