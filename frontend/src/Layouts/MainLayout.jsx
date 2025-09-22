// Layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Header from '../components/Header'; // Assuming Header is in '../components/Header'
import Footer from '../components/Footer';
import { Box } from '@mui/material'; // Or any other root element you use

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />{' '}
      {/* Your header, which uses NavLink, is now within the router's context */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />{' '}
        {/* This is where your route-specific components (MainPage, Register, etc.) will render */}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
