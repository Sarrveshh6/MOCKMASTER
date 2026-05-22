import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Users,
    FileText,
    History,
    Settings,
    Terminal,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Activity
} from 'lucide-react';

const AdminAnalyticsPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const res = await api.get('/analytics/admin/stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error('Failed to load admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminStats();
    }, []);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-beige)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="doodle-pulse" style={{ fontSize: '3rem' }}>📊</div>
                    <h2 style={{ marginTop: '20px', fontWeight: 900 }}>Crunching System Data...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-beige)', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', marginBottom: '10px' }}
                        >
                            <ArrowLeft size={18} /> BACK TO DASHBOARD
                        </button>
                        <h1 style={{ fontSize: '3.5rem', margin: 0 }}>SYSTEM <span className="highlight-yellow">ANALYTICS</span></h1>
                    </div>
                    <div style={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '15px 25px', boxShadow: '6px 6px 0 #000' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bg-green)' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--bg-green)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                            <span style={{ fontWeight: 900, color: '#000' }}>SYSTEM ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                    {[
                        { label: 'Total Users', value: stats?.userCount, icon: <Users />, color: 'var(--bg-purple)' },
                        { label: 'Test Attempts', value: stats?.totalAttempts, icon: <Activity />, color: 'var(--bg-pink)' },
                        { label: 'Global PYQs', value: stats?.globalPyqCount, icon: <FileText />, color: 'var(--bg-blue)' },
                        { label: 'PDFs Uploaded', value: stats?.pdfCount, icon: <CheckCircle />, color: 'var(--bg-green)' }
                    ].map((m, i) => (
                        <div key={i} className="stacked-card" style={{ padding: '30px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ backgroundColor: m.color, padding: '15px', border: '2px solid #000', borderRadius: '12px' }}>
                                {m.icon}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#666', fontWeight: 800, textTransform: 'uppercase' }}>{m.label}</h4>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{m.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                    {/* Startup & System Logs */}
                    <div className="stacked-card" style={{ padding: '30px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <Terminal size={24} />
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>STARTUP & SYSTEM LOGS</h3>
                        </div>
                        <div style={{
                            backgroundColor: '#1a1a1a',
                            color: '#00ff00',
                            borderRadius: '12px',
                            padding: '20px',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            border: '4px solid #333'
                        }}>
                            {stats?.systemLogs?.length === 0 ? (
                                <div> No system logs found.</div>
                            ) : stats?.systemLogs?.map((log, i) => (
                                <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '4px' }}>
                                    <span style={{ color: '#888' }}>[{new Date(log.timestamp).toLocaleString()}]</span>
                                    <span style={{ color: log.event === 'SERVER_START' ? '#00ff00' : '#ffaa00', marginLeft: '10px', fontWeight: 'bold' }}>{log.event}</span>
                                    <span style={{ marginLeft: '10px', color: '#fff' }}>{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Test Results */}
                    <div className="stacked-card" style={{ padding: '30px', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <History size={24} />
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>RECENT TEST ATTEMPTS</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {stats?.recentResults?.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontWeight: 600 }}>No recent tests recorded.</div>
                            ) : stats?.recentResults?.map((res, i) => (
                                <div key={i} style={{ padding: '15px', border: '2px solid #eee', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800 }}>{res.userId?.name || 'Unknown User'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(res.completedAt).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{res.accuracy.toFixed(1)}%</div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: res.accuracy > 70 ? 'var(--bg-green)' : 'var(--bg-red)' }}>
                                            {res.accuracy > 70 ? 'PASSED' : 'RETRY'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Configuration Stats */}
                <div style={{ marginTop: '30px' }}>
                    <div className="stacked-card yellow" style={{ padding: '30px', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <Settings size={24} />
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>SYSTEM CONFIGURATIONS</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            <div style={{ padding: '20px', border: '3px solid #000', borderRadius: '12px', backgroundColor: 'var(--bg-cyan)' }}>
                                <h4 style={{ margin: '0 0 10px', fontWeight: 900 }}>GLOBAL QUESTION BANK</h4>
                                <p style={{ margin: '0 0 15px', fontWeight: 600 }}>Expert-verified Previous Year Questions available for all users.</p>
                                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats?.globalPyqCount} Questions</div>
                            </div>
                            <div style={{ padding: '20px', border: '3px solid #000', borderRadius: '12px', backgroundColor: 'var(--bg-orange)' }}>
                                <h4 style={{ margin: '0 0 10px', fontWeight: 900 }}>STORAGE ANALYTICS</h4>
                                <p style={{ margin: '0 0 15px', fontWeight: 600 }}>Total unique documents processed by the AI extraction engine.</p>
                                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats?.pdfCount} PDFs Processed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AdminAnalyticsPage;
