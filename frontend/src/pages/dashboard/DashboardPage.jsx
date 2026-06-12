import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import AnalyticsSection from './components/AnalyticsSection';

const StatCard = ({ label, value, color = '#111827', bg = '#fff' }) => (
  <div style={{
    background: bg,
    borderRadius: '12px',
    padding: '20px 24px',
    border: '1px solid #e5e7eb',
    flex: 1,
    minWidth: '140px',
  }}>
    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </p>
    <p style={{ fontSize: '28px', fontWeight: '700', color }}>{value ?? '—'}</p>
  </div>
);

const SectionLabel = ({ text }) => (
  <div style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', marginTop: '8px' }}>
    {text}
  </div>
);

const DashboardPage = () => {
  const [orderStats, setOrderStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderRes, productRes] = await Promise.allSettled([
          dashboardApi.getOrderStats(),
          dashboardApi.getProductStats(),
        ]);
        if (orderRes.status === 'fulfilled') setOrderStats(orderRes.value.data.data);
        if (productRes.status === 'fulfilled') setProductStats(productRes.value.data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827' }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
          Smart Inventory Management System — overview
        </p>
      </div>

      {/* Module 1 Stats */}
      {productStats && (
        <>
          <SectionLabel text="Module 1 — Products & Suppliers" />
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <StatCard label="Total Products" value={productStats.total_products} color="#2563eb" />
            <StatCard label="Total Categories" value={productStats.total_categories} color="#0891b2" />
            <StatCard label="Total Suppliers" value={productStats.total_suppliers} color="#059669" />
          </div>
        </>
      )}

      {/* Module 3 Stats */}
      {orderStats && (
        <>
          <SectionLabel text="Module 3 — Orders" />
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <StatCard label="Total Purchase Orders" value={orderStats.total_purchase_orders} />
            <StatCard label="Total Sales Orders" value={orderStats.total_sales_orders} />
            <StatCard label="Pending Purchase" value={orderStats.pending_purchase_orders} color="#d97706" />
            <StatCard label="Pending Sales" value={orderStats.pending_sales_orders} color="#7c3aed" />
          </div>
        </>
      )}

      {/* Module 4 Analytics Section - Temporarily disabled to debug redirect loop */}
      {/* <AnalyticsSection /> */}

      {/* Recent tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Recent Products */}
        {productStats && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Recent Products</h2>
              <button onClick={() => navigate('/products')} style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                View all →
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Product', 'SKU', 'Price', 'Category'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productStats.recent_products.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No products yet</td></tr>
                ) : productStats.recent_products.map(p => (
                  <tr key={p.id} onClick={() => navigate('/products')}
                    style={{ borderTop: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#111827' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#2563eb', fontFamily: 'monospace' }}>{p.sku}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{formatCurrency(p.price)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{p.category_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent Purchase Orders */}
        {orderStats && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Recent Purchase Orders</h2>
              <button onClick={() => navigate('/purchase-orders')} style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                {orderStats.recent_purchase_orders.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No orders yet</td></tr>
                ) : orderStats.recent_purchase_orders.map(po => (
                  <tr key={po.id} onClick={() => navigate(`/purchase-orders/${po.id}`)}
                    style={{ borderTop: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#2563eb' }}>{po.po_number}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{po.supplier_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{formatCurrency(po.total_amount)}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={po.status} type="po" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;