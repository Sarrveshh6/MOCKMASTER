import React, { useState } from 'react';
import { Book, Shield, Terminal, HelpCircle, ChevronRight, Github, Info, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const DocsPage = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const sections = [
        { id: 'overview', title: 'Project Overview', icon: <Book size={20} /> },
        { id: 'getting-started', title: 'Getting Started', icon: <Terminal size={20} /> },
        { id: 'features', title: 'Features', icon: <Info size={20} /> },
        { id: 'licensing', title: 'Licensing', icon: <Shield size={20} /> },
        { id: 'faq', title: 'FAQ', icon: <HelpCircle size={20} /> },
    ];

    const content = {
        overview: (
            <div>
                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>MOCKMASTER</h1>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#444', lineHeight: 1.6 }}>
                    Intelligent Mock Test Generator from PDF Documents. Master your exams with AI-powered question extraction and realistic test simulations.
                </p>
                <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'var(--bg-green)', border: 'var(--border-thick)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-offset)' }}>
                    <h3 style={{ margin: 0 }}>Why MockMaster?</h3>
                    <p style={{ fontWeight: 600, marginBottom: 0 }}>
                        MockMaster uses advanced AI to parse your study materials and generate high-quality mock tests that mimic real exam patterns. Save hours of manual question creation.
                    </p>
                </div>
            </div>
        ),
        'getting-started': (
            <div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Getting Started</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        { step: '1', title: 'Clone the Repository', code: 'git clone https://github.com/Sarrveshh6/MOCKMASTER.git' },
                        { step: '2', title: 'Install Server Dependencies', code: 'npm install' },
                        { step: '3', title: 'Install Client Dependencies', code: 'cd client && npm install' },
                        { step: '4', title: 'Set up Environment Variables', code: 'cp .env.example .env' },
                        { step: '5', title: 'Run the Application', code: 'npm run dev' },
                    ].map((item, idx) => (
                        <div key={idx} style={{ padding: '1.5rem', border: 'var(--border-thin)', borderRadius: 'var(--radius)', backgroundColor: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <span style={{ width: '30px', height: '30px', backgroundColor: 'var(--bg-yellow)', border: '2px solid #000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 900 }}>{item.step}</span>
                                <h4 style={{ margin: 0 }}>{item.title}</h4>
                            </div>
                            <div style={{ backgroundColor: '#000', color: 'var(--bg-green)', padding: '12px 16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', overflowX: 'auto' }}>
                                {item.code}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        features: (
            <div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Core Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'AI Extraction', desc: 'Automatically extract MCQs, True/False, and Short Questions from PDFs.', color: 'var(--bg-pink)' },
                        { title: 'Exam Mode', desc: 'Real-time countdown, anti-cheat mechanisms, and realistic UI.', color: 'var(--bg-yellow)' },
                        { title: 'Analytics', desc: 'Deep insights into your performance with charts and progress tracking.', color: 'var(--bg-green)' },
                        { title: 'Question Bank', desc: 'Organize and manage your custom question sets easily.', color: 'var(--bg-blue)' },
                    ].map((f, idx) => (
                        <div key={idx} style={{ padding: '1.5rem', border: 'var(--border-thick)', borderRadius: 'var(--radius)', backgroundColor: f.color, boxShadow: '4px 4px 0 #000' }}>
                            <h3 style={{ marginTop: 0 }}>{f.title}</h3>
                            <p style={{ fontWeight: 600, marginBottom: 0 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
        licensing: (
            <div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Licensing</h2>
                <div style={{ padding: '2rem', border: 'var(--border-thick)', borderRadius: 'var(--radius)', backgroundColor: '#fff', boxShadow: 'var(--shadow-offset)' }}>
                    <h3 style={{ marginTop: 0 }}>ISC License</h3>
                    <p style={{ fontWeight: 700, color: '#666' }}>Copyright (c) 2026 Sarvesh Kumar Singh</p>
                    <div style={{ 
                        backgroundColor: '#f9f9f9', 
                        padding: '1.5rem', 
                        borderRadius: '8px', 
                        border: '1px dashed #000',
                        lineHeight: 1.6,
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem'
                    }}>
                        Permission to use, copy, modify, and/or distribute this software for any
                        purpose with or without fee is hereby granted, provided that the above
                        copyright notice and this permission notice appear in all copies.
                        <br /><br />
                        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
                        WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
                        MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
                        ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
                        WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
                        ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
                        OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
                    </div>
                </div>

                <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#000', borderRadius: 'var(--radius)', color: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h3 style={{ color: '#fff', margin: '0 0 10px' }}>Project Resources</h3>
                            <p style={{ margin: 0, color: '#aaa', fontWeight: 600 }}>Download the official project documentation and operation guides.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="/MockMaster_Project_Report.pdf" download style={{ textDecoration: 'none' }}>
                                <button className="neo-brutal-btn" style={{ backgroundColor: 'var(--bg-green)', color: '#000', fontSize: '0.85rem', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Download size={18} /> REPORT (PDF)
                                </button>
                            </a>
                            <a href="/MockMaster_User_Guide.docx" download style={{ textDecoration: 'none' }}>
                                <button className="neo-brutal-btn" style={{ backgroundColor: 'var(--bg-yellow)', color: '#000', fontSize: '0.85rem', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={18} /> GUIDE (DOCX)
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        ),
        faq: (
            <div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { q: 'Is MockMaster free to use?', a: 'Yes, the core features are free for personal use.' },
                        { q: 'What file formats are supported?', a: 'Currently, we support PDF documents for question extraction.' },
                        { q: 'Can I export my results?', a: 'Yes, you can view and download your detailed performance analytics.' },
                        { q: 'How accurate is the AI extraction?', a: 'We use state-of-the-art LLMs (OpenAI/Gemini) to ensure high accuracy, though we recommend a quick review of extracted questions.' },
                    ].map((item, idx) => (
                        <div key={idx} style={{ padding: '1.5rem', border: 'var(--border-thin)', borderRadius: 'var(--radius)', backgroundColor: '#fff' }}>
                            <h4 style={{ marginTop: 0, display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--bg-pink)' }}>Q:</span> {item.q}
                            </h4>
                            <p style={{ fontWeight: 600, margin: 0, display: 'flex', gap: '10px' }}>
                                <span style={{ color: 'var(--bg-green)' }}>A:</span> {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )
    };

    return (
        <div className="docs-page" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', display: 'flex', gap: '40px' }}>
            {/* Sidebar */}
            <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '120px', height: 'fit-content' }}>
                <div style={{ backgroundColor: '#fff', border: 'var(--border-thick)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: '6px 6px 0 #000' }}>
                    <h3 style={{ margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Book /> DOCUMENTATION
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                style={{
                                    justifyContent: 'flex-start',
                                    backgroundColor: activeSection === s.id ? 'var(--bg-yellow)' : 'transparent',
                                    boxShadow: activeSection === s.id ? '4px 4px 0 #000' : 'none',
                                    border: activeSection === s.id ? '2px solid #000' : '2px solid transparent',
                                    padding: '12px 16px',
                                    fontSize: '0.95rem',
                                    width: '100%'
                                }}
                            >
                                {s.icon}
                                <span style={{ marginLeft: '10px' }}>{s.title}</span>
                                {activeSection === s.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                            </button>
                        ))}
                    </div>
                    <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #eee' }} />
                    <a 
                        href="https://github.com/Sarrveshh6/MOCKMASTER" 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textDecoration: 'none',
                            color: '#000',
                            fontWeight: 800,
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#f0f0f0',
                            border: '2px solid #000'
                        }}
                    >
                        <Github size={20} /> View on GitHub
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {content[activeSection]}
                </motion.div>
            </div>
        </div>
    );
};

export default DocsPage;
