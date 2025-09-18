// Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom

const tabs = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'Showtime',
    url: '/showtime',
  },
  {
    title: 'Reviews',
    url: '/reviews',
  },
  {
    title: 'Groups',
    url: '/groups',
  },
];

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        {tabs.map((tab) => (
          <Button
            key={tab.title}
            component={NavLink} // Render Button as a NavLink
            to={tab.url} // Pass the URL to NavLink
            color="inherit"
            // Optional: Style for active link
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: 'none', // Remove default underline
              color: isActive ? 'yellow' : 'inherit', // Highlight active tab
            })}
          >
            {tab.title}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
