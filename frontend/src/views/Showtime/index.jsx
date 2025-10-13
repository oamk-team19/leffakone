import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';

import ShowtimeList from '../../components/ShowtimeList';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import GroupSelectModal from '../../components/GroupSelectModal';
import { useUser } from '../../context/useUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Showtime = () => {
  const [areas, setAreas] = useState([]);
  const [times, setTimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [days, setDays] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('all');
  const [open, setOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const { user } = useUser();
  const [myGroups, setMyGroups] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = !!user?.token;
  const tooltipText = isLoggedIn
    ? myGroups.length > 0
      ? 'Add to group'
      : 'Join group'
    : 'Login to add group';
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const xmlToJson = useCallback((node) => {
    const json = {};

    let children = [...node.children];
    //console.log(node.nodeName)
    //console.log(node.innerHTML)

    if (!children.length) return node.innerHTML;

    for (let child of children) {
      const hasSiblings =
        children.filter((c) => c.nodeName === child.nodeName).length > 1;

      if (hasSiblings) {
        if (json[child.nodeName] === undefined) {
          json[child.nodeName] = [xmlToJson(child)];
        } else {
          json[child.nodeName].push(xmlToJson(child));
        }
      } else {
        json[child.nodeName] = xmlToJson(child);
      }
    }
    return json;
  }, []);

  const parseXML = useCallback(
    (xml) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'application/xml');
      return xmlToJson(xmlDoc);
    },
    [xmlToJson]
  );

  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
      .then((response) => response.text())
      .then((xml) => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml);
        console.log(json.TheatreAreas.TheatreArea);
        setAreas(json.TheatreAreas.TheatreArea);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [parseXML]);

  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/ScheduleDates/')
      .then((response) => response.text())
      .then((xml) => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml);
        console.log(json.Dates.dateTime);
        setDays(json.Dates.dateTime);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [parseXML]);

  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/Events/')
      .then((response) => response.text())
      .then((xml) => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml);
        console.log(json.Events.Event);
        setMovies(json.Events.Event);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [parseXML]);

  const showTimes = () => {
    fetch(
      `https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&dt=${selectedDay}&eventID=${selectedMovie}`
    )
      .then((response) => response.text())
      .then((xml) => {
        //console.log(xml)
        //getFinnnkinoTheaters(xml)
        const json = parseXML(xml);
        const shows = json.Schedule.Shows.Show;
        //console.log(json.Schedule.Shows.Show)

        const now = new Date();
        let filteredShows = [];

        if (Array.isArray(shows)) {
          filteredShows = shows.filter(
            (show) => new Date(show.dttmShowStart) > now
          );
        } else if (shows && new Date(shows.dttmShowStart) > now) {
          filteredShows = [shows];
        }

        if (filteredShows.length === 0) {
          setMessage('No upcoming showtimes found for the selected criteria.');
        } else {
          setMessage('');
        }

        setTimes(filteredShows);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelect1 = (event) => {
    setSelectedArea(event.target.value);
  };
  const handleSelectDay = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleSelectMovie = (event) => {
    setSelectedMovie(event.target.value);
  };

  const handleOpenGroupList = (show) => {
    setSelectedShow(show);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShow(null);
  };

  const actionButton = (show) => (
    <Tooltip title={tooltipText}>
      <IconButton
        aria-label="add-to-group"
        onClick={() => {
          if (!isLoggedIn) {
            navigate('/login');
          } else if (myGroups.length === 0) {
            navigate('/groups');
          } else {
            handleOpenGroupList(show);
          }
        }}
      >
        <FormatListBulletedAddIcon />
      </IconButton>
    </Tooltip>
  );

  const handleSelectGroup = async (group) => {
    const formattedDay = new Date(selectedShow.dttmShowStart)
      .toISOString()
      .split('T')[0];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/showtime/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idEvent: selectedShow.EventID,
            idShow: selectedShow.ID,
            idGroup: group.idgroup,
            day: formattedDay,
          }),
        }
      );
      if (response.status === 409) {
        setSnackbarMessage('This show already added to this group.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        handleClose();
        return;
      }
      if (!response.ok) {
        throw new Error('Showtime saving failed');
      }
      const data = await response.json();
      console.log('Showtime saved:', data);
      setSnackbarMessage(`Show added to "${group.groupname}"`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving showtime:', error);
      setSnackbarMessage('Saving failed. Check connectin or try again');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    handleClose();
  };

  const getMyGroups = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/group/mygroups/${user.id}`
      );
      setMyGroups(res.data);
    } catch (error) {
      console.error('Virhe ryhmien haussa:', error);
      if (error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      getMyGroups();
    } else {
      console.log('user ei vielä saatavilla');
    }
  }, [user]);

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          minHeight="30vh"
          gap={8}
        >
          <Typography variant="h4">Search showtimes</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <FormControl sx={{ width: 200, mb: 2, mr: 1 }} size="small">
            <InputLabel id="area-select-label">Select Area/Theater</InputLabel>
            <Select
              labelId="area-select-label"
              id="area-select"
              value={selectedArea}
              label="Select Area/Theater"
              onChange={handleSelect1}
            >
              {areas.map((area, index) => (
                <MenuItem key={area.ID} value={area.ID}>
                  {index === 0 ? 'All areas/theaters' : area.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 200, mb: 2, mr: 1 }} size="small">
            <InputLabel id="day-select-label">Select day</InputLabel>
            <Select
              labelId="day-select-label"
              id="day-select"
              value={selectedDay}
              label="Select day"
              onChange={handleSelectDay}
            >
              {days.map((date, index) => {
                const dayObj = new Date(date);
                const day = String(dayObj.getDate()).padStart(2, '0');
                const month = String(dayObj.getMonth() + 1).padStart(2, '0');
                const year = dayObj.getFullYear();
                const formattedDate = `${day}.${month}.${year}`;

                return (
                  <MenuItem key={index} value={formattedDate}>
                    {dayObj.toLocaleDateString('fi-FI')}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 200, mb: 2, mr: 1 }} size="small">
            <InputLabel id="movie-select-label">Select movie</InputLabel>
            <Select
              labelId="movie-select-label"
              id="movie-select"
              value={selectedMovie}
              label="Valitse elokuva"
              onChange={handleSelectMovie}
            >
              <MenuItem value="all">All movies</MenuItem>
              {movies.map((movie) => (
                <MenuItem key={movie.ID} value={movie.ID}>
                  {movie.Title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={showTimes}
              sx={{ width: 200, height: 40 }}
            >
              Show showtimes
            </Button>
          </Box>
        </Box>
        <Box>
          {message && (
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}
          <ShowtimeList
            times={times}
            actionButton={actionButton}
            hideIcon={false}
          />
          <GroupSelectModal
            open={open}
            onClose={handleClose}
            groups={myGroups}
            onSelectGroup={handleSelectGroup}
          />
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};
