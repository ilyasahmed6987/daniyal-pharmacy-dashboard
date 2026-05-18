import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Tooltip, ListSubheader
} from '@mui/material';
import {
  Menu as MenuIcon,
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  PlusSquare,
  Truck,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setOpen(!open);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      label: 'Main Menu',
      items: [
        { text: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
        { text: 'Medicines', icon: <Pill size={18} />, path: '/medicines' },
        { text: 'Inventory', icon: <Package size={18} />, path: '/inventory' },
        { text: 'POS & Sales', icon: <PlusSquare size={18} />, path: '/pos' },
      ]
    },
    {
      label: 'Procurement',
      items: [
        { text: 'Purchases', icon: <ShoppingCart size={18} />, path: '/purchases' },
        { text: 'Suppliers', icon: <Truck size={18} />, path: '/suppliers' },
        { text: 'Customers', icon: <Users size={18} />, path: '/customers' },
      ]
    },
    {
      label: 'Admin',
      items: [
        { text: 'Reports', icon: <BarChart3 size={18} />, path: '/reports' },
        ...(user?.role === 'SUPER_ADMIN' ? [{ text: 'Employees', icon: <UserIcon size={18} />, path: '/employees' }] : []),
        { text: 'Settings', icon: <Settings size={18} />, path: '/settings' },
      ]
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          height: 64,
        }}
      >
        <Toolbar sx={{ height: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon size={20} />
          </IconButton>
          
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, bgcolor: 'background.default', px: 2, py: 0.75, borderRadius: 1.5, width: 320 }}>
              <Box component="span" sx={{ color: 'text.secondary', display: 'flex' }}><Zap size={16} /></Box>
              <Typography variant="body2" color="text.secondary">Search anything...</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>System Online</Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={handleMenu}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem', fontWeight: 700 }}>
                {user?.name?.[0]}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>{user?.role}</Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }} sx={{ fontSize: '0.875rem' }}>Profile</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ fontSize: '0.875rem', color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'inherit' }}><LogOut size={16} /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : 72,
            boxSizing: 'border-box',
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 2.5, gap: 1.5 }}>
          <Box sx={{ minWidth: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Pill size={18} />
          </Box>
          {open && (
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Daniyal Pharmacy Dashboard
            </Typography>
          )}
        </Box>
        
        <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
          {navGroups.map((group) => (
            <List
              key={group.label}
              subheader={
                open ? (
                  <ListSubheader 
                    sx={{ 
                      lineHeight: '32px', 
                      bgcolor: 'transparent', 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em', 
                      color: 'text.secondary',
                      mt: group === navGroups[0] ? 0 : 2
                    }}
                  >
                    {group.label}
                  </ListSubheader>
                ) : <Box sx={{ height: 8 }} />
              }
            >
              {group.items.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      minHeight: 40,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      mx: open ? 1 : 0,
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: mode === 'light' ? 'rgba(13, 148, 136, 0.08)' : 'rgba(13, 148, 136, 0.2)',
                        color: 'primary.main',
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                        borderRight: open ? '3px solid' : 'none',
                        borderColor: 'primary.main',
                        '&:hover': { bgcolor: mode === 'light' ? 'rgba(13, 148, 136, 0.12)' : 'rgba(13, 148, 136, 0.25)' },
                      },
                      '&:hover': {
                        bgcolor: 'background.default',
                      }
                    }}
                  >
                    <Tooltip title={!open ? item.text : ""} placement="right">
                      <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.5 : 'auto', justifyContent: 'center', color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText 
                      primary={item.text} 
                      sx={{ 
                        opacity: open ? 1 : 0,
                        '& .MuiTypography-root': {
                          fontSize: '0.85rem',
                          fontWeight: location.pathname === item.path ? 700 : 500,
                        }
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ))}
        </Box>
        
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{ borderRadius: 1, color: 'text.secondary', minHeight: 40, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.5 : 'auto', color: 'inherit' }}><LogOut size={18} /></ListItemIcon>
            {open && <ListItemText primary="Log out" sx={{ '& .MuiTypography-root': { fontSize: '0.85rem', fontWeight: 500 } }} />}
          </ListItemButton>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh', width: `calc(100% - ${open ? drawerWidth : 72}px)` }}>
        <Toolbar sx={{ mb: 2 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
