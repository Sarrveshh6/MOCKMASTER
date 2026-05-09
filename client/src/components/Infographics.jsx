import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';

const commonCardStyle = {
  backgroundColor: '#fff',
  border: '3px solid #000',
  borderRadius: '16px',
  boxShadow: '8px 8px 0px #000',
  padding: '24px',
  marginBottom: '20px',
  position: 'relative',
  overflow: 'hidden'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '3px solid #000',
        padding: '10px',
        boxShadow: '4px 4px 0px #000',
        fontWeight: 800
      }}>
        <p style={{ margin: 0 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: 0, color: p.color || p.fill }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RealTimeInsights = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: 'N/A', accuracy: 0 }
  ];

  return (
    <div style={commonCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Real-Time Accuracy</h3>
          <p style={{ margin: '5px 0 0', color: '#666', fontWeight: 600 }}>Tracking your test performance consistency.</p>
        </div>
      </div>
      
      <div style={{ border: '2px solid #eee', borderRadius: '12px', padding: '15px' }}>
        <h4 style={{ margin: '0 0 15px', fontSize: '1rem' }}>Accuracy over Last 7 Tests</h4>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="accuracy" stroke="#89CFF0" strokeWidth={4} dot={{ r: 6, fill: '#89CFF0', stroke: '#000', strokeWidth: 2 }} name="Accuracy" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const OptimizationChart = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: '1', score: 0 },
    { name: '2', score: 0 },
    { name: '3', score: 0 },
  ];

  return (
    <div style={{ ...commonCardStyle, minHeight: '300px' }}>
      <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#ff5c5c' }}>Learn.<br/>Improve.<br/>Excel.</h3>
      <p style={{ margin: '10px 0 0', color: '#666', fontWeight: 600, fontSize: '0.9rem' }}>Recent Test Scores Trend</p>
      <div style={{ width: '100%', height: 180, marginTop: '20px' }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="score" stroke="#A0FF9C" strokeWidth={4} dot={{ r: 4, fill: '#A0FF9C' }} name="Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RetentionAnalytics = ({ data, stats }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Day 1', value: 0 },
    { name: 'Day 5', value: 0 },
  ];

  return (
    <div style={{ ...commonCardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ borderLeft: '4px solid #000', paddingLeft: '15px', marginBottom: '20px' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
          Study Intensity: <span style={{ color: '#5c67ff' }}>{stats?.totalQuestions || 0}</span><br/>questions solved in recent attempts.
        </p>
      </div>

      <div style={{ position: 'relative', height: '300px', border: '2px solid #ff5c5c', borderRadius: '12px', padding: '10px' }}>
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          backgroundColor: '#fff', 
          border: '2px solid #eee', 
          borderRadius: '12px', 
          padding: '15px', 
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem', fontWeight: 700 }}>Overall Stats</p>
          <h4 style={{ margin: '5px 0', color: '#5c67ff', fontWeight: 800 }}>Global Assessment Score</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <span style={{ backgroundColor: '#5c67ff', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 800 }}>
                {stats?.avgAccuracy?.toFixed(1) || 0}%
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Average Accuracy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <span style={{ backgroundColor: '#5c67ff', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 800 }}>
                {stats?.totalTests || 0}
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tests Taken</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke="#5c67ff" strokeWidth={6} dot={{ r: 8, fill: '#5c67ff', stroke: '#fff', strokeWidth: 3 }} name="Accuracy" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>Consistency is King</h3>
        <p style={{ margin: '5px 0 0', color: '#666', fontWeight: 600 }}>Monitor your daily performance to maintain growth.</p>
      </div>
    </div>
  );
};

export const VariantComparison = ({ topics }) => {
  const topTopics = topics?.slice(0, 3) || [];

  return (
    <div style={commonCardStyle}>
      <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '1.5rem', fontWeight: 900 }}>Strength Analysis</h3>
      <div style={{ border: '2px solid #ff5c5c', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ff5c5c' }}>
              <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontWeight: 700 }}>Topic</th>
              <th style={{ padding: '15px', textAlign: 'center', color: '#666', fontWeight: 700 }}>Accuracy</th>
              <th style={{ padding: '15px', textAlign: 'center', color: '#666', fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {topTopics.map((t, i) => (
                <tr key={i} style={{ borderBottom: i < topTopics.length - 1 ? '1px solid #eee' : 'none' }}>
                    <td style={{ padding: '15px', fontWeight: 800 }}>{t.topic}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                        <span style={{ backgroundColor: t.isWeak ? '#ff5c5c' : '#A0FF9C', color: t.isWeak ? '#fff' : '#000', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                            {t.accuracy.toFixed(1)}%
                        </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 700, color: t.isWeak ? '#ff5c5c' : '#47d147' }}>
                        {t.isWeak ? 'Focus Needed' : 'Mastered'}
                    </td>
                </tr>
            ))}
            {topTopics.length === 0 && (
                <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No topic data available yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SuperchargedMetrics = ({ topics }) => {
  const chartData = topics?.slice(0, 5).map(t => ({
    name: t.topic.length > 15 ? t.topic.substring(0, 12) + '...' : t.topic,
    questions: t.totalAttempted
  })) || [];

  return (
    <div style={commonCardStyle}>
      <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '1.5rem', fontWeight: 900 }}>Knowledge Coverage</h3>
      <div style={{ border: '2px solid #ff5c5c', borderRadius: '12px', padding: '20px' }}>
        <h4 style={{ margin: '0 0 20px', color: '#666', fontSize: '1.1rem' }}>Questions Attempted by Topic</h4>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 700, fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
              <Bar dataKey="questions" fill="#5c67ff" radius={[4, 4, 0, 0]} barSize={20} name="Attempts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
