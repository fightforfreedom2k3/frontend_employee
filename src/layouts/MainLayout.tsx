import { useState } from 'react';
import { Box, CssBaseline, Stack, Toolbar } from '@mui/material';
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
import LogoutIcon from '@mui/icons-material/Logout';

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
  ];

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = 'ADMIN'; // Replace with actual role from authentication context

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Hệ thống quản lý nhân sự HRM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton
            sx={{ '--IconButton-hoverBg': 'none' }}
            onClick={handleDrawerClose}
          >
            {theme.direction === 'ltr' ? (
              <Stack
                width={'200px'}
                direction="row"
                spacing={3}
                alignItems="center"
                justifyContent={'center'}
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
            height: '80%',
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
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? { justifyContent: 'initial' }
                  : { justifyContent: 'center' },
              ]}
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              <ListItemIcon
                sx={
                  open
                    ? { minWidth: 0, mr: 3, justifyContent: 'center' }
                    : { justifyContent: 'center' }
                }
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Đăng xuất"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowX: 'hidden' }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
