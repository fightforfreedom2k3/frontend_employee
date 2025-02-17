import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  useMediaQuery,
  Box,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchEmployees } from "../../store/employeeSlice";
import EmployeeDialog from "./EmployeeDialog";
import CreateEmployeeDialog from "./CreateEmployeeDialog";

export default function EmployeeList() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error, pagination } = useSelector(
    (state: RootState) => state.employee
  );

  // Kiểm tra kích thước màn hình
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  // State phân trang với mặc định 10 nhân viên mỗi trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(
      fetchEmployees({
        page: page + 1,
        size: rowsPerPage,
        sort: "createdAt",
        order: "DESC",
        // search: searchQuery, // Add search query here
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  const handleRowClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEmployeeId(null);
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
    );
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        {error}
      </Typography>
    );

  return (
    <Container maxWidth="lg" sx={{ display: "flex", flexDirection: "column"}}>
      <Grid container mt={2} spacing={2} sx={{ mb: 2, width: "100%" }}>
        <Grid item xs={12} sm={6}>
          {/* Search Input */}
          <TextField
            fullWidth
            label="Tìm kiếm nhân viên"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: "right" }}>
          {/* Create Employee Button */}
          <Button
            onClick={handleCreateDialogOpen}
            variant="contained"
            color="secondary"
          >
            Tạo mới người dùng
          </Button>
        </Grid>
      </Grid>

      {/* Bảng nhân viên */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight: "82vh",
        }}
      >
        <TableContainer component={Paper} sx={{ overflowX: "auto", width: "100%", maxWidth: "900px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Họ & Tên</b></TableCell>
                <TableCell><b>Chức vụ</b></TableCell>
                {!isSmallScreen && <TableCell><b>Phòng ban</b></TableCell>}
                {!isSmallScreen && <TableCell><b>Lương cơ bản</b></TableCell>}
                <TableCell><b>Ngân hàng</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees &&
                employees.map((emp) => (
                  <TableRow
                    key={emp._id}
                    onClick={() => handleRowClick(emp._id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell>{emp.fullName}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    {!isSmallScreen && <TableCell>{emp.department ? emp.department.name : ""}</TableCell>}
                    {!isSmallScreen && <TableCell>{emp.baseSalary.toLocaleString()} VND</TableCell>}
                    <TableCell>{emp.bankAccount.bankName}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: "auto" }}>
        <TablePagination
          component="div"
          count={pagination.totalEmployee || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="Số nhân viên mỗi trang"
        />
      </Box>

      {/* Hiển thị dialog chi tiết nhân viên */}
      <EmployeeDialog open={dialogOpen} onClose={handleDialogClose} employeeId={selectedEmployeeId} />
      <CreateEmployeeDialog open={createDialogOpen} onClose={handleCreateDialogClose} />
    </Container>
  );
}
