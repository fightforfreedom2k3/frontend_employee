import { Typography, Container } from "@mui/material";

export default function Dashboard() {
    const token = localStorage.getItem('token');
    console.log(token)
    return (
        <Container>
            <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>
                Chào mừng đến với Hệ thống Quản lý Nhân sự
            </Typography>
        </Container>
    );
}
