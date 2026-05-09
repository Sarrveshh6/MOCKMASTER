import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Github, Mail, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
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

  return (
    <div className="auth-page">
      {/* Background Doodles */}
      <div className="doodle-star" style={{ top: '10%', right: '10%', backgroundColor: 'var(--bg-pink)', transform: 'rotate(15deg)' }}></div>
      <div className="doodle-star" style={{ bottom: '15%', left: '8%', backgroundColor: 'var(--bg-yellow)', transform: 'rotate(-20deg)' }}></div>
      <div className="doodle-circle" style={{ top: '20%', left: '12%', width: '30px', height: '30px', backgroundColor: 'var(--bg-blue)' }}></div>
      <div className="doodle-circle" style={{ bottom: '25%', right: '12%' }}></div>

      <div className="auth-form-container stacked-card pink">
        <div className="auth-header">
          <h2>Sign Up</h2>
          <p>Join MockMaster and boost your prep today.</p>
        </div>

        <div className="auth-body">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

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
              <label>Password</label>
              <div className="form-group-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="form-group-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-yellow" style={{ width: '100%', padding: '1rem', marginTop: '10px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="btn-dark"
              style={{ width: '100%', padding: '1rem' }}
            >
              🚀 Continue as Guest
            </button>
          </form>

          {/* <div className="divider">OR REGISTER WITH</div>

          <div className="social-btns">
            <button type="button" className="btn-pink" style={{ flex: 1, padding: '0.8rem' }}>
              <Github size={20} /> Github
            </button>
            <button type="button" className="btn-green" style={{ flex: 1, padding: '0.8rem' }}>
              <Mail size={20} /> Google
            </button>
          </div> */}

          <p className="auth-switch">
            Already have an account? <Link to="/login" style={{ fontWeight: 800, textDecoration: 'underline' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
