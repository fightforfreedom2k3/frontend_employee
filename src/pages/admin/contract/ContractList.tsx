import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useEffect, useState } from 'react';
import { getAllContract } from '../../../store/contractSlice';
import {
  Box,
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
import { convertToVietnamTime } from '../../../lib/formatDateTime';

export default function ContractList() {
  const dispatch = useDispatch<AppDispatch>();
  const { contracts, contract, loading, error } = useSelector(
    (state: RootState) => state.contract
  );

  //state for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //Initialize data
  useEffect(() => {
    dispatch(
      getAllContract({
        page: page + 1,
        size: rowsPerPage,
        sort: 'createdAt',
        order: 'ASC',
      })
    );
  }, [dispatch, page, rowsPerPage]);

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* maybe add search or sth */}
      <Grid container mt={2} spacing={2} sx={{ mb: 2, width: '100%' }}></Grid>

      <Box
        maxHeight={'65vh'}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        <TableContainer
          component={Paper}
          sx={{
            overflow: 'auto',
            width: '100%',
            maxWidth: '1200px',
            borderRadius: '8px',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Tên nhân viên</b>
                </TableCell>
                <TableCell>
                  <b>Tên phòng</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Số diện thoại</b>
                </TableCell>
                <TableCell>
                  <b>Ngày bắt đầu làm việc</b>
                </TableCell>
                <TableCell>
                  <b>Ngày ký hợp đồng</b>
                </TableCell>
                <TableCell>
                  <b>Ngày hết hạn hợp đồng</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map(contract => (
                <TableRow
                  key={contract._id}
                  sx={{
                    cursor: 'pointer',
                    ':&hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <TableCell>{contract.employeeId?.fullName}</TableCell>
                  <TableCell>{'Phong abc'}</TableCell>
                  <TableCell>{contract.employeeId?.email}</TableCell>
                  <TableCell>{contract.employeeId?.phoneNumber}</TableCell>
                  <TableCell>
                    {convertToVietnamTime(contract.startDate)}
                  </TableCell>
                  <TableCell>
                    {convertToVietnamTime(contract.signDate)}
                  </TableCell>
                  <TableCell>
                    {convertToVietnamTime(contract.endDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
