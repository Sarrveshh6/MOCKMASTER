import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Share2, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BlogPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'AI & Education',
        color: 'var(--bg-orange)'
    });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/blogs');
            if (res.data.success) {
                setPosts(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch blogs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                category: post.category,
                color: post.color
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                category: 'AI & Education',
                color: 'var(--bg-orange)'
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPost) {
                await api.put(`/blogs/${editingPost._id}`, formData);
            } else {
                await api.post('/blogs', formData);
            }
            setShowModal(false);
            fetchPosts();
        } catch (err) {
            console.error('Failed to save blog', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/blogs/${id}`);
                fetchPosts();
            } catch (err) {
                console.error('Failed to delete blog', err);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <div>
                    <h1 style={{ fontSize: '4.5rem', marginBottom: '10px' }}>THE <span className="highlight-pink">MOCK</span> BLOG</h1>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#666' }}>Insights, updates, and study tips from the MockMaster team.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {isAdmin && (
                        <button 
                            className="neo-brutal-btn" 
                            style={{ backgroundColor: 'var(--bg-green)', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => handleOpenModal()}
                        >
                            <Plus size={20} /> NEW POST
                        </button>
                    )}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['All', 'AI', 'Tips', 'News'].map((cat) => (
                            <button key={cat} className="neo-brutal-btn" style={{ backgroundColor: '#fff' }}>{cat}</button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="doodle-pulse" style={{ fontSize: '3rem' }}>⏳</div>
                    <h2 style={{ marginTop: '20px' }}>Loading Articles...</h2>
                </div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '3px dashed #ccc' }}>
                   <div style={{ fontSize: '4rem' }}>📭</div>
                   <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>No articles found</h2>
                   <p style={{ fontWeight: 600, color: '#666' }}>{isAdmin ? "Start by adding your first post!" : "Check back later for new updates."}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                    {posts.map((post, idx) => (
                        <motion.div
                            key={post._id}
                            whileHover={{ transform: 'translate(-5px, -5px)', boxShadow: '12px 12px 0 #000' }}
                            style={{
                                padding: '30px',
                                backgroundColor: '#fff',
                                border: 'var(--border-thick)',
                                borderRadius: 'var(--radius)',
                                boxShadow: '6px 6px 0 #000',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            {isAdmin && (
                                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px', zIndex: 10 }}>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(post); }}
                                        style={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: '6px', padding: '6px' }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                                        style={{ backgroundColor: 'var(--bg-red)', border: '2px solid #000', borderRadius: '6px', padding: '6px', color: '#fff' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                            <div style={{
                                width: '100%',
                                height: '200px',
                                backgroundColor: post.color || 'var(--bg-orange)',
                                border: '2px solid #000',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem'
                            }}>
                                📝
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>{post.category}</span>
                            </div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '15px', lineHeight: 1.2 }}>{post.title}</h3>
                            <p style={{ fontWeight: 600, color: '#444', lineHeight: 1.5, marginBottom: '25px', flex: 1 }}>{post.excerpt}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Calendar size={16} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Share2 size={18} style={{ cursor: 'pointer' }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                backgroundColor: '#fff',
                                border: '4px solid #000',
                                borderRadius: '20px',
                                padding: '40px',
                                boxShadow: '12px 12px 0 #000',
                                position: 'relative',
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>{editingPost ? 'EDIT POST' : 'NEW POST'}</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ fontWeight: 900, display: 'block', marginBottom: '8px' }}>TITLE</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '10px', fontWeight: 700 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 900, display: 'block', marginBottom: '8px' }}>EXCERPT (Summary)</label>
                                    <textarea 
                                        required
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '10px', fontWeight: 700, minHeight: '80px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 900, display: 'block', marginBottom: '8px' }}>CONTENT (Markdown/HTML supported)</label>
                                    <textarea 
                                        required
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '10px', fontWeight: 700, minHeight: '150px' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ fontWeight: 900, display: 'block', marginBottom: '8px' }}>CATEGORY</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '10px', fontWeight: 700 }}
                                        >
                                            <option>AI & Education</option>
                                            <option>Study Tips</option>
                                            <option>Tech</option>
                                            <option>Announcements</option>
                                            <option>Science</option>
                                            <option>Guides</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 900, display: 'block', marginBottom: '8px' }}>THEME COLOR</label>
                                        <select 
                                            value={formData.color}
                                            onChange={(e) => setFormData({...formData, color: e.target.value})}
                                            style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '10px', fontWeight: 700 }}
                                        >
                                            <option value="var(--bg-orange)">Orange</option>
                                            <option value="var(--bg-yellow)">Yellow</option>
                                            <option value="var(--bg-cyan)">Cyan</option>
                                            <option value="var(--bg-purple)">Purple</option>
                                            <option value="var(--bg-green)">Green</option>
                                            <option value="var(--bg-pink)">Pink</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn-yellow" style={{ marginTop: '20px' }}>
                                    {editingPost ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Newsletter section remains same */}
            <div style={{ marginTop: '80px', textAlign: 'center', padding: '60px', backgroundColor: '#000', borderRadius: 'var(--radius)', color: '#fff' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '20px' }}>Want to stay updated?</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#aaa' }}>Join our newsletter to get the latest study tips and product updates directly in your inbox.</p>
                <div style={{ display: 'flex', gap: '15px', maxWidth: '500px', margin: '0 auto' }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style={{
                            flex: 1,
                            padding: '15px 20px',
                            borderRadius: 'var(--radius)',
                            border: 'none',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)'
                        }}
                    />
                    <button className="btn-yellow">SUBSCRIBE</button>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
