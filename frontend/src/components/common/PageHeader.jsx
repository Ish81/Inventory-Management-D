import { useNavigate } from 'react-router-dom';

/**
 * Page title bar with optional back button and action button.
 * Usage: <PageHeader title="Purchase Orders" actionLabel="New Order" onAction={() => navigate('/purchase-orders/new')} />
 */
const PageHeader = ({ title, subtitle, actionLabel, onAction, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ←
          </button>
        )}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827' }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '9px 18px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          + {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
