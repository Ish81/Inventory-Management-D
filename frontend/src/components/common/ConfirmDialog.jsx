/**
 * Modal confirmation dialog for destructive actions like delete.
 * Usage: <ConfirmDialog open={open} title="Delete Order" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setOpen(false)} />
 */
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '28px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '10px', color: '#111827' }}>
          {title}
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '8px 18px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '8px 18px',
              background: loading ? '#93c5fd' : '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;