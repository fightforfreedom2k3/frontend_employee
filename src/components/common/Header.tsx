import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  handleDrawerToggle: () => void;
  currentTitle: string;
  drawerWidth: number;
}

const Header: React.FC<HeaderProps> = ({
  handleDrawerToggle,
  currentTitle,
  drawerWidth,
}) => {
  return (
    <AppBar
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
          {currentTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
