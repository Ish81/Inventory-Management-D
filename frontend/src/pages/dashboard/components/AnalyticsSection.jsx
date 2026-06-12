import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../../api/analyticsApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { formatCurrency } from '../../../utils/formatters';

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

const AnalyticsSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsApi.getAnalytics();
        // Extract data based on standard response wrapper
        setData(response.data.data ? response.data.data : response.data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  if (error || !data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#ef4444', background: '#fee2e2', borderRadius: '12px', marginBottom: '28px' }}>
        Failed to load Module 4 analytics data.
      </div>
    );
  }

  // Calculate max count for bar chart scaling. Handle empty case.
  const monthlyOrders = data.monthly_orders || [];
  const maxOrderCount = monthlyOrders.length > 0 
    ? Math.max(...monthlyOrders.map(o => o.count), 1) 
    : 1;

  return (
    <div style={{ marginBottom: '28px' }}>
      <SectionLabel text="Module 4 — Analytics" />
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <StatCard 
          label="Low Stock Count" 
          value={data.low_stock_count} 
          color="#d97706" 
        />
        <StatCard 
          label="Inventory Valuation" 
          value={formatCurrency(data.inventory_valuation)} 
        />
      </div>

      {/* Simple CSS Bar Chart */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '24px' }}>Monthly Orders (Last 6 Months)</h3>
        
        {monthlyOrders.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>No order data available.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '160px', gap: '12px', paddingBottom: '10px', overflowX: 'auto', borderBottom: '1px solid #f3f4f6' }}>
            {monthlyOrders.map((item, idx) => {
              const heightPercent = Math.max((item.count / maxOrderCount) * 100, 5); // At least 5% visible
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '48px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>{item.count}</span>
                  <div style={{ 
                    width: '100%', 
                    height: `${heightPercent}%`, 
                    background: '#2563eb', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease-out'
                  }}></div>
                  <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px', whiteSpace: 'nowrap' }}>{item.month}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSection;
