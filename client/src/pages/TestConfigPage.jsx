import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { NOTIFICATION_TYPES, useNotifications } from '../context/NotificationContext';

const TestConfigPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [config, setConfig] = useState({
    subject: 'All',
    topic: 'All',
    difficulty: 'Mixed',
    count: 10,
    duration: 15,
    mode: 'Test',
    source: 'user'
  });

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/test/generate', { params: config });
      if (res.data.success) {
        addNotification({
          type: NOTIFICATION_TYPES.TEST_GENERATED,
          title: 'Mock test generated',
          body: `${config.count} questions • ${config.mode} mode • ${config.duration} min • source: ${config.source === 'bank' ? 'Global bank' : 'My collection'}`,
          link: '/test-canvas',
        });
        navigate('/test-canvas', {
          state: {
            attemptId: res.data.attemptId,
            duration: res.data.duration,
            mode: res.data.mode,
            questions: res.data.questions,
            config: config // Pass config back to canvas if needed
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate test');
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    width: '100%', padding: '12px', borderRadius: '12px',
    border: '3px solid #000', boxSizing: 'border-box',
    fontFamily: 'inherit', fontSize: '1rem', background: '#fff',
    fontWeight: '700', outline: 'none'
  };

  const inputStyle = {
    ...selectStyle
  };

  return (
    <div style={{ padding: '60px 20px', minHeight: '100vh', backgroundColor: 'var(--bg-beige)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Doodles */}
      <div className="doodle-star" style={{ top: '15%', left: '5%', backgroundColor: 'var(--bg-pink)', transform: 'rotate(-10deg)' }}></div>
      <div className="doodle-circle" style={{ bottom: '10%', right: '10%', width: '40px', height: '40px', backgroundColor: 'var(--bg-green)' }}></div>
      <div className="doodle-star" style={{ bottom: '25%', left: '12%', backgroundColor: 'var(--bg-yellow)', transform: 'rotate(20deg)' }}></div>

      <div className="stacked-card blue" style={{ maxWidth: '650px', margin: '0 auto', padding: '40px', backgroundColor: '#fff', position: 'relative', zIndex: 2 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Setup <span className="text-highlight">Mock Test</span></h1>

        {error && (
          <div style={{ backgroundColor: '#ff5c5c', border: '3px solid #000', padding: '15px', borderRadius: '12px', marginBottom: '30px', fontWeight: '800' }}>
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Question Source</label>
              <select name="source" value={config.source} onChange={handleChange} style={selectStyle}>
                <option value="user">My Collections</option>
                <option value="bank">Global Question Bank</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Difficulty</label>
              <select name="difficulty" value={config.difficulty} onChange={handleChange} style={selectStyle}>
                <option value="Mixed">Mixed</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'block', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Subject</label>
              <select name="subject" value={config.subject} onChange={handleChange} style={selectStyle}>
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Economics">Economics</option>
                <option value="General">General</option>
                <option value="General">Computer Science</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              {/* <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Topic (Optional)</label> */}
              {/* <input
                type="text"
                name="topic"
                placeholder="e.g. Thermodynamics"
                value={config.topic === 'All' ? '' : config.topic}
                onChange={(e) => setConfig({ ...config, topic: e.target.value || 'All' })}
                style={inputStyle}
              /> */}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Questions</label>
              <input type="number" name="count" min="1" max="100" value={config.count} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Time (mins)</label>
              <input type="number" name="duration" min="1" max="180" value={config.duration} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Test Mode</label>
            <select name="mode" value={config.mode} onChange={handleChange} style={selectStyle}>
              <option value="Test">Formal Test (Timed, Results at end)</option>
              <option value="Quiz">Quick Quiz (Instant feedback)</option>
            </select>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/dashboard')}
              style={{ flex: 1 }}
            >
              Back
            </button>
            <button type="submit" disabled={loading} className="btn-yellow" style={{ flex: 2 }}>
              {loading ? 'Preparing Test...' : 'Start Test Now!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestConfigPage;
