import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    // Xử lý logic đổi mật khẩu ở đây
    console.log({
      currentPassword,
      newPassword,
      logoutOtherDevices,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Đổi mật khẩu
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Mật khẩu của bạn phải có tối thiểu 6 ký tự, đồng thời bao gồm cả chữ
          số, chữ cái và ký tự đặc biệt (!@$%^).
        </Typography>
        <TextField
          label="Mật khẩu hiện tại (Ngày cập nhật: 26/07/2022)"
          type="password"
          fullWidth
          margin="normal"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <TextField
          label="Nhập lại mật khẩu mới"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={logoutOtherDevices}
              onChange={e => setLogoutOtherDevices(e.target.checked)}
            />
          }
          label="Đăng xuất khỏi các thiết bị khác. Hãy chọn mục này nếu người khác từng dùng tài khoản của bạn."
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 16 }}
          onClick={handleSubmit}
        >
          Đổi mật khẩu
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
