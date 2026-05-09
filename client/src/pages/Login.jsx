import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Github, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, guestLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await guestLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login as guest');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!email || !password) {
      return setError('Please fill in both email and password first.');
    }
    setError('');
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login as admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Doodles */}
      <div className="doodle-star" style={{ top: '15%', left: '8%', transform: 'rotate(-15deg)' }}></div>
      <div className="doodle-star" style={{ bottom: '15%', right: '8%', backgroundColor: 'var(--bg-blue)', transform: 'rotate(20deg)' }}></div>
      <div className="doodle-circle" style={{ top: '25%', right: '15%' }}></div>
      <div className="doodle-circle" style={{ bottom: '25%', left: '12%', width: '30px', height: '30px', backgroundColor: 'var(--bg-green)', opacity: 0.5 }}></div>

      <div className="auth-form-container stacked-card pink">
        <div className="auth-header">
          <h2>Sign In</h2>
          <p>Master your exams with AI-powered mock tests.</p>
        </div>

        <div className="auth-body">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', cursor: 'pointer' }}>Forgot?</Link>
              </div>
              <div className="form-group-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ margin: '5px 0' }}>
              <label className="remember-me">
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-yellow" style={{ width: '100%', padding: '1rem' }}>
              {loading ? 'Authenticating...' : 'Sign In Now'}
            </button>

            {/* <button 
              type="button" 
              onClick={handleGuestLogin} 
              disabled={loading} 
              className="btn-dark" 
              style={{ width: '100%', padding: '1rem' }}
            >
              🚀 Continue as Guest
            </button> */}

            <button
              type="button"
              onClick={handleAdminLogin}
              disabled={loading}
              className="btn-blue"
              style={{ width: '100%', padding: '1rem' }}
            >
              🔐 Login as Admin
            </button>
          </form>

          {/* <div className="divider">OR USE SOCIAL LOGIN</div>

          <div className="social-btns">
            <button type="button" className="btn-pink" style={{ flex: 1, padding: '0.8rem' }}>
              <Github size={20} /> Github
            </button>
            <button type="button" className="btn-blue" style={{ flex: 1, padding: '0.8rem' }}>
              <Mail size={20} /> Google
            </button>
          </div> */}

          <p className="auth-switch">
            New here? <Link to="/register" style={{ fontWeight: 800, textDecoration: 'underline' }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
