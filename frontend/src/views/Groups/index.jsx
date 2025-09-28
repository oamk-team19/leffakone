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
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/useUser';

export const Groups = () => {
  const user = useUser();
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/group/groups`);
        console.log(res);
        setGroups(res.data);
      } catch (error) {
        if (error.response.status === 409) {
          alert(error.response.data.error);
        } else {
          console.error(error);
        }
      }
    };
    getGroups();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ paddingY: 2 }} align="center">
        Groups
      </Typography>
    </Box>
  );
};
