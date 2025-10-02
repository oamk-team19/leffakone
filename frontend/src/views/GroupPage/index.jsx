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
