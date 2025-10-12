import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context/useUser';
import ShowtimeCard from '../../components/ShowtimeCard';
import ShowtimeList from '../../components/ShowtimeList';

export const GroupPage = () => {
  const user = useUser();
  const [isCreator, setIsCreator] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const { idGroup } = useParams();
  const [showData, setShowData] = useState([]);
  const [message, setMessage] = useState('');




  /*
  const responseMovieArray = [];

  get-pyyntö /group/searchfavorite',params: { idGroup: 1 },

  tuloksen muokkaus 
  for (let index = 0; index < response.data.length; index++) {
            responseMovieArray.push(response.data[index].movie_idMovie);
          }
          setSearchResults(responseMovieArray);
         
  */

  useEffect(() => {
    const getGroupCreator = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/creator/${idGroup}`
        );
        if (res.data === user.user.id) {
          setIsCreator(true);
        }
      } catch (error) {
        if (error.response.status === 409) {
          alert(error.response.data.error);
        } else {
          console.error(error);
        }
      }
    };
    getGroupCreator();
  }, [user.user.id]);

  useEffect(() => {
    const getGroupName = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/name/${idGroup}`
        );
        setGroupName(res.data);
      } catch (error) {
        if (error.response.status === 409) {
          alert(error.response.data.error);
        } else {
          console.error(error);
        }
      }
    };
    getGroupName();
  }, [idGroup]);

  useEffect(() => {
    const getGroupMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/members/${idGroup}`
        );
        setGroupMembers(res.data);
      } catch (error) {
        if (error.response.status === 409) {
          alert(error.response.data.error);
        } else {
          console.error(error);
        }
      }
    };
    getGroupMembers();
  }, [idGroup]);

  const deleteGroup = async () => {
    const shouldDelete = confirm('Are you sure you want to delete group?');
    if (shouldDelete) {
      try {
        console.log(user.user.id);
        const res = await axios.delete('http://localhost:3001/group/delete', {
          data: { idGroup: idGroup, idUser: user.user.id },
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(res);
        navigate('/');
      } catch (error) {
        console.error('Error deleting group: ' + error);
      }
    }
  };

  const leaveGroup = async () => {
    const shouldLeave = confirm('Are you sure you want to leave group?');
    if (shouldLeave) {
      try {
        console.log(user.user.id);
        const res = await axios.delete(
          'http://localhost:3001/group/leavegroup',
          {
            data: { idGroup: idGroup, idUser: user.user.id },
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log(res);
        navigate('/');
      } catch (error) {
        console.error('Error leaving group: ' + error);
      }
    }
  };

  const parseXML = (xmlString) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, 'text/xml');
  const shows = Array.from(xml.getElementsByTagName('Show')).map(show => ({
    ID: show.getElementsByTagName('ID')[0].textContent,
    Title: show.getElementsByTagName('Title')[0].textContent,
    dttmShowStart: show.getElementsByTagName('dttmShowStart')[0].textContent,
    Theatre: show.getElementsByTagName('Theatre')[0].textContent,
    EventID: show.getElementsByTagName('EventID')[0].textContent,
  }));
  return shows;
};

useEffect(() => {
  const fetchGroupShowtimes = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/showtime`, {
        params: { idGroup: idGroup},
      });
      const savedShowtimes = response.data;
      console.log('Saved showtimes from backend:', savedShowtimes);
      if (savedShowtimes.length === 0) {
        setMessage('No showtimes saved');
        return;
      }
      const showtimeInfo = await Promise.all(
        savedShowtimes.map(async ({ idShow, idEvent, day }) => {
          
          const localDate = new Date(day);
          const dateFi = localDate.toLocaleDateString('fi-FI'); // esim. "8.10.2025"
          const [d, m, y] = dateFi.split('.');
          const formattedDate = `${d.padStart(2, '0')}.${m.padStart(2, '0')}.${y}`;
          const url = `https://www.finnkino.fi/xml/Schedule/?eventID=${idEvent}&dt=${formattedDate}`;
          
          const response = await axios.get(url);
          const shows = parseXML(response.data);

          return shows.find(s => String(s.ID) === String(idShow));
        })
      );

      const validShows = showtimeInfo.filter(Boolean);
      if(validShows.length === 0) {
        setMessage('No upcoming showtimes found')
      }
      const sortedShows = validShows.sort((a, b) => new Date(a.dttmShowStart) - new Date(b.dttmShowStart));
      
      setShowData(sortedShows);
    } catch (error) {
      console.error('Error fetching group showtimes', error);
      setMessage('Error in search');
    }
  };
  fetchGroupShowtimes();
}, []);




  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ paddingY: 2 }} align="center">
        {groupName}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Shared movies
            </Typography>
            <Typography variant="body" sx={{ my: 2 }}>
              No movies shared yet
            </Typography>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography>Shared showtimes</Typography>
            {message && <Typography color="error">{message}</Typography>}
            <ShowtimeList times={showData} hideIcon={true} />
          </Box>
        </Grid>
        <Divider
          size={{ xs: 0, md: 1 }}
          orientation="vertical"
          variant="fullWidth"
          flexItem
        />
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Members</Typography>
            <List>
              {groupMembers.map((member, i) => (
                <ListItem key={i}>
                  <ListItemText primary={member.username} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        {isCreator ? (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={deleteGroup}
          >
            Delete group
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={leaveGroup}
          >
            Leave group
          </Button>
        )}
      </Box>
    </Box>
  );
};
