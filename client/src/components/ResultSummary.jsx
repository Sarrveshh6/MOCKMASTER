import React from 'react';

const ResultSummary = ({ result }) => {
  const getScoreColor = (accuracy) => {
    if (accuracy >= 80) return '#2e7d32';
    if (accuracy >= 60) return '#e65100';
    return '#c62828';
  };

  const totalSeconds = result.timeTaken || 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const timeStr = hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    border: '3px solid #000',
    boxShadow: '6px 6px 0 #000',
    textAlign: 'center',
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      <div style={{ ...cardStyle, boxShadow: `6px 6px 0 ${getScoreColor(result.accuracy)}` }}>
        <h4 style={{ margin: '0 0 10px', color: '#666' }}>Final Score</h4>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#000' }}>
          {(result.correct * 4) - (result.incorrect * 1)} <span style={{ fontSize: '20px', color: '#555' }}>/ {result.totalQuestions * 4}</span>
        </div>
        {/* <div style={{ fontSize: '13px', color: '#777', marginTop: 4 }}>
          {result.correct} correct &times; 4 &minus; {result.incorrect} wrong &times; 1
        </div> */}
      </div>

      <div style={{ ...cardStyle, boxShadow: `6px 6px 0 ${getScoreColor(result.accuracy)}` }}>
        <h4 style={{ margin: '0 0 10px', color: '#666' }}>Accuracy</h4>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#000' }}>
          {result.accuracy.toFixed(1)}%
        </div>
      </div>

      <div style={{ ...cardStyle, boxShadow: '6px 6px 0 #fceb7b' }}>
        <h4 style={{ margin: '0 0 10px', color: '#666' }}>Time Taken</h4>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#000' }}>
          {timeStr}
        </div>
      </div>

      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
          <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✓ Correct</span>
          <span style={{ fontWeight: 'bold' }}>{result.correct}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
          <span style={{ color: '#c62828', fontWeight: 'bold' }}>✗ Incorrect</span>
          <span style={{ fontWeight: 'bold' }}>{result.incorrect}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#e65100', fontWeight: 'bold' }}>— Skipped</span>
          <span style={{ fontWeight: 'bold' }}>{result.skipped}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
