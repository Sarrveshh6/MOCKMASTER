import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            await api.post('/legacy-auth/forgotpassword', { email });
            setMessage('A reset link has been sent to your email (Check server terminal).');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container stacked-card pink" style={{ maxWidth: '450px' }}>
                <div className="auth-header">
                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontWeight: 700, fontSize: '0.9rem', marginBottom: '20px' }}>
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                    <h2>Reset Password</h2>
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <div className="auth-body">
                    {message && (
                        <div style={{ backgroundColor: '#A0FF9C', border: '2px solid #000', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 700 }}>
                            ✅ {message}
                        </div>
                    )}
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

                        <button type="submit" disabled={loading} className="btn-yellow" style={{ width: '100%', padding: '1rem', marginTop: '10px' }}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
