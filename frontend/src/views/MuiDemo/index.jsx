import * as React from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import { DemoComponent } from './DemoComponent';

const cards = [
  {
    title: 'Card 1', // Title of the card
    subtext: 'This is the first card', // Subtext of the card
    icon: <AccountBalanceWalletIcon />, // Icon component for the card
  },
  {
    title: 'Card 2',
    subtext: 'This is the second card',
    icon: '', // no icon for this card
  },
  {
    title: 'Card 3',
    subtext: 'This is the third card',
    icon: <RocketLaunch />, // another icon for this card
  },
];

export const MuiDemo = () => {
  const [number, setNumber] = React.useState(0);
  return (
    <>
      <Typography variant="h4">
        Mui demo page - Here be a number: {number}
      </Typography>

      {[0, 1, 2, 3].map((value) => (
        // mapping is cool and useful. Remember that when displaying many similar objects.
        <Button
          // you can use any icon here. Start icon is MUI icon, end Icon is emoji
          // Note how Icon fits to different colors
          startIcon={<AccountBalanceWalletIcon />}
          endIcon={<span>🚀</span>}
          key={value}
          // Change the variant based on the value
          variant={value % 2 ? 'contained' : 'outlined'}
          color={value >= 2 ? 'error' : 'primary'}
          style={{ margin: '8px' }}
        >
          Button {value}
        </Button>
      ))}
      <Box>
        <Typography>Sizes</Typography>

        <Button
          sx={{ margin: '8px' }}
          /* Note different way of stlings */ variant="outlined"
          size="small"
        >
          small
        </Button>
        <Button variant="outlined" size="medium">
          Medium
        </Button>
        <Button variant="outlined" size="large">
          LARGE
        </Button>
      </Box>
      <Typography variant="h5" style={{ marginTop: '16px' }}>
        Custom component demo
      </Typography>
      {/*
      Here we use our custom component. We pass parameters to it.
      Note how we pass icon as a component, not as a string.
      */}
      <DemoComponent
        title={'big Title'}
        subtext={'small subtext. Action 2 button increases the number!'}
        icon={<AccountBalanceWalletIcon />}
        clickHandler={() => setNumber(number + 1)}
      />
      <Typography variant="h6" style={{ marginTop: '16px' }}>
        Multiple demo components
      </Typography>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {cards.map((card, index) => (
          <Box key={index} sx={{ margin: '8px' }}>
            <DemoComponent
              {
                ...card
                /* NOTE: spreading like this only works if names of object match to those in component props */
                /* title={card.title} subtext={card.subtext} .... Otherwise use like this*/
              }
              clickHandler={() => setNumber(number + 1)}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};
