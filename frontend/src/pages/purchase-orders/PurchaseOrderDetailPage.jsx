import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseOrderApi } from '../../api/purchaseOrderApi';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { PO_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
    <span style={{ width: '200px', fontSize: '13px', color: '#6b7280', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '13px', color: '#111827', fontWeight: '500' }}>{value || '—'}</span>
  </div>
);

const PurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await purchaseOrderApi.getById(id);
        setOrder(res.data.data);
        setSelectedStatus(res.data.data.status);
      } catch {
        toast.error('Purchase order not found');
        navigate('/purchase-orders');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;
    setUpdatingStatus(true);
    try {
      const res = await purchaseOrderApi.updateStatus(id, selectedStatus);
      setOrder(prev => ({ ...prev, status: res.data.data.status }));
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
      setSelectedStatus(order.status);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  return (
    <div>
      <PageHeader
        title={order.po_number}
        subtitle={`Created ${formatDateTime(order.created_at)}`}
        showBack
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Main details */}
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Order Information</h2>
            <InfoRow label="PO Number" value={order.po_number} />
            <InfoRow label="Supplier Name" value={order.supplier_name} />
            <InfoRow label="Order Date" value={formatDate(order.order_date)} />
            <InfoRow label="Expected Delivery" value={formatDate(order.expected_delivery_date)} />
            <InfoRow label="Total Amount" value={formatCurrency(order.total_amount)} />
            <InfoRow label="Notes" value={order.notes} />
          </div>

          {/* Items Table */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Order Items</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Product', 'SKU', 'Quantity', 'Unit Price', 'Total'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#111827' }}>{item.product_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>{item.product_sku || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{item.quantity}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{formatCurrency(item.unit_price)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#111827' }}>{formatCurrency(item.total_price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #e5e7eb', background: '#f9fafb' }}>
                  <td colSpan={4} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', textAlign: 'right', color: '#374151' }}>Grand Total</td>
                  <td style={{ padding: '12px 16px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>{formatCurrency(order.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Sidebar panel */}
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '14px', color: '#111827' }}>Current Status</h3>
            <StatusBadge status={order.status} type="po" />
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '14px', color: '#111827' }}>Update Status</h3>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', outline: 'none' }}
            >
              {Object.keys(PO_STATUSES).map(s => (
                <option key={s} value={s}>{PO_STATUSES[s].label}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updatingStatus || selectedStatus === order.status}
              style={{
                width: '100%',
                padding: '9px',
                background: updatingStatus || selectedStatus === order.status ? '#93c5fd' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: updatingStatus || selectedStatus === order.status ? 'not-allowed' : 'pointer',
              }}
            >
              {updatingStatus ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailPage;