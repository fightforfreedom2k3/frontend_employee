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
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

export default function ContractList() {
  const dispatch = useDispatch<AppDispatch>();
  const { contracts, contract, loading, error, pagination } = useSelector(
    (state: RootState) => state.contract
  );

  //search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  //state for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  //Initialize data
  useEffect(() => {
    dispatch(
      getAllContract({
        page: page + 1,
        size: rowsPerPage,
        sort: 'createdAt',
        order: 'ASC',
        value: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Search contract */}
      <Grid container mt={2} spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            label="Tìm kiếm tên hợp đồng"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>

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
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Số điện thoại</b>
                </TableCell>
                <TableCell>
                  <b>Loại hợp đồng</b>
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
                  <TableCell>{contract.employeeId?.email}</TableCell>
                  <TableCell>{contract.employeeId?.phoneNumber}</TableCell>
                  <TableCell>{contract.contractType}</TableCell>
                  <TableCell>
                    {convertToVietnamDate(contract.startDate)}
                  </TableCell>
                  <TableCell>
                    {convertToVietnamDate(contract.signDate)}
                  </TableCell>
                  <TableCell>
                    {contract.endDate
                      ? convertToVietnamDate(contract?.endDate)
                      : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* paginaiton */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
        <TablePagination
          component={'div'}
          count={pagination.totalContract || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Số hợp đồng mỗi trang"
        ></TablePagination>
      </Box>
    </Container>
  );
}
