import * as React from 'react';
import { Button} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/useUser'; 

export const Profile = () => {
  const { user, setUser } = useUser();

  return (
      <h2>Omasivu</h2>

  );
};
