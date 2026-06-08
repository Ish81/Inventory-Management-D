import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesOrderApi } from '../../api/salesOrderApi';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SO_STATUS_OPTIONS = ['', 'draft', 'confirmed', 'processing', 'dispatched', 'completed', 'cancelled'];

const SalesOrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await salesOrderApi.getAll({
        page,
        per_page: 10,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      setOrders(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load sales orders');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await salesOrderApi.delete(deleteId);
      toast.success('Sales order deleted');
      setDeleteId(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete this order');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Sales Orders"
        subtitle="Manage all orders from customers"
        actionLabel="New Sales Order"
        onAction={() => navigate('/sales-orders/new')}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by SO number or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '9px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none', minWidth: '160px' }}
        >
          {SO_STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
          ))}
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {loading ? <LoadingSpinner /> : orders.length === 0 ? (
          <EmptyState
            message="No sales orders found"
            actionLabel="Create First Order"
            onAction={() => navigate('/sales-orders/new')}
          />
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['SO Number', 'Customer', 'Phone', 'Order Date', 'Total Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderTop: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '14px 16px' }}>
                      <span onClick={() => navigate(`/sales-orders/${order.id}`)}
                        style={{ fontSize: '13px', fontWeight: '600', color: '#2563eb', cursor: 'pointer' }}>
                        {order.so_number}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{order.customer_name}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>{order.customer_phone || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>{formatDate(order.order_date)}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#111827' }}>{formatCurrency(order.total_amount)}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={order.status} type="so" /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => navigate(`/sales-orders/${order.id}`)}
                          style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', cursor: 'pointer', color: '#374151' }}>
                          View
                        </button>
                        {order.status === 'draft' && (
                          <button onClick={() => setDeleteId(order.id)}
                            style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #fecaca', borderRadius: '6px', background: '#fff', cursor: 'pointer', color: '#dc2626' }}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagination && pagination.total_pages > 1 && (
              <div style={{ padding: '14px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Showing {orders.length} of {pagination.total} orders</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    style={{ padding: '6px 14px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '6px', background: page === 1 ? '#f9fafb' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#374151' }}>← Prev</button>
                  <span style={{ padding: '6px 12px', fontSize: '13px', color: '#6b7280' }}>Page {page} of {pagination.total_pages}</span>
                  <button disabled={page === pagination.total_pages} onClick={() => setPage(p => p + 1)}
                    style={{ padding: '6px 14px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '6px', background: page === pagination.total_pages ? '#f9fafb' : '#fff', cursor: page === pagination.total_pages ? 'not-allowed' : 'pointer', color: '#374151' }}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Sales Order"
        message="This action cannot be undone. The sales order and all its items will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default SalesOrderListPage;