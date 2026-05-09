import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AccuracyTrendChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No trend data available yet.</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="accuracy" stroke="#1976d2" strokeWidth={3} dot={{ r: 5 }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="attemptNo" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default AccuracyTrendChart;
