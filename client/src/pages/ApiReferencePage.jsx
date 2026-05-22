import React from 'react';
import { motion } from 'framer-motion';
import { Code, Globe, Lock, Cpu, Server, Zap } from 'lucide-react';

const ApiReferencePage = () => {
    const endpoints = [
        {
            method: 'POST',
            path: '/api/auth/register',
            desc: 'Register a new user account.',
            params: [
                { name: 'name', type: 'String', required: true },
                { name: 'email', type: 'String', required: true },
                { name: 'password', type: 'String', required: true },
            ],
            response: '{ "success": true, "token": "jwt_token..." }'
        },
        {
            method: 'POST',
            path: '/api/auth/login',
            desc: 'Authenticate user and get token.',
            params: [
                { name: 'email', type: 'String', required: true },
                { name: 'password', type: 'String', required: true },
            ],
            response: '{ "success": true, "token": "jwt_token..." }'
        },
        {
            method: 'POST',
            path: '/api/questions/extract',
            desc: 'Extract questions from a PDF file (Requires Auth).',
            params: [
                { name: 'file', type: 'File', required: true, desc: 'Multipart/form-data PDF file' },
            ],
            response: '{ "questions": [{ "text": "...", "options": [...] }] }'
        },
        {
            method: 'GET',
            path: '/api/analytics/summary',
            desc: 'Get user performance summary (Requires Auth).',
            params: [],
            response: '{ "totalTests": 12, "avgScore": 85, "accuracy": 92 }'
        }
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ 
                        display: 'inline-flex', 
                        padding: '12px 24px', 
                        backgroundColor: 'var(--bg-green)', 
                        border: 'var(--border-thick)', 
                        borderRadius: '30px', 
                        fontWeight: 900, 
                        marginBottom: '20px',
                        boxShadow: '4px 4px 0 #000'
                    }}
                >
                    <Zap size={20} style={{ marginRight: '10px' }} /> API DOCUMENTATION
                </motion.div>
                <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Build on <span className="highlight-yellow">MockMaster</span></h1>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#666', maxWidth: '700px', margin: '0 auto' }}>
                    Integrate our intelligent question extraction and test engine into your own applications with our robust REST API.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '80px' }}>
                <div style={{ padding: '30px', border: 'var(--border-thick)', borderRadius: 'var(--radius)', backgroundColor: '#fff', boxShadow: 'var(--shadow-offset)' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', backgroundColor: 'var(--bg-pink)', border: '2px solid #000', borderRadius: '8px' }}><Lock size={24} /></div>
                        <h3 style={{ margin: 0 }}>Authentication</h3>
                    </div>
                    <p style={{ fontWeight: 600, lineHeight: 1.6 }}>
                        All private endpoints require a JSON Web Token (JWT) passed in the <code style={{ backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>Authorization</code> header as a Bearer token.
                    </p>
                    <div style={{ backgroundColor: '#000', color: '#fff', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        Authorization: Bearer {'<your_token>'}
                    </div>
                </div>

                <div style={{ padding: '30px', border: 'var(--border-thick)', borderRadius: 'var(--radius)', backgroundColor: '#fff', boxShadow: 'var(--shadow-offset)' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', backgroundColor: 'var(--bg-blue)', border: '2px solid #000', borderRadius: '8px' }}><Globe size={24} /></div>
                        <h3 style={{ margin: 0 }}>Base URL</h3>
                    </div>
                    <p style={{ fontWeight: 600, lineHeight: 1.6 }}>
                        Use the following base URL for all API requests. Ensure you use HTTPS in production.
                    </p>
                    <div style={{ backgroundColor: '#000', color: 'var(--bg-green)', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800 }}>
                        https://api.mockmaster.ai/v1
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Endpoints Reference</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {endpoints.map((ep, idx) => (
                    <div key={idx} style={{ 
                        border: 'var(--border-thick)', 
                        borderRadius: 'var(--radius)', 
                        backgroundColor: '#fff', 
                        overflow: 'hidden',
                        boxShadow: '8px 8px 0 #000'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '20px', 
                            padding: '20px 30px', 
                            backgroundColor: ep.method === 'POST' ? 'var(--bg-yellow)' : 'var(--bg-green)',
                            borderBottom: '3px solid #000'
                        }}>
                            <span style={{ 
                                backgroundColor: '#000', 
                                color: '#fff', 
                                padding: '6px 12px', 
                                borderRadius: '4px', 
                                fontWeight: 900, 
                                fontSize: '0.8rem' 
                            }}>{ep.method}</span>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'monospace' }}>{ep.path}</span>
                            <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>{ep.desc}</span>
                        </div>
                        
                        <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            <div>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '15px' }}>Parameters</h4>
                                {ep.params.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                                <th style={{ padding: '10px 0' }}>Name</th>
                                                <th>Type</th>
                                                <th>Required</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ep.params.map((p, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                                    <td style={{ padding: '12px 0', fontWeight: 700, fontFamily: 'monospace' }}>{p.name}</td>
                                                    <td style={{ color: '#666' }}>{p.type}</td>
                                                    <td>{p.required ? <span style={{ color: '#ff5c5c', fontWeight: 900 }}>YES</span> : 'No'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: '#888', fontStyle: 'italic' }}>No parameters required.</p>
                                )}
                            </div>
                            
                            <div>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '15px' }}>Example Response</h4>
                                <div style={{ 
                                    backgroundColor: '#1a1a1a', 
                                    color: '#fff', 
                                    padding: '20px', 
                                    borderRadius: '12px', 
                                    fontFamily: 'monospace', 
                                    fontSize: '0.85rem',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {ep.response}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApiReferencePage;
