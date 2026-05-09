import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResultSummary from '../components/ResultSummary';
import api from '../services/api';
import { NOTIFICATION_TYPES, useNotifications } from '../context/NotificationContext';

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/test/result/${id}`);
        if (res.data.success) setResult(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch result');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResult();
  }, [id]);

  useEffect(() => {
    if (!result || !id) return;
    const acc = result.accuracy;
    if (acc == null || acc < 75) return;
    const key = `rank_notif_${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      return;
    }
    addNotification({
      type: NOTIFICATION_TYPES.RANK,
      title: 'Rank spotlight',
      body: `You reached ${Number(acc).toFixed(0)}% accuracy. Open Analytics to track your progress.`,
      link: '/analytics',
    });
  }, [result, id, addNotification]);

  if (loading) return <div>Loading Results...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!result) return <div>Result not found</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-beige)', position: 'relative' }}>
      {/* doodles */}
      <div className="doodle-star" style={{ top: '60px', left: '40px', transform: 'rotate(-20deg)', backgroundColor: 'var(--bg-blue)' }}></div>
      <div className="doodle-circle" style={{ bottom: '20%', right: '5%', backgroundColor: 'var(--bg-pink)' }}></div>

      <header className="hero-section" style={{ padding: '4rem 2rem', marginBottom: '40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '3rem' }}>Test <span className="text-highlight">Results</span></h1>
            <p style={{ margin: '10px 0 0', fontWeight: 600, fontSize: '1.2rem', opacity: 0.9 }}>
              Detailed breakdown of your performance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#fff' }}>Dashboard</button>
            <button className="btn-yellow" onClick={() => navigate('/test-config')}>Take Another →</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div className="stacked-card green" style={{ padding: '0', backgroundColor: '#fff', marginBottom: '50px' }}>
          <ResultSummary result={result} />
        </div>

        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px', borderBottom: '3px solid #000', display: 'inline-block', paddingBottom: '5px' }}>
          Answer Review
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {result.questionWiseResult.map((qr, idx) => {
            const isSkipped = qr.isSkipped;
            const isCorrect = qr.isCorrect;
            const statusColor = isCorrect ? 'var(--bg-green)' : isSkipped ? 'var(--bg-yellow)' : '#ff5c5c';
            const statusText  = isCorrect ? 'CORRECT' : isSkipped ? 'SKIPPED' : 'INCORRECT';
            const marksEarned = isCorrect ? '+4' : isSkipped ? '0' : '-1';
            const marksColor  = isCorrect ? '#2e7d32' : isSkipped ? '#555' : '#c62828';

            return (
              <div key={idx} className="stacked-card" style={{ padding: '25px', backgroundColor: '#fff' }}>
                {/* Question header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <p style={{ fontWeight: '800', fontSize: '1.05rem', margin: 0, flex: 1, lineHeight: 1.5 }}>
                    {idx + 1}. {qr.questionId?.questionText}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 16, flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: statusColor, border: '2px solid #000', borderRadius: '20px', fontWeight: 800 }}>
                      {statusText}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: marksColor }}>
                      {marksEarned} marks
                    </span>
                  </div>
                </div>

                {/* SKIPPED: just show correct answer */}
                {isSkipped ? (
                  <div style={{ padding: '10px 14px', background: '#f0fff4', border: '2px solid var(--bg-green)', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                    ✅ Correct Answer: <strong>{qr.questionId?.correctAnswer}</strong>
                  </div>
                ) : (
                  /* ATTEMPTED: show all options with highlights */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {qr.questionId?.options.map((opt, oIdx) => {
                      const isUserAns    = qr.userAnswer === opt;
                      const isCorrectAns = qr.questionId.correctAnswer === opt;

                      let bgColor = '#fff';
                      let borderColor = '#ddd';
                      let icon = '○';

                      if (isCorrectAns) { bgColor = '#d4edda'; borderColor = '#2e7d32'; icon = '✅'; }
                      else if (isUserAns) { bgColor = '#fde8e8'; borderColor = '#c62828'; icon = '❌'; }

                      return (
                        <div key={oIdx} style={{ padding: '11px 15px', backgroundColor: bgColor, border: `2px solid ${borderColor}`, borderRadius: '10px', display: 'flex', alignItems: 'center', fontWeight: (isUserAns || isCorrectAns) ? '700' : '500' }}>
                          <span style={{ marginRight: '14px', fontSize: '1.1rem' }}>{icon}</span>
                          <span style={{ flex: 1, fontSize: '1rem' }}>{opt}</span>
                          {isCorrectAns && <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 800, color: '#2e7d32' }}>CORRECT OPTION</span>}
                          {isUserAns && !isCorrectAns && <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 800, color: '#c62828' }}>YOUR ANSWER</span>}
                        </div>
                      );
                    })}

                    {/* Explanation only for wrong answers */}
                    {!isCorrect && qr.questionId?.explanation && (
                      <div style={{ marginTop: '14px', padding: '14px', backgroundColor: 'rgba(255,220,220,0.15)', borderLeft: '4px solid #c62828', borderRadius: '4px' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#333' }}>
                          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.7, display: 'block', marginBottom: '4px' }}>Why it's wrong</span>
                          {qr.questionId.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ResultPage;
