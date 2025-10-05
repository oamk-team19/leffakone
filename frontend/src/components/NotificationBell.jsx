import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import ButtonIcon from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/useUser'; //get id

export function NotificationsBell() {
  const [pendingStatus, setpendingStatus] = useState(0);

  //Trial for notification bell
  useEffect(() => {
    const getSearchPendingRequests = async () => {
      try {
        //Get all pending requests
        const response = await axios.get(
          'http://localhost:3001/group/searchPending'
        );

        console.log(response)
        //console.log(response.data[0].username);
        //console.log(response.data[1].groupname);

        //Huomioi aika
        if (pendingStatus < data.length) {
          console.log('New pending request');
          setpendingStatus(data.length);
          //näytä uusi pyyntö
        }
        //console.log(response.data);

        //console.log(response.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    const data = getSearchPendingRequests();

    const interval = setInterval(getSearchPendingRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ButtonIcon onClick={() => alert('Tätä nappia ei ole vielä toteutettu')}>
      <Badge color="error" badgeContent={pendingStatus}>
        {' '}
        <NotificationsIcon />
      </Badge>
    </ButtonIcon>
  );
}
