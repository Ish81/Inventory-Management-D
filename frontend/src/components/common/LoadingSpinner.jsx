const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      border: '3px solid #e0e0e0',
      borderTopColor: '#2563eb',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#6b7280', fontSize: '14px' }}>{message}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;