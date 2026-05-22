import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, HelpCircle, FileText, Phone, Github, Send } from 'lucide-react';

const SupportPage = () => {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>How can we <span className="highlight-green">help</span>?</h1>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#666' }}>We're here to help you get the most out of MockMaster. Choose a way to connect with us.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                {[
                    { icon: <Mail size={32} />, title: 'Email Support', desc: 'Get in touch with our support team for any technical issues or billing questions.', contact: 'Mail Us Here', href: 'mailto:sarveshkumarsinghhh6@gmail.com', color: 'var(--bg-pink)' },
                    { icon: <MessageCircle size={32} />, title: 'Community Discord', desc: 'Join our growing community of students and educators to share tips and get quick help.', contact: 'Join Discord', href: '#', color: 'var(--bg-orange)' },
                    { icon: <HelpCircle size={32} />, title: 'Help Center', desc: 'Browse our comprehensive guides and FAQs for instant answers to common questions.', contact: 'Browse FAQ', href: '/docs', color: 'var(--bg-cyan)' },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ transform: 'translateY(-10px)' }}
                        style={{
                            padding: '40px',
                            backgroundColor: '#fff',
                            border: 'var(--border-thick)',
                            borderRadius: 'var(--radius)',
                            boxShadow: '8px 8px 0 #000',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{
                            width: '90px',
                            height: '80px',
                            backgroundColor: item.color,
                            border: '2px solid #000',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 25px',
                            boxShadow: '4px 4px 0 #000'
                        }}>
                            {item.icon}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{item.title}</h3>
                        <p style={{ fontWeight: 600, color: '#666', lineHeight: 1.6, marginBottom: '25px' }}>{item.desc}</p>
                        <a
                            href={item.href}
                            style={{
                                textDecoration: 'none',
                                width: '100%',
                                display: 'block'
                            }}
                        >
                            <button style={{
                                width: '100%',
                                backgroundColor: item.color,
                                fontSize: item.contact.length > 20 ? '0.75rem' : '0.9rem',
                                padding: '12px 10px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {item.contact}
                            </button>
                        </a>
                    </motion.div>
                ))}
            </div>

            {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
                <div style={{ padding: '40px', backgroundColor: '#fff', border: 'var(--border-thick)', borderRadius: 'var(--radius)', boxShadow: '10px 10px 0 #000' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Send us a Message</h2>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>YOUR NAME</label>
                                <input type="text" placeholder="John Doe" style={{ padding: '12px 16px', border: '2px solid #000', borderRadius: '8px', fontWeight: 600 }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>EMAIL ADDRESS</label>
                                <input type="email" placeholder="john@example.com" style={{ padding: '12px 16px', border: '2px solid #000', borderRadius: '12px', fontWeight: 600 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>SUBJECT</label>
                            <select style={{ padding: '12px 16px', border: '2px solid #000', borderRadius: '8px', fontWeight: 600, backgroundColor: '#fff' }}>
                                <option>Technical Issue</option>
                                <option>Billing Question</option>
                                <option>Feature Request</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>MESSAGE</label>
                            <textarea placeholder="How can we help?" rows="5" style={{ padding: '12px 16px', border: '2px solid #000', borderRadius: '8px', fontWeight: 600, resize: 'none' }}></textarea>
                        </div>
                        <button type="submit" style={{ alignSelf: 'flex-start', marginTop: '10px', }}>
                            SEND MESSAGE <Send size={18} />
                        </button>
                    </form>
                </div>

                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { q: 'How do I reset my password?', a: 'You can reset your password by clicking the "Forgot Password" link on the login page.' },
                            { q: 'Is there a mobile app?', a: 'MockMaster is a progressive web app, meaning you can install it on your home screen for a native-like experience.' },
                            { q: 'Can I use MockMaster offline?', a: 'An internet connection is required for question extraction and cloud syncing, but you can take tests offline if they are already loaded.' },
                        ].map((faq, idx) => (
                            <div key={idx} style={{ padding: '25px', backgroundColor: '#f9f9f9', border: '2px solid #000', borderRadius: 'var(--radius)' }}>
                                <h4 style={{ margin: '0 0 10px', display: 'flex', gap: '10px' }}><span style={{ color: 'var(--bg-pink)' }}>Q:</span> {faq.q}</h4>
                                <p style={{ margin: 0, fontWeight: 600, color: '#444' }}>{faq.a}</p>
                            </div>
                        ))}
                    </div> */}

            <div style={{ marginTop: '40px', padding: '30px', border: 'var(--border-thick)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-purple)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ backgroundColor: '#000', color: '#fff', padding: '10px', borderRadius: '8px' }}><Github size={24} /></div>
                <div>
                    <h4 style={{ margin: 0 }}>Open Source</h4>
                    <p style={{ margin: 0, fontWeight: 600 }}>Report bugs or contribute on GitHub.</p>
                </div>
                <a
                    href="https://github.com/Sarrveshh6/MOCKMASTER"
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 'auto' }}
                >
                    <button className="neo-brutal-btn" style={{ backgroundColor: '#fff' }}>GITHUB</button>
                </a>
            </div>
        </div>
        //     </div>
        // </div>
    );
};

export default SupportPage;
