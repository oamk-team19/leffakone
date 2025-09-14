import { useCallback, useEffect, useState } from 'react'
import React from 'react'
import { Button, MenuItem, Select, FormControl, InputLabel,
  Box, Typography, List, ListItem, ListItemText, Divider
 } from '@mui/material'
 import './index.css'

export const Showtime = () => {
  const [areas, setAreas] = useState([])
  const [times, setTimes] = useState([])
  const [movies, setMovies] = useState([])
  const [days, setDays] = useState([])
  const [message, setMessage] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMovie, setSelectedMovie] = useState('all')

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
    return xmlToJson(xmlDoc)
  }, [xmlToJson])

  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
      .then(response => response.text())
      .then(xml => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml)
        console.log(json.TheatreAreas.TheatreArea)
        setAreas(json.TheatreAreas.TheatreArea)
      })
      .catch(error => {
        console.log(error)
      })
  }, [parseXML])



  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/ScheduleDates/')
      .then(response => response.text())
      .then(xml => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml)
        console.log(json.Dates.dateTime)
        setDays(json.Dates.dateTime)
      })
      .catch(error => {
        console.log(error)
      })
  }, [parseXML])

  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/Events/')
      .then(response => response.text())
      .then(xml => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml)
        console.log(json.Events.Event)
        setMovies(json.Events.Event)
      })
      .catch(error => {
        console.log(error)
      })
  }, [parseXML])

  const showTimes = () => {
    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&dt=${selectedDay}&eventID=${selectedMovie}`)
      .then(response => response.text())
      .then(xml => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml)
        const shows = json.Schedule.Shows.Show
        //console.log(json.Schedule.Shows.Show)

        const now = new Date()
        let filteredShows = []


        if (Array.isArray(shows)) {
          filteredShows = shows.filter(show => new Date(show.dttmShowStart) > now)
        } else if (shows && new Date(shows.dttmShowStart) > now) {
          filteredShows = [shows]
        }

        if (filteredShows.length === 0) {
          setMessage('Ei löytynyt yhtään tulevaa näytöstä valituilla kriteereillä')
        } else {
          setMessage('')
        }

        setTimes(filteredShows)



      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleSelect1 = (event) => {
    setSelectedArea(event.target.value)
  }
  const handleSelectDay = (event) => {
    setSelectedDay(event.target.value)
  }

  
const handleSelectMovie = (event) => {
  setSelectedMovie(event.target.value)
}


  return (
    <>
      <Box sx={{

        minHeight: '100vh',
        /* backgroundColor: '#333', */
        border: 'none',
        outline: 'none',
        boxShadow: 'none'
      }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          minHeight="30vh"
        >
          <Typography variant="h4">Etsi näytösaikoja</Typography>
        </Box >
        <FormControl sx={{ width: 200 }} size='small'>
          <InputLabel id="area-select-label">Valitse Alue/Teatteri</InputLabel>
          <Select
            labelId="area-select-label"
            id="area-select"
            value={selectedArea}
            label="Valitse alue/teatteri"
            onChange={handleSelect1}
          >
            {areas.map((area) => (
              <MenuItem key={area.ID} value={area.ID} sx={{
                backgroundColor: '#333',
                '&.Mui-selected': {
                  backgroundColor: '#333',
                }
              }}>
                {area.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 200 }} size='small'>
          <InputLabel id="day-select-label">Valitse päivä</InputLabel>
          <Select
            labelId="day-select-label"
            id="day-select"
            value={selectedDay}
            label="Valitse päivä"
            onChange={handleSelectDay}
          >
            {days.map((date, index) => {
              const dayObj = new Date(date)
              const day = String(dayObj.getDate()).padStart(2, '0')
              const month = String(dayObj.getMonth() + 1).padStart(2, '0')
              const year = dayObj.getFullYear()
              const formattedDate = `${day}.${month}.${year}`

              return (
                <MenuItem key={index} value={formattedDate}>
                  {dayObj.toLocaleDateString('fi-FI')}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 200 }} size='small'>
          <InputLabel id="movie-select-label">Valitse elokuva</InputLabel>
          <Select
            labelId="movie-select-label"
            id="movie-select"
            value={selectedMovie}
            label="Valitse elokuva"
            onChange={handleSelectMovie}
          >
            <MenuItem value="all">Kaikki elokuvat</MenuItem>
            {movies.map((movie) => (
              <MenuItem key={movie.ID} value={movie.ID}>
                {movie.Title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <p>{selectedArea}+{selectedDay}+{selectedMovie}</p> */}
        <Button variant="contained" size='large' onClick={showTimes}>
          Näytä elokuvat
        </Button>
        <Box>
          {message && (
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}

          <List>
            {times.map((show) => (
              <React.Fragment key={show.ID}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={show.Title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {new Date(show.dttmShowStart).toLocaleTimeString('fi-FI', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        <br />
                        {show.Theatre}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </>
  )
};
