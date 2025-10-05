import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import ButtonIcon from '@mui/material/IconButton';
import { Menu, MenuItem, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/useUser'; //get id
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

export function NotificationsBell() {
  const { user } = useUser();
  const [pendingStatus, setpendingStatus] = useState(0);
  const [pendingsArray, setPendingsArray] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Trial for notification bell
  useEffect(() => {
    const getSearchPendingRequests = async () => {
      try {
        //Get all pending requests
        const response = await axios.post(
          'http://localhost:3001/group/searchPending',
          { idUser: user.id }
        );

        //console.log(response.data);
        //console.log(response.data[0].username);
        //console.log(response.data[1].groupname);
        setPendingsArray(response.data);

        //console.log(pendingsArray);

        //Huomioi aika
        if (pendingStatus < response.data.length) {
          //console.log('New pending request');
          setpendingStatus(response.data.length);
          //näytä uusi pyyntö
        }
      } catch (error) {
        console.log(error);
      }
    };

    const data = getSearchPendingRequests();

    const interval = setInterval(getSearchPendingRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ButtonIcon onClick={handleClick}>
        <Badge color="error" badgeContent={pendingStatus}>
          <NotificationsIcon />
        </Badge>
      </ButtonIcon>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          tekstiä{' '}
          <ButtonIcon>
            <CheckIcon />
          </ButtonIcon>
          <ButtonIcon>
            <NotInterestedIcon />
          </ButtonIcon>
        </MenuItem>
      </Menu>
    </>
  );
}
