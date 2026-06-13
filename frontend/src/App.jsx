import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import PurchaseOrderListPage from './pages/purchase-orders/PurchaseOrderListPage';
import PurchaseOrderDetailPage from './pages/purchase-orders/PurchaseOrderDetailPage';
import PurchaseOrderFormPage from './pages/purchase-orders/PurchaseOrderFormPage';
import SalesOrderListPage from './pages/sales-orders/SalesOrderListPage';
import SalesOrderDetailPage from './pages/sales-orders/SalesOrderDetailPage';
import SalesOrderFormPage from './pages/sales-orders/SalesOrderFormPage';

// Module 1 pages
import ProductsPage from './pages/products/ProductsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';

// Module 4 pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AlertsPage from './pages/alerts/AlertsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AuditLogPage from './pages/audit/AuditLogPage';

// Module 2 pages
import WarehouseDashboard from './features/dashboard/Dashboard';
import StockMovement from './features/inventory/Inventory';
import Transfers from './features/transfers/Transfers';
import Warehouses from './features/warehouses/Warehouses';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: '13px', borderRadius: '8px' },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected/Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />

          {/* Module 2 — Inventory & Warehouses */}
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/stock-movement" element={<StockMovement />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/inventory-dashboard" element={<WarehouseDashboard />} />

          {/* Purchase Orders — Module 3 */}
          <Route path="/purchase-orders" element={<PurchaseOrderListPage />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
          <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />

          {/* Sales Orders — Module 3 */}
          <Route path="/sales-orders" element={<SalesOrderListPage />} />
          <Route path="/sales-orders/new" element={<SalesOrderFormPage />} />
          <Route path="/sales-orders/:id" element={<SalesOrderDetailPage />} />

          {/* Module 1 — Products */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />

          {/* Module 4 — Analytics & Alerts */}
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/audit-logs" element={<AuditLogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;