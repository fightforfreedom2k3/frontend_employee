import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Grid,
  Avatar,
} from '@mui/material';
import { Department } from '../../../types/departments';
import { Person as PersonIcon } from '@mui/icons-material'; // Icon người

export interface DepartmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  department: Department | null;
}

export const DepartmentDetailDialog = (props: DepartmentDetailDialogProps) => {
  const { open, onClose, department } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {/* Tên phòng ban */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              {department?.name}
            </Typography>
          </Grid>

          {/* Thông tin người quản lý */}
          <Grid item xs={12} container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar sx={{ bgcolor: '#1976d2' }}>
                <PersonIcon sx={{ color: 'white' }} />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                Manager: {department?.manager?.fullName}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: '#666' }}>
              <strong>Description:</strong> {department?.description}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
