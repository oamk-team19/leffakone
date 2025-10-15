import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import ButtonIcon from '@mui/material/IconButton';
import { Menu, MenuItem, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/useUser';
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

export function NotificationsBell() {
  const { user, setUser } = useUser();
  const [requests, setRequests] = useState([]);
  const [pendings, setPendings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItem = async (groupId, index) => {
    //Change trueksi seenrequest
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/group/seenrequest`,
        {
          groupName: groupId,
          idUser: user.id,
        }
      );
      //console.log(response.status + ' Successfull update in seenrequest');

      updateView('notification', index); //Update number in the icon
    } catch (error) {
      console.log('Error in updating to true' + error);
    }
  };

  const handleClickYesOrNo = async (user_iduser, groupnameR, index, choice) => {
    if (choice === 'yes') {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/group/approve`,
          {
            groupName: groupnameR,
            idUser: user_iduser,
          }
        );
        console.log('Approved successfully ' + response.data);

        updateView('pending', index);
      } catch (error) {
        console.log('Error in approving' + error);
      }
    } else if (choice === 'no') {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/group/reject`,
          {
            groupName: groupnameR,
            idUser: user_iduser,
          }
        );
        console.log('Rejected successfully ' + response.data);
        updateView('pending', index);
      } catch (error) {
        console.log('Error in rejecting' + error);
      }
    } else {
      console.log('Choice not defined');
    }
  };

  const updateView = async (array, index) => {
    //Update number in the icon
    if (array === 'notification') {
      const removedNotification = requests.filter((_, i) => i !== index);
      setRequests(removedNotification);
    } else if (array === 'pending') {
      //pendings.splice(index, 1);
      const removedPending = pendings.filter((_, i) => i !== index);
      setPendings(removedPending);
    }
  };

  useEffect(() => {
    if (!user.id) {
      //Remove data when no users id
      setRequests([]);
      setPendings([]);
      return;
    }

    const getAllRequests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/group/searchAllRequests`,
          { params: { idUser: user.id } }
        );

        //console.log(response);

        if (response.data.length > 0) {
          setRequests(response.data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getSearchPendingRequests = async () => {
      try {
        //Get all pending requests
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/group/searchPending`,
          { params: { idUser: user.id } }
        );
        //console.log(response.data);
        if (response.data.length > 0) {
          setPendings(response.data);
        } else {
          setPendings([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllRequests();
    getSearchPendingRequests();

    const interval = setInterval(getAllRequests, 15000); //every 15 seconds gets data from db
    const interval2 = setInterval(getSearchPendingRequests, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, [user.id]);

  useEffect(() => {
    setNotifications([...requests, ...pendings]);
    //Close notification bell if empty
    if (requests.length === 0 && pendings.length === 0 && open) {
      handleClose();
    }
  }, [requests, pendings]);

  return (
    <>
      <ButtonIcon onClick={handleClick}>
        <Badge color="error" badgeContent={requests.length + pendings.length}>
          <NotificationsIcon />
        </Badge>
      </ButtonIcon>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            if (
              notification.grouprequest === 'approved' &&
              notification.seenrequest === false
            ) {
              return (
                <MenuItem
                  onClick={() =>
                    handleMenuItem(notification.group_idgroup, index)
                  }
                >
                  <Typography sx={{ whiteSpace: 'normal', fontSize: '0.9rem' }}>
                    {'You have been accepted to ' + notification.groupname}
                  </Typography>
                </MenuItem>
              );
            } else if (
              notification.grouprequest === 'rejected' &&
              notification.seenrequest === false
            ) {
              return (
                <MenuItem
                  onClick={() =>
                    handleMenuItem(notification.group_idgroup, index)
                  }
                >
                  {' '}
                  <Typography sx={{ whiteSpace: 'normal', fontSize: '0.9rem' }}>
                    {'You have not been accepted to ' + notification.groupname}
                  </Typography>
                </MenuItem>
              );
            } else if (notification.username && notification.groupname) {
              return (
                <MenuItem>
                  <Typography sx={{ whiteSpace: 'normal', fontSize: '0.9rem' }}>
                    {notification.username +
                      ' wants to join to group ' +
                      notification.groupname}
                  </Typography>{' '}
                  <ButtonIcon
                    onClick={() =>
                      handleClickYesOrNo(
                        notification.user_iduser,
                        notification.groupname,
                        index,
                        'yes'
                      )
                    }
                  >
                    <CheckIcon color="success" />
                  </ButtonIcon>
                  <ButtonIcon
                    onClick={() =>
                      handleClickYesOrNo(
                        notification.user_iduser,
                        notification.groupname,
                        index,
                        'no'
                      )
                    }
                  >
                    <NotInterestedIcon color="error" />
                  </ButtonIcon>
                </MenuItem>
              );
            }
          })
        ) : (
          <MenuItem>
            {' '}
            <Typography sx={{ whiteSpace: 'normal', fontSize: '0.9rem' }}>
              {'No notifications'}
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
