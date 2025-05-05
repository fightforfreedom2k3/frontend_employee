import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function MainLayout() {
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
      icon: <LunchDiningIcon />,
      path: '/meal-menu',
      role: 'ADMIN',
    },
    {
      text: 'Chấm công',
      icon: <DescriptionIcon />,
      path: '/attendance',
      role: 'ADMIN',
    },
    {
      text: 'Đăng kí cơm trưa',
      icon: <LunchDiningIcon />,
      path: '/lunch-registration',
      role: 'EMPLOYEE',
    },
    {
      text: 'Quản lý đơn nghỉ phép',
      icon: <DescriptionIcon />,
      path: '/leave-request',
      role: 'ADMIN',
    },
    {
      text: 'Quản lý cơ sở vật chất',
      icon: <DescriptionIcon />,
      path: '/property',
      role: 'ADMIN',
    },
  ];

  const settings = [
    {
      text: 'profile',
      path: '/employee-information',
      name: 'Thông tin cá nhân',
    },
    {
      text: 'attendance',
      path: '/attendance-history',
      name: 'Lịch sử chấm công',
      role: 'EMPLOYEE',
    },
  ];

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('role') || 'EMPLOYEE'; // Replace with actual role from authentication context

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // const user: Employee = JSON.parse(localStorage.getItem('user') || '');
  const fullName = localStorage.getItem('fullName') || 'Người dùng';

  return (
    <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginLeft: 1,
              marginRight: 3,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, ml: 2 }}
          >
            Hệ thống quản lý nhân sự HRM
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 5 }}
          >
            <Tooltip title="Open settings">
              <Stack display="flex" direction="row" alignItems="center" gap={2}>
                <Typography>{`Xin chào ${fullName}`}</Typography>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <SettingsIcon sx={{ color: 'white' }} />
                </IconButton>
              </Stack>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings
                .filter(item => !item.role || item.role === userRole)
                .map(setting => (
                  <MenuItem
                    key={setting.text}
                    onClick={() => {
                      navigate(setting.path);
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography sx={{ textAlign: 'center' }}>
                      {setting.name}
                    </Typography>
                  </MenuItem>
                ))}
              <Divider />
              <MenuItem
                key={'logout'}
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
              >
                <Typography>Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ backgroundColor: 'primary' }}>
          <IconButton
            sx={{ '--IconButton-hoverBg': 'none' }}
            onClick={handleDrawerClose}
          >
            {theme.direction === 'ltr' ? (
              <Stack
                width={'200px'}
                direction="row"
                alignItems="center"
                justifyContent={'space-between'}
              >
                <Typography
                  noWrap
                  color="black"
                  component="div"
                  fontWeight={'bold'}
                >
                  HRM
                </Typography>
                <ChevronLeftIcon />
              </Stack>
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ width: '100%' }} />
        <List
          sx={{
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              height: 0, // ẩn thanh cuộn ngang trên Webkit
            },
          }}
        >
          {menuItems
            .filter(item => !item.role || item.role === userRole)
            .map(item => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: 'block' }}
                onClick={() => navigate(item.path)}
              >
                <ListItemButton
                  selected={location.pathname === item.path}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? { justifyContent: 'initial' }
                      : { justifyContent: 'center' },
                  ]}
                >
                  <ListItemIcon
                    sx={
                      open
                        ? { minWidth: 0, mr: 3, justifyContent: 'center' }
                        : { justifyContent: 'center' }
                    }
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        <Divider sx={{ width: '100%' }} />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowX: 'hidden' }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
