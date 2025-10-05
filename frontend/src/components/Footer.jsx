import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Made with  '}
          <FavoriteIcon
            fontSize="large"
            sx={{ verticalAlign: 'middle', color: 'red' }}
          />{' '}
          <Link color="inherit" href="https://github.com/oamk-team19">
            By Group 19 Productions
          </Link>
          {`, Copyright `}
          <CopyrightIcon
            fontSize="small"
            sx={{ verticalAlign: 'middle', mb: 0.3 }}
          />
          {` ${new Date().getFullYear()}.`}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
