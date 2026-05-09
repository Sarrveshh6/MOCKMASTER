import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { NOTIFICATION_TYPES, useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

// ─── Dropzone Component (inline for reliability) ─────────────────────────────
const PDFDropzone = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (dropped && allowedTypes.includes(dropped.type)) {
      onFileSelect(dropped);
    } else {
      alert('Please drop a PDF or Image file (JPG, PNG).');
    }
  }, [onFileSelect]);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileSelect(selected);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('pdf-file-input').click()}
      style={{
        border: `3px dashed ${isDragging ? '#000' : '#aaa'}`,
        borderRadius: '12px',
        padding: '50px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragging ? '#f0f0f0' : '#fafafa',
        transition: 'all 0.2s',
      }}
    >
      <input
        id="pdf-file-input"
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}></div>
      {file ? (
        <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2a7a2a' }}>
          ✅ Selected: {file.name}
        </p>
      ) : (
        <>
          <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Drag &amp; drop PDF or Image here</p>
          <p style={{ opacity: 0.6, marginTop: '8px' }}>or click to browse</p>
          <p style={{ fontSize: '0.75rem', marginTop: '10px', opacity: 0.8, color: '#0066cc' }}>
            ✨ AI OCR enabled for scanned docs & screenshots
          </p>
        </>
      )}
    </div>
  );
};

// ─── Progress Steps ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 'idle', label: 'Ready', },
  { id: 'uploading', label: 'Uploading PDF...', },
  { id: 'parsing', label: 'Parsing Text...', },
  { id: 'extracting', label: 'AI Extracting Questions...' },
  { id: 'done', label: 'Done!', },
];


// ─── Main Upload Page ─────────────────────────────────────────────────────────
const UploadPage = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('idle');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [parsePreview, setParsePreview] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const navigate = useNavigate();

  const isBusy = ['uploading', 'parsing', 'extracting'].includes(step);

  useEffect(() => {
    let interval;
    if (isBusy) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isBusy]);

  const handleUpload = async (mode = 'auto') => {
    if (!file) return setError('Please select a file first.');
    const token = localStorage.getItem('token');
    if (!token || token === 'OFFLINE_PREVIEW_TOKEN') {
      setError('Please login with a real account to upload and extract PDF questions.');
      navigate('/login');
      return;
    }

    setError(null);
    setResult(null);
    setParsePreview(null);

    try {
      // Step 1: Upload the file
      setStep('uploading');
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('mode', mode); // Pass 'scanned' or 'auto'

      const uploadRes = await api.post('/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!uploadRes.data.success) throw new Error(uploadRes.data.message || 'Upload failed.');

      const { documentId, pageCount, charCount } = uploadRes.data;
      setStep('parsing');

      // Small delay so user sees the "parsing" step feedback
      await new Promise(r => setTimeout(r, 600));

      // Step 2: AI Question Extraction
      setStep('extracting');
      const extractRes = await api.post('/pdf/extract', { documentId });

      if (!extractRes.data.success) throw new Error(extractRes.data.message || 'Extraction failed.');

      const questions = extractRes.data.questions;
      setStep('done');
      setResult({ count: questions.length, pageCount });

      addNotification({
        type: NOTIFICATION_TYPES.QUESTION_PAPER,
        title: 'New question paper extracted',
        body: `${questions.length} questions from your PDF are ready to review.`,
        link: '/review',
      });

      // Navigate to review after brief delay
      setTimeout(() => {
        navigate('/review', { state: { questions } });
      }, 1800);

    } catch (err) {
      const status = err.response?.status;
      let msg = err.response?.data?.message || err.message || 'An unexpected error occurred.';

      if (status === 401) {
        msg = 'Your session expired or token is invalid. Please login again and retry.';
      } else if (msg.toLowerCase().includes('could not extract readable text')) {
        msg = 'This PDF appears image-based/scanned. Use a text-based PDF for now (OCR fallback is not enabled yet).';
      }

      setError(msg);
      setStep('idle');
    }
  };

  const handleDebugParse = async () => {
    if (!file) return setError('Please select a PDF file first.');
    const token = localStorage.getItem('token');
    if (!token || token === 'OFFLINE_PREVIEW_TOKEN') {
      setError('Please login with a real account to debug PDF parsing.');
      navigate('/login');
      return;
    }

    setError(null);
    setResult(null);
    setParsePreview(null);

    try {
      setIsDebugging(true);
      const formData = new FormData();
      formData.append('pdf', file);
      const res = await api.post('/pdf/debug-parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!res.data.success) throw new Error(res.data.message || 'Debug parse failed.');
      setParsePreview(res.data);
    } catch (err) {
      const status = err.response?.status;
      let msg = err.response?.data?.message || err.message || 'Debug parse failed.';
      if (status === 401) {
        msg = 'Your session expired or token is invalid. Please login again and retry.';
      }
      setError(msg);
    } finally {
      setIsDebugging(false);
    }
  };

  const currentStep = STEPS.find(s => s.id === step) || STEPS[0];
  const stepIndex = STEPS.findIndex(s => s.id === step);

  return (
    <div style={{
      padding: '60px 20px',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-beige, #f5f0e8)',
      fontFamily: 'var(--font-main, "Space Grotesk", sans-serif)',
    }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>

        {/* Header */}
        <h1 style={{ fontSize: '2.8rem', marginBottom: '0.5rem', fontWeight: 900 }}>
          Upload <span style={{
            background: 'var(--bg-pink, #ffb3c6)',
            padding: '0 8px',
            border: '3px solid #000',
            borderRadius: '6px',
          }}>AI-Powered</span> Extraction
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '40px', fontWeight: 500 }}>
          Upload your exam paper or study material. Our AI will extract and generate multiple-choice questions.
        </p>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#ff5c5c',
            border: '3px solid #000',
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontWeight: 800,
            fontSize: '0.95rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Success */}
        {result && (
          <div style={{
            backgroundColor: '#b8f5b8',
            border: '3px solid #000',
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontWeight: 800,
          }}>
            ✅ Extracted {result.count} questions from {result.pageCount} pages! Redirecting to review...
          </div>
        )}

        {parsePreview && (
          <div style={{
            backgroundColor: parsePreview.looksScanned ? '#ffe1a8' : '#b8f5b8',
            border: '3px solid #000',
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontWeight: 700
          }}>
            <div style={{ marginBottom: '8px' }}>
              🔎 Parse check: {parsePreview.pageCount} page(s), {parsePreview.charCount} chars
            </div>
            <div style={{ fontWeight: 600, marginBottom: '10px' }}>{parsePreview.message}</div>
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              padding: '10px',
              maxHeight: '170px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap'
            }}>
              {parsePreview.preview || '(No preview text extracted)'}
            </div>
          </div>
        )}

        {/* Main Card */}
        <div style={{
          background: '#fff',
          border: '3px solid #000',
          borderRadius: '16px',
          boxShadow: '6px 6px 0px #000',
          padding: '36px',
        }}>
          <PDFDropzone onFileSelect={setFile} file={file} />

          {/* Progress Steps (shown during processing) */}
          {isBusy && (
            <div style={{
              marginTop: '28px',
              padding: '20px',
              background: '#f9f9f9',
              border: '2px solid #000',
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                {STEPS.filter(s => s.id !== 'idle').map((s, i) => (
                  <div key={s.id} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      fontSize: '1.6rem',
                      opacity: stepIndex >= i + 1 ? 1 : 0.3,
                      transition: 'opacity 0.3s',
                    }}>{s.icon}</div>
                    <div style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      marginTop: '4px',
                      opacity: stepIndex >= i + 1 ? 1 : 0.4,
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{
                fontWeight: 800,
                fontSize: '1rem',
                textAlign: 'center',
                animation: 'pulse 1.5s infinite',
              }}>
                {currentStep.icon} {currentStep.label}
              </div>
              <div style={{
                textAlign: 'center',
                marginTop: '15px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#555'
              }}>
                <p style={{ marginTop: '5px', color: '#000', fontWeight: 800 }}>
                  ⏳ Estimated extraction time: ~2-3 minutes depending on file size.
                  <br />Larger files may take longer."Be patient."</p>
                <p style={{ marginTop: '5px', color: '#ff0000e9', fontWeight: 800 }}>
                  Time elapsed: {Math.floor(elapsedTime / 60)}m {(elapsedTime % 60).toString().padStart(2, '0')}s
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={isBusy}
              style={{
                padding: '0.8rem 2rem',
                background: 'transparent',
                border: '3px solid #000',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: isBusy ? 'not-allowed' : 'pointer',
                opacity: isBusy ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={handleDebugParse}
                disabled={!file || isBusy || isDebugging}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: !file || isBusy || isDebugging ? '#ddd' : '#bde0ff',
                  border: '3px solid #000',
                  borderRadius: '8px',
                  fontWeight: 800,
                  cursor: !file || isBusy || isDebugging ? 'not-allowed' : 'pointer',
                  boxShadow: !file || isBusy || isDebugging ? 'none' : '4px 4px 0px #000'
                }}
              >
                {isDebugging ? '🔎 Checking...' : '🔎 Debug Parse'}
              </button>
            )}
            <button
              onClick={() => handleUpload('auto')}
              disabled={!file || isBusy}
              style={{
                padding: '0.8rem 2.5rem',
                background: !file || isBusy ? '#ccc' : '#f4e04d',
                border: '3px solid #000',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: !file || isBusy ? 'not-allowed' : 'pointer',
                boxShadow: !file || isBusy ? 'none' : '4px 4px 0px #000',
                transition: 'all 0.15s',
              }}
            >
              {isBusy ? '⏳ Processing...' : 'Start Extraction'}
            </button>
          </div>

        </div>

        {/* Tips */}
        <div style={{
          marginTop: '28px',
          padding: '20px',
          border: '2px solid #000',
          borderRadius: '10px',
          background: 'var(--bg-green, #c8f5c8)',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          <strong>💡 Tips for best results:</strong>
          <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: 1.8 }}>
            <li>Standard PDFs with selectable text are the fastest and best results.</li>
            <li><strong>AI-Powered OCR:</strong> You can now upload screenshots (JPG/PNG) or scanned PDFs! Use the "Upload Scanned" button for these.</li>
            <li>Files up to 20MB are supported. OCR processing may take longer as it analyzes all pages.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
