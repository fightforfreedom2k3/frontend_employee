import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CreateMealMenuDialog from './CreateMenuDialog';
import OrderInfoDialog from './OrderInfoDialog';
import { AppDispatch, RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderList } from '../../../store/mealSlice';
import { convertDate, convertToVietnamDate } from '../../../lib/formatDateTime';
import { OrderInfo } from '../../../types/meal';

interface MealMenuListProps {
  meals: {
    day: string;
    date: string;
    order: {
      info: OrderInfo[];
    };
  }[];
}

const MealMenuList: React.FC<MealMenuListProps> = () => {
  // for order list
  const { orders } = useSelector((state: RootState) => state.meal);
  const dispatch = useDispatch<AppDispatch>();

  //Tạo thực đơn theo ngày
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedOrderInfo, setSelectedOrderInfo] = useState<
    OrderInfo[] | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setSelectedOrderInfo(null);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setSelectedOrderInfo(null);
  };

  const handleRowClick = (orderInfo: OrderInfo[], date: string) => {
    setSelectedOrderInfo(orderInfo);
    setDialogOpen(true);
    setSelectedDate(date);
  };

  //get order list
  useEffect(() => {
    const today = new Date();
    const date = convertDate(today);
    dispatch(getOrderList(date));
  }, [dispatch]);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid container mt={2} spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid item xs={12} sm={8} md={6}></Grid>
          <Grid item xs={12} sm={4} md={6} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenCreateDialog}
            >
              Tạo thực đơn
            </Button>
          </Grid>
        </Grid>
        {/* Meal Menu List */}
        <Box
          maxHeight={'65vh'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'auto',
            maxHeight: '62vh',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              overflowX: 'auto',
              width: '100%',
              maxWidth: '1200px',
              border: '1px solid #e0e0e0', // Thêm border cho TableContainer
            }}
          >
            <Table
              sx={{
                borderCollapse: 'collapse', // Đảm bảo các border không bị chồng chéo
                '& td, & th': {
                  border: '1px solid #e0e0e0', // Thêm border cho các ô trong bảng
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Thứ</b>
                  </TableCell>
                  <TableCell>
                    <b>Ngày</b>
                  </TableCell>
                  <TableCell>
                    <b>Số đơn</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders!.map((order, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(order.order.info, order.date)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    <TableCell>{order.day}</TableCell>
                    <TableCell>{convertToVietnamDate(order.date)}</TableCell>
                    <TableCell>{order.order.info.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
      {selectedOrderInfo && (
        <OrderInfoDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          orderInfo={selectedOrderInfo}
          date={selectedDate}
        />
      )}
      <CreateMealMenuDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </>
  );
};

export default MealMenuList;
