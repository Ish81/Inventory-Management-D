import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

/**
 * Main layout wrapper.
 * Every page rendered inside this gets the Sidebar + Navbar automatically.
 * <Outlet /> is where React Router renders the current page component.
 */
const MainLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;