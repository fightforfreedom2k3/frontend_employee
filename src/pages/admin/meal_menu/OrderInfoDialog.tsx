import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { OrderInfo } from '../../../types/meal';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

interface OrderInfoDialogProps {
  open: boolean;
  onClose: () => void;
  orderInfo: OrderInfo[];
  date: string;
}

const OrderInfoDialog: React.FC<OrderInfoDialogProps> = ({
  open,
  onClose,
  orderInfo,
  date,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{`Danh sách đặt cơm trưa ngày ${convertToVietnamDate(
        date
      )}`}</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Phòng ban</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Số lượng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderInfo.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>{info.fullName}</TableCell>
                  <TableCell>{info.department}</TableCell>
                  <TableCell>{info.email}</TableCell>
                  <TableCell>{info.phoneNumber}</TableCell>
                  <TableCell>{info.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          style={{ marginTop: '16px' }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OrderInfoDialog;
