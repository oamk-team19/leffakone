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
  const { user, setUser } = useUser();
  const [notificationStatus, setNotificationStatus] = useState(0);
  const [pendingsArray, setPendingsArray] = useState([]);
  const [approvedArray, setApprovedArray] = useState([]);
  const [rejectedArray, setRejectedArray] = useState([]);

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
    if (!user.id) return;

    const getSearchPendingRequests = async () => {
      try {
        //Get all pending requests
        const response = await axios.get(
          'http://localhost:3001/group/searchPending',
          { params: { idUser: user.id } }
        );
        console.log(response.data);
        setPendingsArray(response.data);

        if (notificationStatus < response.data.length) {
          //Huomioi aika
          //console.log('New pending request');
          
          setNotificationStatus(response.data.length);
          //näytä uusi pyyntö
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getApproved = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/user/searchApproved',
          {
            params: { idUser: user.id },
          }
        );
        console.log(response.data);
        setApprovedArray(response.data);
        notificationStatus = notificationStatus + response.data.length
        setNotificationStatus(response.data.length)
      } catch (error) {
        console.log('Error in getting approved requests: ' + error);
      }
    };

    const getRejected = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/user/searchRejected',
          {
            params: { idUser: user.id },
          }
        );
        setRejectedArray(response.data);
        console.log(response.data);
        setNotificationStatus(response.data.length)
      } catch (error) {
        console.log('Error in getting rejected requests: ' + error);
      }
    };

    getSearchPendingRequests();
    getApproved();
    getRejected();

    const interval = setInterval(getSearchPendingRequests, 15000); //every 15 seconds
    const interval2 = setInterval(getApproved, 15000);
    const interval3 = setInterval(getRejected, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  }, []);

  return (
    <>
      <ButtonIcon onClick={handleClick}>
        <Badge color="error" badgeContent={notificationStatus}>
          <NotificationsIcon />
        </Badge>
      </ButtonIcon>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {pendingsArray.length > 0 &&
          pendingsArray.map((req) => (
            <MenuItem>
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

        {approvedArray.length > 0 &&
          approvedArray.map((req) => (
            <MenuItem>{'You have been accepted to ' + req.groupname}</MenuItem>
          ))}

        {rejectedArray.length > 0 &&
          rejectedArray.map((req) => (
            <MenuItem>
              {'You have not been accepted to ' + req.groupname}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}
