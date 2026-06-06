import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Map URL paths to readable titles for the top navbar
const PAGE_TITLES = {
  '/':           'Dashboard',
  '/products':   'Products',
  '/categories': 'Categories',
  '/suppliers':  'Suppliers',
};

const Layout = () => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Smart Inventory';

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} />
        <main className="page-content">
          <Outlet /> {/* The current page renders here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;