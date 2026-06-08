import { useLocation } from 'react-router-dom';

// Map paths to breadcrumb labels
const breadcrumbMap = {
  '/': 'Dashboard',
  '/purchase-orders': 'Purchase Orders',
  '/purchase-orders/new': 'New Purchase Order',
  '/sales-orders': 'Sales Orders',
  '/sales-orders/new': 'New Sales Order',
};

const Navbar = () => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (breadcrumbMap[path]) return breadcrumbMap[path];
    if (path.includes('/purchase-orders/') && path.includes('/edit')) return 'Edit Purchase Order';
    if (path.includes('/sales-orders/') && path.includes('/edit')) return 'Edit Sales Order';
    if (path.includes('/purchase-orders/')) return 'Purchase Order Details';
    if (path.includes('/sales-orders/')) return 'Sales Order Details';
    return 'Page';
  };

  return (
    <header style={{
      height: '60px',
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
        <span style={{ color: '#9ca3af' }}>Home</span>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span style={{ color: '#374151', fontWeight: '500' }}>{getBreadcrumb()}</span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
          cursor: 'pointer',
        }}>
          🔔
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '600', fontSize: '13px',
          }}>A</div>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;