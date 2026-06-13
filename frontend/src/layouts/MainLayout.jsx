import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  GridView as DashboardIcon,
  Inventory2 as StockIcon,
  CompareArrows as TransferIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as SuppliersIcon,
  Category as CategoryIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const menuGroups = [
  {
    title: 'CORE INVENTORY',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} />, path: '/' },
      { text: 'Warehouses', icon: <StockIcon sx={{ fontSize: 20 }} />, path: '/warehouses' },
      { text: 'Stock Movement', icon: <StockIcon sx={{ fontSize: 20 }} />, path: '/stock-movement' },
      { text: 'Transfer Stock', icon: <TransferIcon sx={{ fontSize: 20 }} />, path: '/transfers' },
    ]
  },
  {
    title: 'PURCHASE & SALES',
    items: [
      { text: 'Purchase Orders', icon: <OrdersIcon sx={{ fontSize: 20 }} />, path: '/purchase-orders' },
      { text: 'Sales Orders', icon: <OrdersIcon sx={{ fontSize: 20 }} />, path: '/sales-orders' },
      { text: 'Suppliers', icon: <SuppliersIcon sx={{ fontSize: 20 }} />, path: '/suppliers' },
    ]
  },
  {
    title: 'PRODUCT MANAGEMENT',
    items: [
      { text: 'Products Catalog', icon: <CategoryIcon sx={{ fontSize: 20 }} />, path: '/products' },
      { text: 'Categories', icon: <CategoryIcon sx={{ fontSize: 20 }} />, path: '/categories' },
    ]
  },
  {
    title: 'ANALYTICS',
    items: [
      { text: 'Reports', icon: <ReportsIcon sx={{ fontSize: 20 }} />, path: '/reports' },
      { text: 'Alerts', icon: <ReportsIcon sx={{ fontSize: 20 }} />, path: '/alerts' },
      { text: 'Audit Logs', icon: <PeopleIcon sx={{ fontSize: 20 }} />, path: '/audit-logs' },
    ]
  }
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('userRole') || 'Admin');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    localStorage.setItem('userRole', role);
    handleMenuClose();
  };

  // Get current page name
  const getCurrentPageName = () => {
    for (const group of menuGroups) {
      const item = group.items.find(i => i.path === location.pathname);
      if (item) return item.text;
    }
    return 'Page';
  };

  const currentPageName = getCurrentPageName();

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          S
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#0f172a' }}>
            SmartIMS
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            Inventory System
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderBottomWidth: 1, borderColor: 'divider' }} />

      <Box sx={{ overflowY: 'auto', flexGrow: 1, py: 1 }}>
        {menuGroups.map((group) => (
          <Box key={group.title} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 3,
                py: 1,
                display: 'block',
                color: '#64748b',
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '0.5px'
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => {
                const isSelected = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      selected={isSelected}
                      sx={{
                        pl: 3,
                        py: 0.75,
                        position: 'relative',
                        color: isSelected ? '#2563eb' : '#475569',
                        ...(isSelected && {
                          bgcolor: '#eff6ff !important',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            backgroundColor: '#2563eb',
                            borderTopRightRadius: '4px',
                            borderBottomRightRadius: '4px'
                          }
                        }),
                        '&:hover': {
                          bgcolor: isSelected ? '#eff6ff' : '#f1f5f9',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isSelected ? '#2563eb' : '#64748b',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 600 : 500
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ minHeight: '64px' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#0f172a' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Profile section — inlined to preserve anchorEl across re-renders */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
            <Box
              onClick={handleMenuOpen}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#2563eb', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {currentRole.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                {currentRole}
              </Typography>
            </Box>
          </Box>

          {/* Dropdown menu — rendered outside the flex container so it doesn't affect layout */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                mt: 1,
                minWidth: 220,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                  borderLeft: '1px solid #e2e8f0',
                  borderTop: '1px solid #e2e8f0',
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: '#2563eb', mb: 1, fontSize: '1.2rem', fontWeight: 'bold' }}>
                {currentRole.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Demo User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                user@smartims.com
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ px: 2, pb: 1, display: 'block', color: 'text.secondary', fontWeight: 600, letterSpacing: '0.5px' }}>
              SWITCH ROLE
            </Typography>
            <MenuItem onClick={() => handleRoleChange('Admin')} selected={currentRole === 'Admin'}>
              Admin
            </MenuItem>
            <MenuItem onClick={() => handleRoleChange('Manager')} selected={currentRole === 'Manager'}>
              Manager
            </MenuItem>
            <MenuItem onClick={() => handleRoleChange('Staff')} selected={currentRole === 'Staff'}>
              Staff
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >


        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
