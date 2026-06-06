const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-spinner-wrapper flex-column gap-2">
    <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }} />
    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{message}</p>
  </div>
);

export default LoadingSpinner;