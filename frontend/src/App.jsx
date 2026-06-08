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

const App = () => {
  return (
    <BrowserRouter>
      {/* Toast notification container — sits above everything */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: '13px', borderRadius: '8px' },
        }}
      />

      <Routes>
        {/* All routes inside MainLayout get Sidebar + Navbar automatically */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />

          {/* Purchase Orders */}
          <Route path="/purchase-orders" element={<PurchaseOrderListPage />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
          <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />

          {/* Sales Orders */}
          <Route path="/sales-orders" element={<SalesOrderListPage />} />
          <Route path="/sales-orders/new" element={<SalesOrderFormPage />} />
          <Route path="/sales-orders/:id" element={<SalesOrderDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;