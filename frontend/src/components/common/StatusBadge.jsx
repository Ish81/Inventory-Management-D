import { PO_STATUSES, SO_STATUSES } from '../../utils/constants';

/**
 * Colored pill badge showing order status.
 * Usage: <StatusBadge status="approved" type="po" />
 */
const StatusBadge = ({ status, type = 'po' }) => {
  const statusMap = type === 'po' ? PO_STATUSES : SO_STATUSES;
  const config = statusMap[status] || {
    label: status,
    color: '#666',
    bg: '#eee',
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        color: config.color,
        backgroundColor: config.bg,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;