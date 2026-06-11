import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in (token exists), redirect to /dashboard
    if (localStorage.getItem('token')) {
      navigate('/'); 
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.loginUser(email, password);
      // #region agent log
      fetch('http://127.0.0.1:7554/ingest/4f94b0ee-8c6b-4772-8deb-697210683d48',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'99ff6c'},body:JSON.stringify({sessionId:'99ff6c',hypothesisId:'A',location:'Login.jsx:handleLogin',message:'login response',data:{status:response.status,hasData:!!response.data,hasNestedData:!!response.data?.data,message:response.data?.message},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      // Depending on axios response structure (usually wrapped in response.data)
      const { token, user } = response.data.data ? response.data.data : response.data;
      
      // Store auth info
      localStorage.setItem('token', token);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to dashboard (assuming '/' is the dashboard)
      navigate('/');
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7554/ingest/4f94b0ee-8c6b-4772-8deb-697210683d48',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'99ff6c'},body:JSON.stringify({sessionId:'99ff6c',hypothesisId:'A',location:'Login.jsx:handleLogin',message:'login error',data:{status:err.response?.status,message:err.response?.data?.message,url:err.config?.url},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#111827', fontSize: '24px', fontWeight: '600' }}>
          Login
        </h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none'
              }}
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none'
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '-8px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '10px', background: '#2563eb', color: '#fff', 
              borderRadius: '6px', border: 'none', fontWeight: '500', cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '8px'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#4b5563' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
