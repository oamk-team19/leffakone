import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from '../context/useUser';

export const SelectGroup = (props) => {
  const { user } = useUser();
  const { onClose, selectedValue, open } = props;
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getGroups = () => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/group/mygroups/${user.id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${user.token}`,
          },
        })
        .then((response) => {
          setGroups(response.data);
        })
        .catch((error) => {
          console.error('Error fetching groups: ', error);
        });
    };
    getGroups();
  }, []);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/group/favorite/${value.idgroup}`,
        { movieId: props.movieId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${user.token}`,
          },
        }
      )
      .then((response) => {
        console.log('Movie added to group favorites:', response.data);
      })
      .catch((error) => {
        console.error('Error adding movie to group favorites:', error);
      });
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add movie to group</DialogTitle>
      <List sx={{ pt: 0 }}>
        {groups &&
          groups.map((group) => (
            <ListItem disablePadding key={group}>
              <ListItemButton onClick={() => handleListItemClick(group)}>
                <ListItemText primary={group.groupname} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Dialog>
  );
};

export default function AddToGroup({ movieId }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton>
        <FormatListBulletedAddIcon
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ fontSize: 40, cursor: 'pointer' }}
        ></FormatListBulletedAddIcon>
      </IconButton>
      <SelectGroup
        movieId={movieId}
        selectedValue={0}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
