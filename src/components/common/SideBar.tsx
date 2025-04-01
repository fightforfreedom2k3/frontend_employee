import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface SidebarProps {
  menuItems: Array<{
    text: string;
    icon: React.ReactNode;
    path: string;
    role?: string;
  }>;
  role: string | null;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, role, handleLogout }) => {
  const theme = useTheme();
  const location = useLocation();

  const menuItemsByRole = menuItems.filter(
    item => !item.role || item.role === role
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
        {menuItemsByRole.map(item => (
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
                '&:hover': { bgcolor: theme.palette.primary.main },
              }),
            }}
          >
            {item.icon}
            <ListItemText primary={item.text} sx={{ ml: 2 }} />
          </ListItemButton>
        ))}
      </List>
      <ListItemButton
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
};

export default Sidebar;
