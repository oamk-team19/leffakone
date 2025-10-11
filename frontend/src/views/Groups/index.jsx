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
  Paper,
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
  const [requestAlreadySent, setRequestSent] = useState([]);
  const navigate = useNavigate();

  //For pagination
  const groupsPerPage = 5;
  const [page, setPages] = useState(1);
  const [myGroupsPage, setMyGroupsPage] = useState(1);
  const groupsPerPageMyGroups = 5;

  const startPage = (page - 1) * groupsPerPage;
  const endPage = startPage + groupsPerPage;
  const currentPages = groups.slice(startPage, endPage);
  const startMyGroupsIndex = (myGroupsPage - 1) * groupsPerPageMyGroups;
  const endMyGroupsIndex = startMyGroupsIndex + groupsPerPageMyGroups;
  const currentMyGroups = myGroups.slice(startMyGroupsIndex, endMyGroupsIndex);

  const handlePages = (event, value) => {
    setPages(value);
  };
  const handleMyGroupsPageChange = (event, value) => {
    setMyGroupsPage(value);
  };

  function toggle() {
    setCreateGroup((createGroup) => !createGroup);
  }

  const getGroups = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/group/groups`
      );
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
        `${import.meta.env.VITE_API_URL}/group/mygroups/${user.user.id}`
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

  const getPendingGroupRequests = async () => {
    try {
      //Get all pending requests
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/group/requests/pending/${user.user.id}`
      );
      setRequestSent(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    if (user.user.id) {
      setIsLoggedIn(true);
      getMyGroups();
      getPendingGroupRequests();
      console.log(myGroups);
    } else {
      console.log('User id not available');
    }
  }, [user.user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/group/create`,
        {
          groupName: groupName,
          idUser: user.user.id,
        }
      );
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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/group/request`,
        {
          groupName: groupname,
          idUser: user.user.id,
        }
      );
      console.log(res);
      alert('Request sent!');
      getPendingGroupRequests();
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  };

  const handleCancelRequest = async (idGroup) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/group/requests/delete/${user.user.id}/${idGroup}`
      );
      console.log(res);
      getPendingGroupRequests();
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

      <Box
        sx={{ p: 4 }}
        align="center"
        display={'flex'}
        flexDirection={'column-reverse'}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h5"
              sx={{ paddingY: 2, textAlign: { xs: 'center', md: 'left' } }}
            >
              All groups
            </Typography>
            <List>
              {currentPages.map((group, id) => (
                <Paper
                  key={id}
                  elevation={2}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      id % 2 === 1 ? 'rgba(0,0,0,0.1)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(225, 185, 197, 0.1)' },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        {group.groupname}
                      </Typography>
                    }
                  />
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
                    ) : requestAlreadySent.some(
                        (r) => r.group_idgroup === group.idgroup
                      ) ? (
                      <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleCancelRequest(group.idgroup)}
                      >
                        Cancel request
                      </Button>
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
                </Paper>
              ))}
            </List>
            <Box display="flex" justifyContent="center">
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(groups.length / groupsPerPage)}
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
            <Typography
              variant="h5"
              sx={{ paddingY: 2, textAlign: { xs: 'center', md: 'left' } }}
            >
              My Groups
            </Typography>
            {isLoggedIn ? (
              <List>
                {myGroups.length > 0 ? (
                  currentMyGroups.map((group, id) => (
                    <Paper
                      key={id}
                      elevation={2}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor:
                          id % 2 === 1 ? 'rgba(0,0,0,0.05)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(225, 185, 197, 0.1)',
                        },
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                      onClick={() => navigate(`/group/${group.idgroup}`)}
                    >
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="text.primary"
                              sx={{ fontSize: '1rem' }} // Slightly smaller heading
                            >
                              {group.groupname}
                            </Typography>
                          }
                        />
                        <ArrowForwardIosIcon fontSize="small" />
                      </ListItem>
                    </Paper>
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
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(myGroups.length / groupsPerPageMyGroups)}
                page={myGroupsPage}
                onChange={handleMyGroupsPageChange}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
