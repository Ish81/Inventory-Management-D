import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import DashboardPage  from './pages/dashboard/DashboardPage';
import ProductsPage   from './pages/products/ProductsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import SuppliersPage  from './pages/suppliers/SuppliersPage';

const App = () => (
  <>
    {/* Toast notifications rendered globally */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: { fontSize: '0.875rem', borderRadius: '8px' },
        success: { iconTheme: { primary: '#38a169', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#e53e3e', secondary: '#fff' } },
      }}
    />

    <Routes>
      {/* All pages share the Layout shell (sidebar + navbar) */}
      <Route path="/" element={<Layout />}>
        <Route index          element={<DashboardPage />} />
        <Route path="products"   element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="suppliers"  element={<SuppliersPage />} />
      </Route>
    </Routes>
  </>
);

export default App;