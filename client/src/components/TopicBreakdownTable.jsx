import React from 'react';
import WeakAreaBadge from './WeakAreaBadge';

const TopicBreakdownTable = ({ topics }) => {
  if (!topics || topics.length === 0) return <p>No topic data available yet.</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
          <tr>
            <th style={{ padding: '12px', color: '#333' }}>Topic</th>
            <th style={{ padding: '12px', color: '#333' }}>Attempted</th>
            <th style={{ padding: '12px', color: '#333' }}>Accuracy</th>
            <th style={{ padding: '12px', color: '#333' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((t, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#555' }}>{t.topic}</td>
              <td style={{ padding: '12px' }}>{t.totalAttempted}</td>
              <td style={{ padding: '12px', color: t.isWeak ? '#c62828' : '#2e7d32', fontWeight: 'bold' }}>
                {t.accuracy.toFixed(1)}%
              </td>
              <td style={{ padding: '12px' }}>
                {t.isWeak && <WeakAreaBadge label="Weak Area" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TopicBreakdownTable;
