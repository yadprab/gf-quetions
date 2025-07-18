import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

let refreshTimeout;

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Token refresh failed');
      
      const data = await response.json();
      
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(
        refreshToken, 
        (data.expires_in - 60) * 1000
      );
      
      return data.access_token;
    } catch (err) {
      console.error('Token refresh error:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await refreshToken();
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userResponse = await fetch('/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userResponse.ok) throw new Error('Failed to fetch user');
        
        const userData = await userResponse.json();
        setUser(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      setUser(data.user);
      navigate('/dashboard');
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      clearTimeout(refreshTimeout);
      navigate('/login');
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    hasPermission,
    refreshToken,
  };
};

export default useAuth;
