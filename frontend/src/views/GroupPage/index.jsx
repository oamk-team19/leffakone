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
import FavoriteList from '../../components/FavoriteList';

export const GroupPage = () => {
  const user = useUser();
  const [isCreator, setIsCreator] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const { idGroup } = useParams();
  const responseMovieArray = [];
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/group/searchfavorite/${idGroup}`
        );
        console.log(response);
        //Show favorite list
        if (!response.data.error) {
          //Edit data to array
          for (let index = 0; index < response.data.length; index++) {
            responseMovieArray.push(response.data[index].movie_idMovie);
          }
          setSearchResults(responseMovieArray);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.log('Error in getting a favorite list: ' + error);
        setSearchResults([]); // Default movies if error
      }
    };

    searchFavorites();
  }, []);

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
            {searchResults && searchResults.length > 0 ? (
              <FavoriteList favoriteMovies={searchResults} />
            ) : (
              <Typography>No favorite movies yet!</Typography>
            )}
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Shared showtimes
            </Typography>
            <Typography variant="body" sx={{ my: 2 }}>
              No showtimes shared yet
            </Typography>
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
