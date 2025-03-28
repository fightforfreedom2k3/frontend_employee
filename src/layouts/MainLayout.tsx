import { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation(); // Lấy URL hiện tại
  const role = localStorage.getItem('role');

  //Xử lí giao diện mobi
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //Xử lí đăng xuất
  const handleLogout = () => {
    //add thêm gọi api đăng xuất ở đây
    localStorage.clear();
    window.location.href = '/login';
  };

  // Danh sách màn hình theo role
  const menuItems = [
    //dasboard
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    //role ADMIN
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
      text: 'Hợp đồng',
      icon: <DescriptionIcon />,
      path: '/contract',
      role: 'ADMIN',
    },
    {
      text: 'Chấm công',
      icon: <DescriptionIcon />,
      path: '/attendance',
      role: 'ADMIN',
    },
    //role EMPLOYEE
  ];

  // Lọc menu theo role
  const menuItemsByRole = menuItems.filter(
    item => !item.role || item.role === role
  );
  const drawer = (
    <Box
      className="hoang2"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Toolbar
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          fontWeight: 'bold',
          justifyContent: 'center',
        }}
      >
        Quản lý nhân sự
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItemsByRole.map(item => {
          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: '8px',
                mx: 1,
                my: 0.5,
                '&:hover': { bgcolor: theme.palette.action.hover },
                ...(location.pathname === item.path && {
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '&:hover': { bgcolor: 'theme.palette.primary.main' },
                }),
              }}
            >
              {item.icon}
              <ListItemText primary={item.text} sx={{ ml: 2 }} />
            </ListItemButton>
          );
        })}
      </List>
      <ListItemButton
        className="logout-button"
        sx={{
          borderRadius: '8px',
          mx: 1,
          my: 1,
          '&:hover': { bgcolor: theme.palette.action.hover },
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          height: '48px',
          flexGrow: 0,
        }}
        onClick={handleLogout}
      >
        <ExitToAppIcon sx={{ fontSize: '20px' }} />
        <ListItemText
          primary="Đăng xuất"
          sx={{
            ml: 2,
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: '1rem',
          }}
        />
      </ListItemButton>
      <Divider />
      <Box
        sx={{ textAlign: 'center', p: 2, fontSize: '0.875rem', color: 'gray' }}
      >
        © 2025 Trung tâm nghiên cứu Khoa học Quân sự
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar
        className="hoang1"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {menuItemsByRole.find(item => location.pathname === item.path)
              ?.text || 'Quản lý nhân sự'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
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
          {drawer}
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
          {drawer}
        </Drawer>
      </Box>

      {/* Nội dung chính */}
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
