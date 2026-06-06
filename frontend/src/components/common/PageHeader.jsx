/**
 * Consistent page header with title, breadcrumb, and action button.
 */
const PageHeader = ({ title, breadcrumb, action }) => (
  <div className="page-header">
    <div>
      <h2>{title}</h2>
      {breadcrumb && (
        <nav>
          <ol className="breadcrumb mb-0 mt-1">
            <li className="breadcrumb-item">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dashboard</span>
            </li>
            <li className="breadcrumb-item active" style={{ fontSize: '0.8rem' }}>
              {breadcrumb}
            </li>
          </ol>
        </nav>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default PageHeader;