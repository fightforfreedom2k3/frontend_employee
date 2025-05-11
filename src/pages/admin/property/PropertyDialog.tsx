import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  getAllPropertyByDepartmentAndStatus,
  returnProperty,
} from '../../../store/propertySlice';
import { departmentService } from '../../../services/department';
import { Department } from '../../../types/departments';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

interface PropertyMaintenanceApprovalDialogProps {
  open: boolean;
  onClose: () => void;
}

const PropertyMaintenanceApprovalDialog: React.FC<
  PropertyMaintenanceApprovalDialogProps
> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, error } = useSelector(
    (state: RootState) => state.property
  );

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [departments, setDepartments] = useState<Department[] | undefined>([]);

  useEffect(() => {
    // Fetch departments
    departmentService
      .getAllDepartment(1, 100, 'createdAt', 'ASC', '')
      .then(response => {
        const departmentList = response.data.data ?? [];
        setDepartments(departmentList);
        if (departmentList.length > 0) {
          setSelectedDepartmentId(departmentList[0]._id); // Set default department
        }
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch properties with status MAINTAINING
    if (selectedDepartmentId) {
      dispatch(
        getAllPropertyByDepartmentAndStatus({
          departmentId: selectedDepartmentId,
          status: 'MAINTAINING',
          page: 1,
          size: 10,
          sort: 'createdAt',
          order: 'DESC',
          value: '',
        })
      );
    }
  }, [dispatch, selectedDepartmentId]);

  const handleReturnProperty = async (propertyId: string) => {
    try {
      await dispatch(returnProperty(propertyId)).unwrap();
      dispatch(
        getAllPropertyByDepartmentAndStatus({
          departmentId: selectedDepartmentId,
          status: 'MAINTAINING',
          page: 1,
          size: 10,
          sort: 'createdAt',
          order: 'DESC',
          value: '',
        })
      );
    } catch (error) {
      console.error('Error returning property:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Lỗi khi tải dữ liệu cơ sở vật chất:{' '}
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      );
    }

    if (!properties || properties.length === 0) {
      return (
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Không có cơ sở vật chất nào cần bảo trì.
        </Typography>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên cơ sở vật chất</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell>Phòng ban</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map(property => (
              <TableRow key={property._id}>
                <TableCell>{property.name}</TableCell>
                <TableCell align="right">{property.number}</TableCell>
                <TableCell>
                  {property.department?.name || 'Không xác định'}
                </TableCell>
                <TableCell>
                  {convertToVietnamDate(property.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleReturnProperty(property._id)}
                  >
                    Return
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Duyệt Tài Sản Bảo Trì</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Select
            fullWidth
            value={selectedDepartmentId}
            onChange={event => setSelectedDepartmentId(event.target.value)}
            displayEmpty
          >
            {departments?.map(department => (
              <MenuItem key={department._id} value={department._id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyMaintenanceApprovalDialog;
