import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { Box, Typography } from '@mui/material';

import WarehouseDashboard from './features/dashboard/Dashboard';
import StockMovement from './features/inventory/Inventory';
import Transfers from './features/transfers/Transfers';

// New Demo Pages
import Products from './features/products/Products';
import Categories from './features/categories/Categories';
import PurchaseOrders from './features/orders/PurchaseOrders';
import SalesOrders from './features/orders/SalesOrders';
import Suppliers from './features/suppliers/Suppliers';

const Placeholder = ({ title }) => (
  <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
    <Typography variant="h4" color="text.secondary">{title} Page Content</Typography>
  </Box>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<WarehouseDashboard />} />
        <Route path="stock-movement" element={<StockMovement />} />
        <Route path="transfers" element={<Transfers />} />
        
        {/* Demo Routes */}
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="sales-orders" element={<SalesOrders />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        
        {/* Placeholder Routes */}
        <Route path="reports" element={<Placeholder title="Reports" />} />
        <Route path="users" element={<Placeholder title="User Management" />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Route>
    </Routes>
  );
}

export default App;
