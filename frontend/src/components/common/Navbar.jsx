import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';

// Map paths to breadcrumb labels
const breadcrumbMap = {
  '/': 'Dashboard',
  '/purchase-orders': 'Purchase Orders',
  '/purchase-orders/new': 'New Purchase Order',
  '/sales-orders': 'Sales Orders',
  '/sales-orders/new': 'New Sales Order',
  '/products': 'Products',
  '/categories': 'Categories',
  '/suppliers': 'Suppliers',
  '/alerts': 'Alerts',
  '/reports': 'Reports',
  '/audit-logs': 'Audit Logs',
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  const userRole = localStorage.getItem('user_role') || 'staff';
  const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email || '';

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (breadcrumbMap[path]) return breadcrumbMap[path];
    if (path.includes('/purchase-orders/') && path.includes('/edit')) return 'Edit Purchase Order';
    if (path.includes('/sales-orders/') && path.includes('/edit')) return 'Edit Sales Order';
    if (path.includes('/purchase-orders/')) return 'Purchase Order Details';
    if (path.includes('/sales-orders/')) return 'Sales Order Details';
    return 'Page';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleRoleChange = async () => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }
    if (!userEmail) {
      toast.error('User email not found. Please login again.');
      return;
    }
    try {
      console.log('Changing role for:', userEmail, 'to:', newRole);
      const response = await authApi.updateUserRole(userEmail, newRole);
      console.log('Role change response:', response);
      localStorage.setItem('user_role', newRole);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.role = newRole;
      localStorage.setItem('user', JSON.stringify(user));
      setShowRoleModal(false);
      setShowDropdown(false);
      setNewRole('');
      toast.success(`Role changed to ${newRole}. Please refresh the page to see changes.`);
    } catch (error) {
      console.error('Role change error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change role';
      toast.error(errorMessage);
    }
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
        <div style={{ position: 'relative' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              background: '#2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '600', fontSize: '13px',
            }}>
              {userRole.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              minWidth: '180px',
              zIndex: 1000,
            }}>
              <div style={{ padding: '8px 0' }}>
                <div
                  onClick={() => {
                    setShowRoleModal(true);
                    setShowDropdown(false);
                  }}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Change Role
                </div>
                <div
                  onClick={handleLogout}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: '#dc2626',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Logout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
              Change User Role
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                Select New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  background: '#fff',
                }}
              >
                <option value="">Select a role...</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setNewRole('');
                }}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                style={{
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;