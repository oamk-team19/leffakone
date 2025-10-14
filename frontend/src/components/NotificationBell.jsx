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
  const [notificationArray, setNotificationArray] = useState([]);
  const [pendingsArray, setPendingsArray] = useState([]);
  const [lengthOfNotificationArray, setLengthOfNotificationArray] = useState(0);
  const [lengthOfPendingsArray, setLengthOfPendingsArray] = useState(0);

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
      if (lengthOfNotificationArray > 0) {
        setLengthOfNotificationArray(lengthOfNotificationArray - 1);
      }

      const removedNotification = notificationArray.filter(
        (_, i) => i !== index
      );
      setNotificationArray(removedNotification);
    } else if (array === 'pending') {
      if (lengthOfPendingsArray > 0) {
        setLengthOfPendingsArray(lengthOfPendingsArray - 1);
      }

      //pendingsArray.splice(index, 1);

      const removedPending = pendingsArray.filter((_, i) => i !== index);
      setPendingsArray(removedPending);
    }
  };

  useEffect(() => {
    if (!user.id) {
      //Remove data when no users id
      setLengthOfNotificationArray(0);
      setLengthOfPendingsArray(0);
      setNotificationArray([]);
      setPendingsArray([]);
      return;
    }

    const getAllRequests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/group/searchAllRequests`,
          { params: { idUser: user.id } }
        );

        //console.log(response.data);

        if (response.data.length > 0) {
          setNotificationArray(response.data);
        } else {
          setNotificationArray([]);
        }

        //Check is array empty
        if (response.data.length > 0) {
          setLengthOfNotificationArray(response.data.length);
        } else {
          setLengthOfNotificationArray(0);
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
        console.log(response.data);
        if (response.data.length > 0) {
          setPendingsArray(response.data);
        } else {
          setPendingsArray([]);
        }

        //Check is array empty
        if (response.data.length > 0) {
          setLengthOfPendingsArray(response.data.length);
        } else {
          setLengthOfPendingsArray(0);
        }
        return pendingsArray;
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
    //Close notification bell if empty
    if (notificationArray.length === 0 && pendingsArray.length === 0 && open) {
      handleClose();
    }
  }, [notificationArray, pendingsArray]);

  return (
    <>
      <ButtonIcon onClick={handleClick}>
        <Badge
          color="error"
          badgeContent={lengthOfNotificationArray + lengthOfPendingsArray}
        >
          <NotificationsIcon />
        </Badge>
      </ButtonIcon>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {[...notificationArray, ...pendingsArray].length > 0 ? (
          [...notificationArray, ...pendingsArray].map(
            (notification, index) => {
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
                    <Typography
                      sx={{ whiteSpace: 'normal', fontSize: '0.9rem' }}
                    >
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
                    <Typography
                      sx={{ whiteSpace: 'normal', fontSize: '0.9rem' }}
                    >
                      {'You have not been accepted to ' +
                        notification.groupname}
                    </Typography>
                  </MenuItem>
                );
              } else if (notification.username && notification.groupname) {
                return (
                  <MenuItem>
                    <Typography
                      sx={{ whiteSpace: 'normal', fontSize: '0.9rem' }}
                    >
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
            }
          )
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
