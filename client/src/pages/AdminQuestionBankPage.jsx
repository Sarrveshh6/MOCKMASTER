import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionBankTable from '../components/QuestionBankTable';

const PDFDropzone = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === 'application/pdf' || dropped.type.startsWith('image/'))) {
      onFileSelect(dropped);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('admin-file-input').click()}
      style={{
        border: `3px dashed ${isDragging ? '#000' : '#0004'}`,
        borderRadius: '16px',
        padding: '60px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragging ? '#F0F6FF' : '#fff',
        transition: 'all 0.2s',
        position: 'relative',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
      }}
    >
      <input
        id="admin-file-input"
        type="file"
        accept="application/pdf,image/*"
        style={{ display: 'none' }}
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
      {file ? (
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</div>
          <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--bg-green)' }}>
            Selected: {file.name}
          </p>
          <p style={{ fontWeight: 600, opacity: 0.6 }}>Click or drop another file to replace</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.3 }}>📁</div>
          <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Drag & drop PDF/Image here</p>
          <p style={{ fontWeight: 600, opacity: 0.6 }}>or click to browse from computer</p>
        </div>
      )}
    </div>
  );
};

const AdminQuestionBankPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('idle'); // idle, uploading, extracting, done
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({ subject: '', difficulty: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBankQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/questions', {
        params: { ...filters, source: 'bank' }
      });
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bank questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankQuestions();
  }, [filters.subject, filters.difficulty]);

  const handleUploadAndExtract = async () => {
    if (!file) return setError('Please select a file first.');
    
    setError('');
    setSuccess('');
    
    try {
      setStep('uploading');
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('mode', 'auto');

      const uploadRes = await api.post('/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!uploadRes.data.success) throw new Error(uploadRes.data.message);

      const { documentId } = uploadRes.data;
      setStep('extracting');

      const extractRes = await api.post('/pdf/extract', { 
        documentId, 
        isBankQuestion: true 
      });

      if (!extractRes.data.success) throw new Error(extractRes.data.message);

      setStep('done');
      setSuccess(`Successfully extracted and stored ${extractRes.data.count} questions in Global Bank!`);
      setFile(null);
      await fetchBankQuestions();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Processing failed');
      setStep('idle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bank question permanently?')) return;
    try {
      const res = await api.delete(`/questions/${id}`);
      if (res.data.success) {
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const isBusy = step === 'uploading' || step === 'extracting';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-beige)' }}>
      <header className="hero-section" style={{ padding: '4rem 2rem', marginBottom: '30px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Admin <span className="text-highlight">Portal</span></h1>
            <p style={{ marginTop: '10px', fontWeight: 600, opacity: 0.9 }}>
              Upload PDFs and images to automatically populate the Global Question Bank using AI.
            </p>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#fff' }}>
            Back to Dashboard
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 20px 60px', display: 'grid', gap: '24px' }}>
        {error && <div style={{ backgroundColor: '#ff5c5c', border: '3px solid #000', borderRadius: '12px', padding: '15px 20px', fontWeight: 800 }}>⚠️ {error}</div>}
        {success && <div style={{ backgroundColor: 'var(--bg-green)', border: '3px solid #000', borderRadius: '12px', padding: '15px 20px', fontWeight: 800 }}>✅ {success}</div>}

        <section className="stacked-card blue" style={{ backgroundColor: '#fff', padding: '30px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.8rem' }}>AI Bulk Upload</h2>
          <p style={{ marginBottom: '25px', fontWeight: 600, opacity: 0.7 }}>
            Upload a Previous Year Paper (PDF/JPG) and our AI will extract the questions, options, and explanations directly into the global collection.
          </p>
          
          <PDFDropzone onFileSelect={setFile} file={file} />

          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
            {isBusy && (
              <div style={{ fontWeight: 800, color: 'var(--bg-blue)', animation: 'pulse 1.5s infinite' }}>
                {step === 'uploading' ? '📤 Uploading file...' : '🧠 AI is extracting questions...'}
              </div>
            )}
            <button 
              className="btn-yellow" 
              onClick={handleUploadAndExtract} 
              disabled={!file || isBusy}
              style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
            >
              {isBusy ? 'Processing...' : 'Start Global Import'}
            </button>
          </div>
        </section>

        <section className="stacked-card green" style={{ backgroundColor: '#fff', padding: '25px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Current Global Collection</h2>
          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '20px' }}>
            <input
              value={filters.subject}
              onChange={(e) => setFilters((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Filter by subject"
              style={{ border: '3px solid #000', borderRadius: '10px', padding: '10px', fontWeight: 600 }}
            />
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
              style={{ border: '3px solid #000', borderRadius: '10px', padding: '10px', fontWeight: 700 }}
            >
              <option value="">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {loading ? (
            <p style={{ fontWeight: 800 }}>Loading bank questions...</p>
          ) : (
            <QuestionBankTable questions={questions} onDelete={handleDelete} />
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminQuestionBankPage;
