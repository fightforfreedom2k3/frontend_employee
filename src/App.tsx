import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/admin/employee/EmployeeList';
import MainLayout from './layouts/MainLayout';
import DepartmentList from './pages/admin/department/DepartmentList';
import AttendanceRecordList from './pages/admin/attendance_record/AttendanceRecordList';
import { AttendanceHistory } from './pages/employee/attendance/AttendanceHistory';
import LunchRegistration from './pages/employee/lunch_registration/LunchRegistration';

function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login'); // Tự động điều hướng đến trang login
  }, [navigate]);

  return null; // Không render gì cả, chỉ thực hiện điều hướng
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Bao toàn bộ trang trong MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<RedirectToLogin />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance-history" element={<AttendanceHistory />} />
          <Route path="lunch-registration" element={<LunchRegistration />} />
          {/* ADMIN */}
          <Route path="employee" element={<EmployeeList />} />
          <Route path="department" element={<DepartmentList />} />
          <Route path="attendance" element={<AttendanceRecordList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
