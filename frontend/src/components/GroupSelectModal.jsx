import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';

const GroupSelectModal = ({ open, onClose, groups, onSelectGroup }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Choose group</DialogTitle>
    <DialogContent sx={{
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <List>
        {groups.map((group) => (
          <ListItem key={group.idgroup} disablePadding>
            <ListItemButton onClick={() => onSelectGroup(group)}>
              <ListItemText primary={group.groupname} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);
export default GroupSelectModal;