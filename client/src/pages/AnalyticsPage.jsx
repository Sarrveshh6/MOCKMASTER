import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AccuracyTrendChart from '../components/AccuracyTrendChart';
import TopicBreakdownTable from '../components/TopicBreakdownTable';
import TestHistoryTable from '../components/TestHistoryTable';
import {
  RealTimeInsights,
  OptimizationChart,
  RetentionAnalytics,
  VariantComparison,
  SuperchargedMetrics
} from '../components/Infographics';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [topics, setTopics] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [sumRes, topRes, histRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/topics'),
          api.get('/analytics/history')
        ]);
        if (sumRes.data.success) setSummary(sumRes.data.data);
        if (topRes.data.success) setTopics(topRes.data.data);
        if (histRes.data.success) setHistory(histRes.data.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-beige)', position: 'relative', overflowX: 'hidden' }}>
      {/* doodles */}
      <div className="doodle-star" style={{ top: '60px', right: '100px', backgroundColor: 'var(--bg-blue)', transform: 'rotate(10deg)' }}></div>
      <div className="doodle-circle" style={{ bottom: '150px', left: '40px', backgroundColor: 'var(--bg-pink)' }}></div>

      <header className="hero-section" style={{ padding: '4rem 2rem', marginBottom: '40px', backgroundColor: 'var(--bg-green)' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 max-w-[1200px] mx-auto">
          <div>
            <h1 style={{ margin: 0, fontSize: '3rem' }}>Performance <span className="text-highlight" style={{ backgroundColor: 'var(--bg-yellow)', boxShadow: '0 -0.5rem 0 inset var(--bg-yellow)' }}>Analytics</span></h1>
            <p style={{ margin: '10px 0 0', fontWeight: 600, fontSize: '1.2rem', opacity: 0.9 }}>
              Track your progress and identify areas for improvement.
            </p>
          </div>
          <button className="btn-ghost w-full md:w-auto text-center" onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#fff' }}>
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px 60px' }}>
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '80px' }}>
            <div className="stacked-card pink" style={{ padding: '25px', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 10px', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Total Tests Taken</h4>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#000', lineHeight: 1 }}>{summary.totalTests}</div>
            </div>
            <div className="stacked-card yellow" style={{ padding: '25px', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 10px', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Average Accuracy</h4>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#000', lineHeight: 1 }}>
                {summary.averageAccuracy.toFixed(1)}%
              </div>
            </div>
            <div className="stacked-card blue" style={{ padding: '25px', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 10px', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Highest Score</h4>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#000', lineHeight: 1 }}>
                {summary.highestScore} <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>/ {summary.highestScoreTotal || 0}</span>
              </div>
            </div>
            <div className="stacked-card green" style={{ padding: '25px', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 10px', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Questions Attempted</h4>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#000', lineHeight: 1 }}>{summary.totalQuestionsAttempted}</div>
            </div>
          </div>
        )}

        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900, maxWidth: '800px', margin: '0 auto' }}>
              Deep Performance <span className="text-highlight" style={{ backgroundColor: 'var(--bg-pink)' }}>Insights</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 mb-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <RealTimeInsights data={summary?.trendData?.map(t => ({ name: t.attemptNo, accuracy: t.accuracy }))} />
              <OptimizationChart data={history?.slice(0, 5).reverse().map((h, i) => ({ name: i + 1, score: h.score }))} />
            </div>
            <RetentionAnalytics 
                data={summary?.trendData?.map(t => ({ name: t.date, value: t.accuracy }))}
                stats={{
                    totalTests: summary?.totalTests,
                    avgAccuracy: summary?.averageAccuracy,
                    totalQuestions: summary?.totalQuestionsAttempted
                }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VariantComparison topics={topics} />
            <SuperchargedMetrics topics={topics} />
          </div>
        </section>

        {/* --- Existing Legacy Charts --- */}
        <div style={{ borderTop: '4px solid #000', paddingTop: '60px', marginTop: '60px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2.5rem' }}>Detailed Metrics</h2>

          <div className="stacked-card" style={{ padding: '30px', backgroundColor: '#fff', marginBottom: '50px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '1.5rem', fontWeight: 800 }}>Accuracy Trend (Last 10 Tests)</h3>
            <AccuracyTrendChart data={summary?.trendData} />
          </div>

          <div className="grid grid-cols-1 gap-10 mb-10">
            <div className="stacked-card blue p-4 md:p-8 bg-white">
              <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.5rem', fontWeight: 800 }}>Topic Breakdown</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px', fontWeight: 500 }}>
                Identifies weak areas <span style={{ fontWeight: 800, color: '#ff5c5c' }}>(Accuracy &lt; 50%)</span> that need more focus.
              </p>
              <div className="overflow-x-auto">
                <TopicBreakdownTable topics={topics} />
              </div>
            </div>
            <div className="stacked-card green p-4 md:p-8 bg-white">
              <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '1.5rem', fontWeight: 800 }}>Test History</h3>
              <div className="overflow-x-auto">
                <TestHistoryTable history={history} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
