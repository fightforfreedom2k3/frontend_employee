import { AdminDashboard } from './admin/AdminDashboard';
import EmployeeDashboard from './employee/EmployeeDashboard';

export default function Dashboard() {
  if (localStorage.getItem('role') === 'ADMIN') {
    return <AdminDashboard />;
  }
  return <EmployeeDashboard />;
}
