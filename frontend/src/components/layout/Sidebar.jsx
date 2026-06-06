import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiTag, FiTruck, FiBox
} from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: FiGrid, to: '/' },
];

const MODULE_1 = [
  { label: 'Products',   icon: FiPackage, to: '/products' },
  { label: 'Categories', icon: FiTag,     to: '/categories' },
  { label: 'Suppliers',  icon: FiTruck,   to: '/suppliers' },
];

// Placeholder links so teammates can see where their modules will plug in
const COMING_SOON = [
  { label: 'Inventory (M2)',      icon: FiBox,  to: '#' },
  { label: 'Purchase Orders (M3)', icon: FiBox, to: '#' },
  { label: 'Sales Orders (M3)',    icon: FiBox, to: '#' },
];

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
    end={to === '/'}
  >
    <Icon className="nav-icon" />
    <span>{label}</span>
  </NavLink>
);

const Sidebar = () => (
  <aside className="sidebar">
    {/* Brand */}
    <div className="sidebar-brand">
      <h5>📦 SmartInventory</h5>
      <p>Management System</p>
    </div>

    {/* Main */}
    <div className="sidebar-section-label">Main</div>
    {NAV_ITEMS.map(item => <SidebarLink key={item.to} {...item} />)}

    {/* Module 1 */}
    <div className="sidebar-section-label">Module 1 — Products</div>
    {MODULE_1.map(item => <SidebarLink key={item.to} {...item} />)}

    {/* Coming Soon */}
    <div className="sidebar-section-label">Coming Soon</div>
    {COMING_SOON.map(item => (
      <span key={item.label} className="sidebar-nav-item" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
        <item.icon className="nav-icon" />
        <span>{item.label}</span>
      </span>
    ))}
  </aside>
);

export default Sidebar;