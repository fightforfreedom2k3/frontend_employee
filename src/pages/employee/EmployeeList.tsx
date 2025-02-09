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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchEmployees } from "../../store/employeeSlice";
import EmployeeDialog from "./EmployeeDialog";

export default function EmployeeList() {
    const dispatch = useDispatch<AppDispatch>();
    const { employees, loading, error } = useSelector((state: RootState) => state.employee);

    // State để kiểm soát dialog
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, size: 10, sort: "ASC", order: "username" }));
    }, [dispatch]);

    const handleRowClick = (employeeId: string) => {
        setSelectedEmployeeId(employeeId);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedEmployeeId(null);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
                Danh sách nhân viên
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Họ và tên</b></TableCell>
                            <TableCell><b>Chức vụ</b></TableCell>
                            <TableCell><b>Phòng ban</b></TableCell>
                            <TableCell><b>Lương cơ bản</b></TableCell>
                            <TableCell><b>Ngân hàng</b></TableCell>
                            <TableCell><b>Số tài khoản</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp) => (
                            <TableRow key={emp._id} onClick={() => handleRowClick(emp._id)} sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}>
                                <TableCell>{emp.fullName}</TableCell>
                                <TableCell>{emp.position}</TableCell>
                                <TableCell>{emp.department.name}</TableCell>
                                <TableCell>{emp.baseSalary.toLocaleString()} VND</TableCell>
                                <TableCell>{emp.bankAccount.bankName}</TableCell>
                                <TableCell>{emp.bankAccount.accountNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Hiển thị dialog chi tiết nhân viên */}
            <EmployeeDialog open={dialogOpen} onClose={handleDialogClose} employeeId={selectedEmployeeId} />
        </Container>
    );
}
