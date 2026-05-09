import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/legacy-auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error('Fetch user failed', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/legacy-auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    
    // Fetch user details immediately after login
    const userRes = await api.get('/legacy-auth/me');
    setUser(userRes.data.data);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/legacy-auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    
    // Fetch user details immediately after register
    const userRes = await api.get('/legacy-auth/me');
    setUser(userRes.data.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const guestLogin = async () => {
    try {
      const res = await api.post('/legacy-auth/guest-login');
      localStorage.setItem('token', res.data.token);
      
      const userRes = await api.get('/legacy-auth/me');
      setUser(userRes.data.data);
    } catch (error) {
      console.warn('Backend or MongoDB is unreachable! Injecting Offline preview user.');
      localStorage.setItem('token', 'OFFLINE_PREVIEW_TOKEN');
      setUser({ _id: '123456789', name: 'UI Previewer', email: 'offline@mockmaster.ai' });
    }
  };

  const adminLogin = async (email, password) => {
    const res = await api.post('/legacy-auth/admin-login', { email, password });
    localStorage.setItem('token', res.data.token);

    const userRes = await api.get('/legacy-auth/me');
    setUser(userRes.data.data);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, guestLogin, adminLogin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
