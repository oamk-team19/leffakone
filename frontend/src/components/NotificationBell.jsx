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
    //Muuta trueksi seenrequest
    try {
      const response = await axios.put(
        'http://localhost:3001/group/seenrequest',
        {
          groupName: groupId,
          idUser: user.id,
        }
      );
      console.log(response.status + ' Successfull update in seenrequest');

      //Update number in the icon
      if (lengthOfNotificationArray > 0) {
        setLengthOfNotificationArray(lengthOfNotificationArray - 1);
      }

      notificationArray.slice(index, 1);

      const removedNotification = notificationArray.filter(
        (_, i) => i !== index
      );
      setNotificationArray(removedNotification);
    } catch (error) {
      console.log('Error in updating to true' + error);
    }

    //Sulje menuitem jos se ei poistu muutoksessa
  };

  const handleClickYes = async (username, groupnameR) => {
    try {
      const response = await axios.put('http://localhost:3001/group/approve', {
        groupName: groupnameR,
        idUser: username,
      });
      console.log(response);

      //Update number in the icon
      if (lengthOfPendingsArray > 0) {
        setLengthOfPendingsArray(lengthOfPendingsArray - 1);
      }
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
      //Update number in the icon
      if (lengthOfPendingsArray > 0) {
        setLengthOfPendingsArray(lengthOfPendingsArray - 1);
      }
    } catch (error) {
      console.log('Error in rejecting' + error);
    }
  };

  useEffect(() => {
    if (!user.id) {
      //Remove data when no users id
      setLengthOfNotificationArray(0);
      setLengthOfPendingsArray(0);
      setNotificationArray(0);
      setPendingsArray(0);
      return;
    }

    const getAllRequests = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/group/searchAllRequests',
          { params: { idUser: user.id } }
        );

        console.log(response.data);
        setNotificationArray(response.data);

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
          'http://localhost:3001/group/searchPending',
          { params: { idUser: user.id } }
        );
        console.log(response.data);
        setPendingsArray(response.data);

        //Check is array empty
        if (response.data.length > 0) {
          setLengthOfPendingsArray(response.data.length);
        } else {
          setLengthOfPendingsArray(0);
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
        {notificationArray.length > 0 &&
          notificationArray.map((notification, index) => {
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
                  {'You have been accepted to ' + notification.groupname}
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
                  {'You have not been accepted to ' + notification.groupname}
                </MenuItem>
              );
            }
          })}

        {pendingsArray.length > 0 &&
          pendingsArray.map((notification) => (
            <MenuItem>
              {notification.username +
                ' wants to join to group ' +
                notification.groupname}
              <ButtonIcon
                onClick={() =>
                  handleClickYes(notification.username, notification.groupname)
                }
              >
                <CheckIcon color="success" />
              </ButtonIcon>
              <ButtonIcon
                onClick={() =>
                  handleClickNo(notification.username, notification.groupname)
                }
              >
                <NotInterestedIcon color="error" />
              </ButtonIcon>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}
