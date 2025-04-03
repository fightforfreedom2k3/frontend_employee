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
  const [date, setDate] = useState<string | null>(null); // Sử dụng string cho ngày
  const [items, setItems] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [itemInput, setItemInput] = useState<string>('');

  const handleAddItem = () => {
    if (itemInput.trim() !== '') {
      setItems([...items, itemInput.trim()]);
      setItemInput('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  const handleSubmit = () => {
    console.log(date);
  };

  return (
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
              shrink: true, // Đảm bảo label không bị chồng lên giá trị
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
  );
}
