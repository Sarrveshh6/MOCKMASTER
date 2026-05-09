import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [questions, setQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Questions are Extracted redirecting to Practice page.');
      navigate('/dashboard');
      return;
    }

    if (location.state && location.state.questions) {
      const initialized = location.state.questions.map(q => ({ ...q, approved: false }));
      setQuestions(initialized);
    } else {
      alert('No questions found to review. Upload a document first.');
      navigate('/upload');
    }
  }, [location, navigate, user]);

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleToggleApprove = (index) => {
    const updated = [...questions];
    updated[index].approved = !updated[index].approved;
    setQuestions(updated);
  };

  const handleApproveAll = () => {
    setQuestions(questions.map(q => ({ ...q, approved: true })));
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to remove this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSaveApproved = async () => {
    const approvedQuestions = questions.filter(q => q.approved);
    if (approvedQuestions.length === 0) {
      alert('Please approve at least one question to save.');
      return;
    }
    const questionsToSave = approvedQuestions.map(({ approved, ...rest }) => rest);
    try {
      setIsSaving(true);
      const saveEndpoint = '/questions/bank';
      const res = await api.post(saveEndpoint, { questions: questionsToSave });
      if (res.data.success) {
        const successLabel = 'Successfully uploaded questions to the website Question Bank!';
        alert(`${successLabel} (${res.data.count})`);
        navigate('/questions');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save questions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-beige)', position: 'relative' }}>
      {/* doodles */}
      <div className="doodle-star" style={{ top: '50px', right: '50px', transform: 'rotate(15deg)' }}></div>
      <div className="doodle-circle" style={{ bottom: '100px', left: '30px', backgroundColor: 'var(--bg-blue)' }}></div>

      <header className="hero-section" style={{ marginBottom: '40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0 }}>Review <span className="text-highlight">Questions</span></h1>
            <p style={{ margin: '10px 0 0', fontWeight: 500, fontSize: '1.2rem', opacity: 0.9 }}>
              Review, edit, and approve AI-generated questions before saving them.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-ghost" onClick={handleApproveAll} style={{ backgroundColor: '#fff' }}>Approve All</button>
            <button className="btn-yellow" onClick={handleSaveApproved} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Approved →'}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div className="questions-list">
          {questions.length === 0 ? (
            <div className="stacked-card pink" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fff' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>No questions to display.</p>
              <button className="btn-yellow" style={{ marginTop: '1rem' }} onClick={() => navigate('/upload')}>Go back to Upload</button>
            </div>
          ) : (
            questions.map((q, i) => (
              <QuestionCard
                key={i}
                index={i}
                question={q}
                isReadOnly={!isAdmin}
                onChange={handleChange}
                onToggleApprove={handleToggleApprove}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
