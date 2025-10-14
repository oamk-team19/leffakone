// Header.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Container,
  Box,
  MenuItem,
  Menu,
  Tooltip,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TheatersIcon from '@mui/icons-material/Theaters';
import { NavLink } from 'react-router-dom';
import { ThemeToggleButton } from './ThemeSelector';
import { NotificationsBell } from './NotificationBell';
import { useUser } from '../context/useUser';
import axios from 'axios';

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
    title: 'Groups',
    url: '/groups',
  },
];

const Header = () => {
  const { user, LogOut } = useUser();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TheatersIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/" // TODO: Check if this should be changed to NavLink
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MovieMachine
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {tabs.map((page) => (
                <MenuItem
                  key={page.title}
                  component={NavLink}
                  to={page.url}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: 'center' }}>
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
            <TheatersIcon
              fontSize={'large'}
              color="secondary"
              sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, mt: 0.5 }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {tabs.map((tab) => (
              <Button
                key={tab.title}
                onClick={handleCloseNavMenu}
                component={NavLink}
                to={tab.url}
                sx={{ my: 2, color: 'white', display: 'block' }}
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : 'normal',
                })}
              >
                {tab.title}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              direction: 'row',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ThemeToggleButton></ThemeToggleButton>
            {user.id && <NotificationsBell />}
            {user.id ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    component={NavLink}
                    to="/login"
                    onClick={handleCloseUserMenu}
                  >
                    <NavLink
                      to="/profile"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      Profile
                    </NavLink>
                  </MenuItem>
                  <MenuItem component={NavLink} to="/signout">
                    <NavLink
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      onClick={async () => {
                        try {
                          await axios.post(
                            `${import.meta.env.VITE_API_URL}/auth/signout`,
                            {},
                            { withCredentials: true }
                          );
                          LogOut();
                          navigate('/login');
                        } catch (error) {
                          console.log('Error while signing out: ', error);
                          return;
                        }
                      }}
                    >
                      Logout
                    </NavLink>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="secondary" variant="outlined">
                <NavLink
                  to="/login"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Login
                </NavLink>
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
