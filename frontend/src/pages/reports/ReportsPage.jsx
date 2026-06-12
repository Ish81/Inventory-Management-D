import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { analyticsApi } from '../../api/analyticsApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

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

const ReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsApi.getAnalytics();
        
        // Handle flexible response structure
        let analyticsData;
        if (response.data?.data) {
          analyticsData = response.data.data;
        } else if (response.data) {
          analyticsData = response.data;
        } else {
          throw new Error('Invalid response structure');
        }

        // Validate that we have required fields
        if (!analyticsData) {
          throw new Error('No analytics data received');
        }

        setData(analyticsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load analytics';
        setError(errorMsg);
        toast.error(errorMsg);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (!data || !data.monthly_orders || data.monthly_orders.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    try {
      const header = "Month,Order Count\n";
      const rows = data.monthly_orders.map(row => `${row.month || 'N/A'},${row.count || 0}`).join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + rows);
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      link.setAttribute("download", `inventory-report-${month}-${year}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report exported successfully');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Reports" subtitle="Inventory analytics and summaries" />
        <LoadingSpinner message="Loading reports..." />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <PageHeader title="Reports" subtitle="Inventory analytics and summaries" />
        <EmptyState message={error || "Failed to load analytics data"} />
      </>
    );
  }

  const monthlyOrders = (data.monthly_orders || []).filter(o => o && o.count !== undefined);
  const maxOrderCount = monthlyOrders.length > 0 
    ? Math.max(...monthlyOrders.map(o => o.count || 0), 1) 
    : 1;

  const totalOrders = monthlyOrders.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <>
      <PageHeader 
        title="Reports" 
        subtitle="Inventory analytics and summaries"
      />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <StatCard label="Total Products" value={data.total_products || 0} color="#2563eb" />
        <StatCard label="Total Categories" value={data.total_categories || 0} color="#7c3aed" />
        <StatCard label="Total Suppliers" value={data.total_suppliers || 0} color="#059669" />
        <StatCard label="Low Stock Items" value={data.low_stock_count || 0} color="#dc2626" bg="#fee2e2" />
      </div>

      {/* Orders Chart */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Orders per Month</h3>
          <button
            onClick={handleExportCSV}
            style={{
              padding: '8px 16px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
        </div>

        {monthlyOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            No monthly data available
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px' }}>
            {monthlyOrders.map((item) => (
              <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    background: '#2563eb',
                    borderRadius: '4px 4px 0 0',
                    height: `${(item.count / maxOrderCount) * 100}%`,
                    minHeight: item.count > 0 ? '20px' : '0px',
                    transition: 'all 0.2s',
                  }}
                  title={`${item.month}: ${item.count} orders`}
                />
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280', textAlign: 'center', width: '100%' }}>
                  {item.month}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Orders (This Period)</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{totalOrders}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average Orders per Month</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
              {monthlyOrders.length > 0 ? (totalOrders / monthlyOrders.length).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;