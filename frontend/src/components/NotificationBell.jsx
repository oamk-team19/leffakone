import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import ButtonIcon from '@mui/material/IconButton';

export function NotificationsBell() {
  return (
    <ButtonIcon onClick={() => alert('Tätä nappia ei ole vielä toteutettu')}>
      <Badge color="error" badgeContent={4}>
        {' '}
        <NotificationsIcon />
      </Badge>
    </ButtonIcon>
  );
}
