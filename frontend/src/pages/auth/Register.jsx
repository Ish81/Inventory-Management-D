import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.registerUser(email, password, role);
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Registration failed. Please try again.';
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
          Register
        </h2>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              placeholder="user@example.com"
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

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none',
                opacity: isLoading ? 0.6 : 1
              }}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', background: '#fff',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#4b5563' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;