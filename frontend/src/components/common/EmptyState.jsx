/**
 * Shown when a list has no items.
 * Usage: <EmptyState message="No purchase orders found" actionLabel="Create Order" onAction={() => navigate('/purchase-orders/new')} />
 */
const EmptyState = ({ message = 'No data found', actionLabel, onAction }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
  }}>
    <div style={{ fontSize: '48px' }}>📭</div>
    <p style={{ color: '#6b7280', fontSize: '15px' }}>{message}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        style={{
          marginTop: '8px',
          padding: '8px 20px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;