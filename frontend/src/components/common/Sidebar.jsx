import { NavLink } from 'react-router-dom';

const navItems = [
  {
    section: 'MODULE 3 — ORDERS',
    links: [
      { to: '/', label: 'Dashboard', icon: '⊞' },
      { to: '/purchase-orders', label: 'Purchase Orders', icon: '↓' },
      { to: '/sales-orders', label: 'Sales Orders', icon: '↑' },
    ],
  },
  {
    section: 'MODULE 1 — PRODUCTS',
    links: [
      { to: '/products', label: 'Products', icon: '📦' },
      { to: '/categories', label: 'Categories', icon: '🏷️' },
      { to: '/suppliers', label: 'Suppliers', icon: '🚚' },
    ],
  },
  {
    section: 'MODULE 2 — COMING SOON',
    links: [
      { to: '#', label: 'Inventory', icon: '□', disabled: true },
      { to: '#', label: 'Warehouse', icon: '□', disabled: true },
    ],
  },
];

const Sidebar = () => {
  const userRole = localStorage.getItem('user_role') || 'staff';

  const filteredNavItems = [...navItems];
  const module4Links = [
    { to: '/alerts', label: 'Alerts', icon: '🔔' },
    { to: '/reports', label: 'Reports', icon: '📊' },
    { to: '/audit-logs', label: 'Audit Log', icon: '📋' }
  ];
  filteredNavItems.push({
    section: 'MODULE 4 — ANALYTICS',
    links: module4Links
  });
  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: '#2563eb',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: '14px',
          }}>S</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>SmartIMS</div>
            <div style={{ fontSize: '10px', color: '#9ca3af' }}>Inventory System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {filteredNavItems.map((group) => (
          <div key={group.section} style={{ marginBottom: '8px' }}>
            <div style={{
              padding: '8px 20px 4px',
              fontSize: '10px',
              fontWeight: '600',
              color: '#9ca3af',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {group.section}
            </div>
            {group.links.map((link) =>
              link.disabled ? (
                <div
                  key={link.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    color: '#d1d5db',
                    cursor: 'not-allowed',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{link.icon}</span>
                  {link.label}
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === '/'}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#2563eb' : '#374151',
                    background: isActive ? '#eff6ff' : 'transparent',
                    borderRight: isActive ? '3px solid #2563eb' : '3px solid transparent',
                    transition: 'all 0.15s',
                    textDecoration: 'none',
                  })}
                >
                  <span style={{ fontSize: '16px' }}>{link.icon}</span>
                  {link.label}
                </NavLink>
              )
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #e5e7eb',
        fontSize: '11px',
        color: '#9ca3af',
      }}>
        SmartIMS — v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;