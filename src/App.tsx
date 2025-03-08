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
          <Route path="employee" element={<EmployeeList />} />
          <Route path="department" element={<DepartmentList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
