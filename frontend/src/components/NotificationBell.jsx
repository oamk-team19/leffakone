import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import ButtonIcon from '@mui/material/IconButton';
import { Menu, MenuItem, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/useUser';
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

  const handleClickYes = async (username, groupnameR) => {
    try {
      const response = await axios.put('http://localhost:3001/group/approve', {
        groupName: groupnameR,
        idUser: username,
      });
      console.log(response);
    } catch (error) {
      console.log('Error in approving' + error);
    }
  };

  const handleClickNo = async (username, groupnameR) => {
    try {
      const response = await axios.put('http://localhost:3001/group/reject', {
        groupName: groupnameR,
        idUser: username,
      });
      console.log(response);
    } catch (error) {
      console.log('Error in rejecting' + error);
    }
  };

  useEffect(() => {
    const getSearchPendingRequests = async () => {
      try {
        //Get all pending requests
        const response = await axios.post(
          'http://localhost:3001/group/searchPending',
          { idUser: user.id }
        );

        setPendingsArray(response.data);

        if (pendingStatus < response.data.length) {
          //Huomioi aika
          //console.log('New pending request');
          setpendingStatus(response.data.length);
          //näytä uusi pyyntö
        }
      } catch (error) {
        console.log(error);
      }
    };

    getSearchPendingRequests();

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
      {pendingsArray.length > 0 && (
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {pendingsArray.map((req) => (
            <MenuItem >
              {req.username + ' wants to join to group ' + req.groupname}
              <ButtonIcon
                onClick={() => handleClickYes(req.username, req.groupname)}
              >
                <CheckIcon color="success" />
              </ButtonIcon>
              <ButtonIcon
                onClick={() => handleClickNo(req.username, req.groupname)}
              >
                <NotInterestedIcon color="error" />
              </ButtonIcon>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}
