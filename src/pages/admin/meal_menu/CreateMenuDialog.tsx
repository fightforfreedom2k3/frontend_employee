import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { mealService } from '../../../services/meal';

interface CreateMealMenuDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMealMenuDialog({
  open,
  onClose,
}: CreateMealMenuDialogProps) {
  const [date, setDate] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [itemInput, setItemInput] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAddItem = () => {
    if (itemInput.trim() !== '') {
      setItems(prevItems => [...prevItems, itemInput.trim()]);
      setItemInput('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  const handleSubmit = async () => {
    console.log(items);
    try {
      await mealService.createMenu(date, items, price);
      setSnackbar({
        open: true,
        message: 'Tạo thực đơn thành công!',
        severity: 'success',
      });
      onClose(); // Đóng dialog sau khi thành công
      setDate(null);
      setPrice(0);
      setItemInput('');
      setItems([]);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi tạo thực đơn. Vui lòng thử lại!',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Tạo thực đơn</DialogTitle>
        <DialogContent
          sx={{
            mt: 2,
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Date Input */}
            <TextField
              label={<Typography sx={{ mt: '6px' }}>Chọn ngày</Typography>}
              type="date"
              value={date || ''}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              fullWidth
            />
            {/* Price Input */}
            <TextField
              label="Giá"
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              fullWidth
            />
            {/* Items Input */}
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                label="Thêm món ăn"
                value={itemInput}
                onChange={e => setItemInput(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddItem}>
                Thêm
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {items.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleRemoveItem(item)}
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
