import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in (token exists), redirect to dashboard
    if (localStorage.getItem('token')) {
      navigate('/'); 
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.loginUser(email, password);
      
      // Handle flexible response structure
      let token, user;
      
      if (response.data?.data?.token) {
        // Structure: { data: { token, user } }
        token = response.data.data.token;
        user = response.data.data.user;
      } else if (response.data?.token) {
        // Structure: { token, user }
        token = response.data.token;
        user = response.data.user;
      } else {
        throw new Error('Invalid response structure from server');
      }

      if (!token || !user) {
        throw new Error('Missing token or user data in response');
      }
      
      // Store auth info
      localStorage.setItem('token', token);
      localStorage.setItem('user_role', user.role || 'staff');
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login successful!');
      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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
              disabled={isLoading}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none',
                opacity: isLoading ? 0.6 : 1
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
              disabled={isLoading}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none',
                opacity: isLoading ? 0.6 : 1
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '-8px', padding: '8px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '10px', background: isLoading ? '#93c5fd' : '#2563eb', color: '#fff', 
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