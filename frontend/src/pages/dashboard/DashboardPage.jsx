import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

const StatCard = ({ label, value, color = '#111827' }) => (
  <div style={{
    background: '#fff',
    borderRadius: '12px',
    padding: '20px 24px',
    border: '1px solid #e5e7eb',
    flex: 1,
  }}>
    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </p>
    <p style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</p>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <div style={{ color: '#dc2626', padding: '20px' }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827' }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
          Purchase & Sales Orders overview
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <StatCard label="Total Purchase Orders" value={stats.total_purchase_orders} />
        <StatCard label="Total Sales Orders" value={stats.total_sales_orders} />
        <StatCard label="Pending Purchase" value={stats.pending_purchase_orders} color="#d97706" />
        <StatCard label="Pending Sales" value={stats.pending_sales_orders} color="#2563eb" />
      </div>

      {/* Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Purchase Orders */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Recent Purchase Orders</h2>
            <button
              onClick={() => navigate('/purchase-orders')}
              style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View all →
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['PO Number', 'Supplier', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent_purchase_orders.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No orders yet</td></tr>
              ) : (
                stats.recent_purchase_orders.map((po) => (
                  <tr
                    key={po.id}
                    onClick={() => navigate(`/purchase-orders/${po.id}`)}
                    style={{ borderTop: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#2563eb' }}>{po.po_number}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{po.supplier_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{formatCurrency(po.total_amount)}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={po.status} type="po" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Sales Orders */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Recent Sales Orders</h2>
            <button
              onClick={() => navigate('/sales-orders')}
              style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View all →
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['SO Number', 'Customer', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent_sales_orders.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No orders yet</td></tr>
              ) : (
                stats.recent_sales_orders.map((so) => (
                  <tr
                    key={so.id}
                    onClick={() => navigate(`/sales-orders/${so.id}`)}
                    style={{ borderTop: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#2563eb' }}>{so.so_number}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{so.customer_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{formatCurrency(so.total_amount)}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={so.status} type="so" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;