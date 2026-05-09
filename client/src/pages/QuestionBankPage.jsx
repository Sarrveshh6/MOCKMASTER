import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const QuestionBankPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get view from URL query param (?view=bank or ?view=user)
  const queryParams = new URLSearchParams(location.search);
  const initialView = queryParams.get('view') === 'bank' ? 'bank' : 'user';

  const [view, setView] = useState(initialView);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attemptingGroup, setAttemptingGroup] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ subject: '', difficulty: '' });

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { ...filters, source: view };
      const res = await api.get('/questions', { params });
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [filters, view]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleViewChange = (newView) => {
    setView(newView);
    navigate(`/questions?view=${newView}`);
  };

  const handleDelete = async (id, skipConfirm = false) => {
    if (!skipConfirm && !window.confirm('Delete this question permanently?')) return;
    try {
      const res = await api.delete(`/questions/${id}`);
      if (res.data.success) {
        setQuestions(prev => prev.filter(q => q._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const groupedQuestions = useMemo(() => {
    let filtered = questions;
    
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = questions.filter(q => 
        q.questionText.toLowerCase().includes(term) ||
        (q.subject && q.subject.toLowerCase().includes(term)) ||
        (q.topic && q.topic.toLowerCase().includes(term))
      );
    }

    const groups = {};

    filtered.forEach((q) => {
      if (view === 'user') {
        const docId = q.documentId?._id || q.documentId;
        const fileName = q.documentId?.originalName;
        const key = docId || (q.source.includes('AI') ? 'ai-no-document' : 'manual-group');
        const label = fileName || (q.source.includes('AI') ? 'AI Extracted (Unknown PDF)' : 'Manual / Other Questions');
        
        if (!groups[key]) {
          groups[key] = { label, typeLabel: 'PDF Group', questions: [] };
        }
        groups[key].questions.push(q);
      } else {
        // Group by Subject for Global Bank
        const subject = q.subject || 'General';
        const topic = q.topic || 'General';
        
        if (!groups[subject]) {
          groups[subject] = { 
            label: subject, 
            typeLabel: 'Subject Module', 
            topics: {} 
          };
        }
        
        if (!groups[subject].topics[topic]) {
          groups[subject].topics[topic] = [];
        }
        groups[subject].topics[topic].push(q);
      }
    });

    if (view === 'user') {
      return Object.entries(groups)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => b.questions.length - a.questions.length);
    } else {
      // Hierarchical grouping for Bank View
      return Object.entries(groups).map(([subject, data]) => ({
        key: subject,
        label: subject,
        typeLabel: 'Subject Module',
        topicGroups: Object.entries(data.topics).map(([topicName, qs]) => ({
          name: topicName,
          questions: qs
        })).sort((a, b) => b.questions.length - a.questions.length)
      })).sort((a, b) => a.label.localeCompare(b.label));
    }
  }, [questions, view]);

  const handleAttemptGroup = async (groupOrTopic, isTopic = false) => {
    // For user view, we need a document ID.
    if (view === 'user' && (!groupOrTopic.key || groupOrTopic.key === 'ai-no-document' || groupOrTopic.key === 'manual-group')) {
      alert('This group has no linked PDF document to attempt from.');
      return;
    }

    try {
      const loadingKey = isTopic ? groupOrTopic.name : groupOrTopic.key;
      setAttemptingGroup(loadingKey);
      
      let res;
      if (view === 'user') {
        res = await api.post('/test/generate-by-document', {
          documentId: groupOrTopic.key,
          count: groupOrTopic.questions.length,
          mode: 'Test',
          source: 'user'
        });
      } else {
        // For Bank group (Subject or Topic)
        const subject = isTopic ? groupOrTopic.subject : groupOrTopic.label;
        const topic = isTopic ? groupOrTopic.name : '';
        const count = isTopic ? groupOrTopic.questions.length : 20;

        res = await api.get('/test/generate', {
          params: {
            subject,
            topic,
            count: Math.min(count, 30),
            mode: 'Test',
            source: 'bank'
          }
        });
      }

      if (res.data.success) {
        navigate('/test-canvas', {
          state: {
            attemptId: res.data.attemptId,
            duration: res.data.duration,
            mode: res.data.mode,
            questions: res.data.questions
          }
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate test from this group');
    } finally {
      setAttemptingGroup(null);
    }
  };

  const getSubjectColor = (subject) => {
    const colors = ['pink', 'green', 'blue', 'yellow'];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-beige)', position: 'relative' }}>
      {/* doodles */}
      <div className="doodle-star" style={{ top: '40px', right: '40px', backgroundColor: 'var(--bg-yellow)' }}></div>
      <div className="doodle-circle" style={{ bottom: '15%', left: '30px', backgroundColor: 'var(--bg-green)' }}></div>

      <header className="hero-section" style={{ padding: '3rem 2rem 2rem', marginBottom: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '3rem' }}>Question <span className="text-highlight">Bank</span></h1>
            <p style={{ margin: '10px 0 0', fontWeight: 600, fontSize: '1.1rem', opacity: 0.9 }}>
              {view === 'user' 
                ? 'Manage your curated collection of questions extracted from your PDFs.' 
                : 'Attempt Previous Year Questions (PYQs) pre-loaded by experts.'}
            </p>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#fff' }}>
            ← Back
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 60px' }}>
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '3px solid #000', paddingBottom: '15px' }}>
          <button 
            onClick={() => handleViewChange('user')}
            className={view === 'user' ? 'btn-dark' : 'btn-ghost'}
            style={{ padding: '10px 24px', border: '3px solid #000' }}
          >
            My Collection
          </button>
          <button 
            onClick={() => handleViewChange('bank')}
            className={view === 'bank' ? 'btn-dark' : 'btn-ghost'}
            style={{ padding: '10px 24px', border: '3px solid #000' }}
          >
            Global PYQ Bank 🚀
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>Search Collection</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }}>🔍</span>
              <input 
                type="text"
                placeholder="Search subjects or topics..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{ width: '100%', padding: '12px 12px 12px 45px', border: '3px solid #000', borderRadius: '12px', fontWeight: '700', outline: 'none', backgroundColor: '#fff' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>Subject</label>
            <select 
              name="subject" 
              value={filters.subject} 
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '12px', fontWeight: '800', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value="">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Economics">Economics</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>Difficulty</label>
            <select 
              name="difficulty" 
              value={filters.difficulty} 
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '12px', fontWeight: '800', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value="">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <style>
          {`
            .topic-row:hover {
              transform: translateX(8px);
              box-shadow: 6px 6px 0px #000;
              background-color: #fff !important;
            }
            .neo-brutal-btn {
              border: 2px solid #000 !important;
              box-shadow: 3px 3px 0px #000 !important;
              padding: 0.5rem 1rem !important;
              font-size: 0.85rem !important;
            }
          `}
        </style>

        {loading ? (
          <div className="stacked-card blue" style={{ backgroundColor: '#fff', padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>Searching the vaults...</p>
          </div>
        ) : groupedQuestions.length === 0 ? (
          <div className="stacked-card blue" style={{ backgroundColor: '#fff', padding: '60px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>No questions found in this collection.</p>
            <p style={{ fontWeight: 600, opacity: 0.7 }}>Try changing your filters or {view === 'user' ? 'upload a PDF' : 'check another subject'}.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {groupedQuestions.map((group) => (
              <div key={group.key} className={`stacked-card ${view === 'user' ? 'blue' : getSubjectColor(group.label)}`} style={{ backgroundColor: '#fff', padding: '0', overflow: 'hidden' }}>
                {/* Module Header */}
                <div style={{ padding: '20px 24px', borderBottom: '3px solid #000', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                        {group.typeLabel}
                      </div>
                      <h2 style={{ margin: 0, fontSize: '1.8rem', textTransform: 'capitalize' }}>
                        {group.label}
                      </h2>
                    </div>
                    {view === 'bank' && (
                      <button 
                        className="btn-dark neo-brutal-btn" 
                        onClick={() => handleAttemptGroup(group, false)}
                        disabled={attemptingGroup === group.key}
                      >
                        Practice All
                      </button>
                    )}
                  </div>
                </div>

                {/* Module Body */}
                <div style={{ padding: '24px' }}>
                  {view === 'user' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{group.questions.length} questions available</div>
                        <p style={{ margin: '4px 0 0', fontWeight: 600, opacity: 0.7 }}>Source: Extractions from your uploaded PDF</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-yellow"
                          onClick={() => handleAttemptGroup(group, false)}
                          disabled={attemptingGroup === group.key}
                        >
                          {attemptingGroup === group.key ? 'Starting...' : 'Attempt PDF'}
                        </button>
                        <button
                          className="btn-ghost"
                          onClick={() => {
                            if (window.confirm(`Delete all ${group.questions.length} questions from this collection?`)) {
                              group.questions.forEach((q) => handleDelete(q._id, true));
                            }
                          }}
                          style={{ backgroundColor: '#fff' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Bank View Topics List */
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {group.topicGroups.map((topic) => (
                        <div 
                          key={topic.name} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '14px 18px', 
                            backgroundColor: '#f8f8f8', 
                            border: '2px solid #000', 
                            borderRadius: '12px',
                            transition: 'all 0.2s'
                          }}
                          className="topic-row"
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{topic.name}</div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', opacity: 0.6 }}>{topic.questions.length} questions</div>
                          </div>
                          <button 
                            className="btn-yellow neo-brutal-btn"
                            onClick={() => handleAttemptGroup({ ...topic, subject: group.label }, true)}
                            disabled={attemptingGroup === topic.name}
                          >
                            {attemptingGroup === topic.name ? '...' : 'Quick Start'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBankPage;
