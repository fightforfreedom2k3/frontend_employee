import { useState } from 'react';
import { Box, CssBaseline, Drawer, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/SideBar';
import Header from '../components/common/Header';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 240;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem('role');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
      text: 'Nhân viên',
      icon: <PeopleIcon />,
      path: '/employee',
      role: 'ADMIN',
    },
    {
      text: 'Phòng ban',
      icon: <BusinessIcon />,
      path: '/department',
      role: 'ADMIN',
    },
    {
      text: 'Quản lý bữa trưa',
      icon: <DescriptionIcon />,
      path: '/meal-order',
      role: 'ADMIN',
    },
    {
      text: 'Chấm công',
      icon: <DescriptionIcon />,
      path: '/attendance',
      role: 'ADMIN',
    },
  ];

  const currentTitle = (() => {
    switch (location.pathname) {
      case '/attendance-history':
        return 'Lịch sử chấm công'; // Tiêu đề cho trang lịch sử chấm công
      case '/dashboard':
        return 'Dashboard';
      case '/employee':
        return 'Nhân viên';
      case '/department':
        return 'Phòng ban';
      case '/meal-order':
        return 'Quản lý bữa trưa';
      case '/attendance':
        return 'Chấm công';
      case '/lunch-registration':
        return 'Đăng kí cơm trưa';
      default:
        return 'Quản lý nhân sự';
    }
  })();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle}
        currentTitle={currentTitle}
        drawerWidth={drawerWidth}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Sidebar
            menuItems={menuItems}
            role={role}
            handleLogout={handleLogout}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          <Sidebar
            menuItems={menuItems}
            role={role}
            handleLogout={handleLogout}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
