const StatCard = ({ label, value, icon: Icon, color = '#2d7dd2', bgColor = 'rgba(45,125,210,0.1)' }) => (
  <div className="stat-card">
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value ?? '—'}</div>
      </div>
      <div className="stat-icon" style={{ background: bgColor, color }}>
        <Icon />
      </div>
    </div>
  </div>
);

export default StatCard;