import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title = 'No data found', subtitle = '', icon: Icon = FiInbox, action }) => (
  <div className="empty-state">
    <div className="empty-icon"><Icon /></div>
    <h5>{title}</h5>
    {subtitle && <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>{subtitle}</p>}
    {action && action}
  </div>
);

export default EmptyState;