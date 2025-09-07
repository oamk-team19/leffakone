import * as React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

export const DemoComponent = ({ title, subtext, icon = '', clickHandler }) => {
  return (
    <>
      <Card sx={{ maxWidth: 350 }} variant="outlined">
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subtext}
          </Typography>
        </CardContent>

        <CardActions>
          <Button size="small">Action 1</Button>
          <Button startIcon={icon} size="small" onClick={clickHandler}>
            Action 2
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
