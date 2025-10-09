import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Stack,
  Pagination,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/useUser';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const Groups = () => {
  const user = useUser();
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [createGroup, setCreateGroup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  //For pagination
  const showtimesPerPage = 10;
  const [page, setPages] = useState(1);

  const startPage = (page - 1) * showtimesPerPage;
  const endPage = startPage + showtimesPerPage;
  const currentPages = groups.slice(startPage, endPage);

  const handlePages = (event, value) => {
    setPages(value);
  };

  function toggle() {
    setCreateGroup((createGroup) => !createGroup);
  }

  const getGroups = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/group/groups`);
      setGroups(res.data);
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  };

  const getMyGroups = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/group/mygroups/${user.user.id}`
      );
      setMyGroups(res.data);
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    if (user.user.id) {
      setIsLoggedIn(true);
      getMyGroups();
      console.log(myGroups);
    } else {
      console.log('User id not available');
    }
  }, [user.user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3001/group/create', {
        groupName: groupName,
        idUser: user.user.id,
      });
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
    await setCreateGroup(false);
    await getGroups();
    await getMyGroups();
  };

  const handleJoinGroup = async (groupname) => {
    try {
      const res = await axios.post('http://localhost:3001/group/request', {
        groupName: groupname,
        idUser: user.user.id,
      });
      console.log(res);
      alert('Request sent!');
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }} align="center">
      <Typography variant="h4" sx={{ paddingY: 2 }} align="center">
        Groups
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
        >
          {isLoggedIn ? (
            <>
              <Button variant="contained" sx={{ marginY: 2 }} onClick={toggle}>
                Create a new group
              </Button>
              {createGroup && (
                <>
                  <TextField
                    label="Group name"
                    variant="outlined"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    gap={2}
                  >
                    <Button variant="contained" onClick={toggle}>
                      Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                      Submit
                    </Button>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Button variant="contained" sx={{ marginY: 2 }} disabled>
              Log in to create a group
            </Button>
          )}
        </Box>
      </form>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5" sx={{ paddingY: 2 }} align="left">
            All groups
          </Typography>
          <List>
            {currentPages.map((group, id) => (
              <ListItem key={id}>
                <ListItemText primary={group.groupname} />
                {isLoggedIn ? (
                  myGroups.some((g) => g.groupname === group.groupname) ? (
                    <>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForwardIosIcon />}
                        onClick={() => navigate(`/group/${group.idgroup}`)}
                      >
                        Already a member
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleJoinGroup(group.groupname)}
                    >
                      Send request
                    </Button>
                  )
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    disabled
                  >
                    Send request
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
          <Box display="flex" justifyContent="center">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(groups.length / 10)}
                page={page}
                onChange={handlePages}
              ></Pagination>
            </Stack>
          </Box>
        </Grid>
        <Divider
          size={{ xs: 0, md: 1 }}
          orientation="vertical"
          variant="middle"
          flexItem
        />
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="h5" sx={{ margin: 4 }} align="left">
            My Groups
          </Typography>
          {isLoggedIn ? (
            <List>
              {myGroups.length > 0 ? (
                myGroups.map((group, id) => (
                  <ListItem key={id}>
                    <Link to={`/group/${group.idgroup}`}>
                      <ListItemText primary={group.groupname} />
                    </Link>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" align="left">
                  You have not joined any groups yet.
                </Typography>
              )}
            </List>
          ) : (
            <Typography variant="h6" align="left">
              Log in to start joining groups
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
