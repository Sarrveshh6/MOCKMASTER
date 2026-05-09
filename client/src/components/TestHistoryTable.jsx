import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestHistoryTable = ({ history }) => {
  const navigate = useNavigate();

  if (!history || history.length === 0) return <p>No historical tests found.</p>;

  return (
    <div style={{ overflowX: 'auto', border: '3px solid #000', borderRadius: '10px', boxShadow: '6px 6px 0 #000' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#fceb7b', borderBottom: '3px solid #000' }}>
          <tr>
            <th style={{ padding: '12px', fontWeight: '800' }}>Date</th>
            <th style={{ padding: '12px', fontWeight: '800' }}>Subject</th>
            <th style={{ padding: '12px', fontWeight: '800' }}>Mode</th>
            <th style={{ padding: '12px', fontWeight: '800' }}>Score</th>
            <th style={{ padding: '12px', fontWeight: '800' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, idx) => (
            <tr key={idx} style={{ borderBottom: '2px solid #e0e0e0' }}>
              <td style={{ padding: '12px' }}>{new Date(h.date).toLocaleDateString()}</td>
              <td style={{ padding: '12px' }}>{h.subject}</td>
              <td style={{ padding: '12px' }}>{h.mode}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{h.score} / {h.totalQuestions}</td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => navigate(`/result/${h._id}`)}
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestHistoryTable;
