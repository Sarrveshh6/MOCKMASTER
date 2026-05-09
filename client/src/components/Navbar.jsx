import React, { useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import {
    LayoutDashboard,
    BarChart2,
    BookOpen,
    ShieldCheck,
    Bell,
    User,
    LogOut,
    ChevronDown,
    X,
    Settings,
    CreditCard,
    History,
    LifeBuoy,
    FileText,
    HelpCircle
} from 'lucide-react';

const ProfileDrawer = ({ isOpen, onClose, user, onLogout, navigate }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000
                }}
            />

            {/* Drawer */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100vh',
                width: '100%',
                maxWidth: '380px',
                backgroundColor: '#fff',
                borderLeft: '4px solid #000',
                zIndex: 2001,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 0 rgba(0,0,0,0.1)',
                animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '3px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FCEB7B'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>PROFILE</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User Card */}
                <div style={{ padding: '30px 24px', textAlign: 'center', borderBottom: '2px solid #eee' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#F0A6CA',
                        border: '3px solid #000',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '6px 6px 0 #000'
                    }}>
                        <User size={40} />
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.4rem' }}>{user.name}</h3>
                    <p style={{ margin: 0, fontWeight: 600, color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
                    <div style={{
                        display: 'inline-block',
                        marginTop: '12px',
                        padding: '4px 12px',
                        backgroundColor: '#A0FF9C',
                        border: '2px solid #000',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                    }}>
                        {user.role?.toUpperCase() || 'USER'} PLAN
                    </div>
                </div>

                {/* Navigation Menu */}
                <div style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {[
                            { icon: <Settings size={18} />, label: 'Account Settings', to: '/dashboard' },
                            { icon: <CreditCard size={18} />, label: 'Analytics', to: '/analytics' },
                            { icon: <History size={18} />, label: 'About us', to: '/' },
                            { icon: <HelpCircle size={18} />, label: 'Help & Support', to: '/#faq' },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="profile-menu-item"
                                onClick={() => {
                                    onClose();
                                    navigate(item.to);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    transition: 'all 0.2s',
                                    border: '2px solid transparent'
                                }}
                            >
                                <div style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '8px', border: '1px solid #000' }}>
                                    {item.icon}
                                </div>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer / Logout */}
                <div style={{ padding: '24px', borderTop: '3px solid #000', backgroundColor: '#fff' }}>
                    <button
                        onClick={onLogout}
                        style={{
                            width: '100%',
                            backgroundColor: '#ff5c5c',
                            color: '#fff',
                            border: '3px solid #000',
                            boxShadow: '4px 4px 0 #000',
                            fontSize: '1.1rem'
                        }}
                    >
                        <LogOut size={20} />
                        <span>SIGN OUT</span>
                    </button>
                </div>

                <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .profile-menu-item:hover {
            background-color: #FCEB7B;
            border-color: #000;
            transform: translateX(4px);
            box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
          }
        `}</style>
            </div>
        </>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const notifAnchorRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logout();
            setProfileOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '95%',
                maxWidth: '1200px',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    border: '2px solid #000',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                    {/* Logo Section */}
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        color: '#000',
                        marginRight: 'auto'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#000',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#FCEB7B', borderRadius: '50%' }}></div>
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>MOCKMASTER</span>
                    </Link>

                    {/* Navigation Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '0 40px' }}>
                        {user && (
                            <>
                                <Link to="/dashboard" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    color: isActive('/dashboard') ? '#000000ff' : '#111',
                                    fontWeight: 800,
                                    fontSize: '0.9rem'
                                }}>
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>

                                <Link to="/test-config" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    color: isActive('/test-config') ? '#000' : '#111',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    // backgroundColor: '#A0FF9C',
                                    padding: '6px 12px',
                                    // border: '2px solid #000',
                                    borderRadius: '8px',
                                    // boxShadow: '2px 2px 0 #000'
                                }}>
                                    <FileText size={18} />
                                    <span>Take a Test</span>
                                </Link>


                                <Link to="/analytics" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    color: isActive('/analytics') ? '#000' : '#111',
                                    fontWeight: 800,
                                    fontSize: '0.9rem'
                                }}>
                                    <BarChart2 size={18} />
                                    <span>Analytics</span>
                                    <ChevronDown size={14} />
                                </Link>

                                <Link to="/questions" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    color: isActive('/questions') ? '#000' : '#111',
                                    fontWeight: 800,
                                    fontSize: '0.9rem'
                                }}>
                                    <BookOpen size={18} />
                                    <span>Practice</span>
                                </Link>

                                {user.role === 'admin' && (
                                    <Link to="/admin/questions" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        textDecoration: 'none',
                                        color: isActive('/admin/questions') ? '#000' : '#111',
                                        fontWeight: 800,
                                        fontSize: '0.9rem'
                                    }}>
                                        <ShieldCheck size={18} />
                                        <span>Admin Bank</span>
                                    </Link>
                                )}
                            </>
                        )}
                        {/* {!user && (
                            <div style={{ display: 'flex', gap: '20px', color: '#666', fontWeight: 700, fontSize: '0.9rem' }}>
                                <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
                                <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>How it works</a>
                                <a href="#faq" style={{ textDecoration: 'none', color: 'inherit' }}>About us</a>
                            </div>
                        )} */}
                    </div>

                    {/* Action Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
                        {user && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingRight: '15px', borderRight: '1px solid #eee' }}>
                                <div ref={notifAnchorRef} style={{ position: 'relative' }}>
                                    <button
                                        type="button"
                                        onClick={() => setNotifOpen((o) => !o)}
                                        aria-expanded={notifOpen}
                                        aria-haspopup="dialog"
                                        aria-label="Open notifications"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '4px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Bell size={22} style={{ color: '#000' }} strokeWidth={2.5} />
                                    </button>
                                    {unreadCount > 0 && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '-4px',
                                                right: '-6px',
                                                minWidth: '18px',
                                                height: '18px',
                                                padding: '0 4px',
                                                backgroundColor: '#ff5c5c',
                                                color: '#fff',
                                                borderRadius: '999px',
                                                border: '2px solid #fff',
                                                fontSize: '10px',
                                                fontWeight: 900,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                    <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} anchorRef={notifAnchorRef} />
                                </div>
                            </div>
                        )}

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ textAlign: 'right', display: 'none' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{user.name || 'User'}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>Standard Plan</div>
                                </div>
                                <div
                                    onClick={() => setProfileOpen(true)}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        backgroundColor: '#F0A6CA',
                                        border: '2px solid #000',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    <User size={20} />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        right: '0',
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: '#A0FF9C',
                                        border: '2px solid #000',
                                        borderRadius: '50%'
                                    }}></div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to="/login" className="neo-brutal-btn" style={{ padding: '8px 16px', fontSize: '0.8rem', backgroundColor: '#fff', textDecoration: 'none', color: '#000', border: '2px solid #000', borderRadius: '8px' }}>Login</Link>
                                <Link to="/register" className="neo-brutal-btn" style={{ padding: '8px 16px', fontSize: '0.8rem', backgroundColor: '#FCEB7B', textDecoration: 'none', color: '#000', border: '2px solid #000', borderRadius: '8px' }}>Join</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <ProfileDrawer
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={user}
                onLogout={handleLogout}
                navigate={navigate}
            />
        </>
    );
};

export default Navbar;

