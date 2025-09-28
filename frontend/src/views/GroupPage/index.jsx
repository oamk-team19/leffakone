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

export const GroupPage = () => {
  const user = useUser();
  const [times, setTimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const { idGroup } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getGroupName = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/name/${idGroup}`
        );
        console.log(res);
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
        console.log(res);
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
  };

  useEffect(() => {
    const addedMovies = [];

    if (addedMovies.length === 0) {
      setMessage('No movies shared yet');
    } else {
      setMovies(addedMovies);
    }
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
            <Box>
              {message && (
                <Typography variant="body1" sx={{ mb: 2 }}>
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
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {new Date(show.dttmShowStart).toLocaleTimeString(
                                'fi-FI',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Shared showtimes</Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={deleteGroup}
        >
          Delete group
        </Button>
      </Box>
    </Box>
  );
};
