import { FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ title }) => (
  <header className="navbar-top">
    <div className="me-auto fw-semibold" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
      {title}
    </div>
    <div className="d-flex align-items-center gap-3">
      <button
        className="btn btn-sm"
        style={{ color: 'var(--text-muted)', background: 'none', border: 'none', fontSize: '1.1rem' }}
      >
        <FiBell />
      </button>
      <div
        style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
        }}
      >
        <FiUser />
      </div>
    </div>
  </header>
);

export default Navbar;