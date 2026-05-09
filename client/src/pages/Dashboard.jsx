import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalTests: 0, questionsAttempted: 0, avgScore: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/summary');
        if (res.data.success) {
          setStats({
            totalTests: res.data.data.totalTests,
            questionsAttempted: res.data.data.totalQuestionsAttempted,
            avgScore: res.data.data.averageAccuracy.toFixed(1)
          });
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F0A6CA] border-3 border-black rounded-xl p-8 mb-10 shadow-[6px_6px_0px_#000]">
        {/* Doodles */}
        <div className="doodle-star doodle-pulse" style={{ top: '20px', right: '40px' }}></div>


        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl mb-4">
            Welcome back, <span className="highlight-yellow">{user?.name || 'Academic'}</span>!
          </h1>
          <p className="text-xl font-medium opacity-90 max-w-2xl">
            Ready to sharpen your skills? Generate a new test or pick up where you left off.
          </p>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-6 items-stretch">
          <div
            className="stacked-card green p-6 lg:p-8 cursor-pointer group h-full flex flex-col"
            onClick={() => navigate('/upload')}
          >
            <div className="border-3 border-black rounded-lg overflow-hidden h-[220px] lg:h-[240px] mb-6 shadow-[4px_4px_0px_#000] group-hover:shadow-[6px_6px_0px_#000] transition-all">
              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=300&fit=crop" alt="Upload" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl mb-2">Upload PDF</h3>
            <p className="text-lg mb-6 opacity-80 flex-grow">Generate mock tests instantly from your lecture notes and course materials.</p>
            <button className="btn-yellow w-full md:w-auto">Get Started &rarr;</button>
          </div>

          <div
            className="stacked-card yellow p-6 lg:p-8 cursor-pointer group h-full flex flex-col"
            onClick={() => navigate('/test-config')}
          >
            <div className="border-3 border-black rounded-lg overflow-hidden h-[220px] lg:h-[240px] mb-6 shadow-[4px_4px_0px_#000] group-hover:shadow-[6px_6px_0px_#000] transition-all">
              <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=300&fit=crop" alt="Test" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl mb-2">Take a Test</h3>
            <p className="text-lg mb-6 opacity-80 flex-grow">Start a new dynamic practice session from your personal question bank.</p>
            <button className="btn-pink w-full md:w-auto">Start Now &rarr;</button>
          </div>

          <div
            className="stacked-card pink p-6 lg:p-8 cursor-pointer group h-full flex flex-col md:col-span-1 xl:col-span-1"
            onClick={() => navigate('/questions?view=bank')}
          >
            <div className="border-3 border-black rounded-lg overflow-hidden h-[220px] lg:h-[240px] mb-6 shadow-[4px_4px_0px_#000] group-hover:shadow-[6px_6px_0px_#000] transition-all">
              <img src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&h=300&fit=crop" alt="PYQs" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl mb-2">Global PYQ Bank</h3>
            <p className="text-lg mb-6 opacity-80 flex-grow">Attempt previous year questions pre-loaded by experts. No upload needed!</p>
            <button className="btn-yellow w-full md:w-auto">Explore PYQs &rarr;</button>
          </div>

          {user?.role === 'admin' && (
            <div
              className="stacked-card green p-6 lg:p-8 cursor-pointer group h-full flex flex-col md:col-span-2 xl:col-span-1"
              onClick={() => navigate('/admin/questions')}
            >
              <div className="border-3 border-black rounded-lg overflow-hidden h-[220px] lg:h-[240px] mb-6 shadow-[4px_4px_0px_#000] group-hover:shadow-[6px_6px_0px_#000] transition-all bg-[#FFF4B3] flex items-center justify-center">
                <div style={{ fontSize: '3rem' }}>🛡️</div>
              </div>
              <h3 className="text-2xl mb-2">Admin Panel</h3>
              <p className="text-lg mb-6 opacity-80 flex-grow">Publish single questions or bulk JSON directly into the website question bank.</p>
              <button className="btn-yellow w-full md:w-auto">Open Admin &rarr;</button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="bg-white border-3 border-black rounded-xl p-10 shadow-[8px_8px_0px_#000] flex flex-col md:flex-row items-center justify-around gap-8 cursor-pointer hover:bg-gray-50 transition-colors group"
        onClick={() => navigate('/analytics')}
      >
        <div className="text-center group-hover:scale-105 transition-transform">
          <div className="text-6xl font-black mb-1">{stats.totalTests}</div>
          <div className="text-sm font-extrabold uppercase tracking-widest text-[#666]">Tests Taken</div>
        </div>

        <div className="hidden md:block w-1 h-20 bg-black rounded-full"></div>

        <div className="text-center group-hover:scale-105 transition-transform delay-75">
          <div className="text-6xl font-black mb-1">{stats.avgScore}%</div>
          <div className="text-sm font-extrabold uppercase tracking-widest text-[#666]">Avg. Accuracy</div>
        </div>

        <div className="hidden md:block w-1 h-20 bg-black rounded-full"></div>

        <div className="text-center group-hover:scale-105 transition-transform delay-150">
          <div className="text-6xl font-black mb-1">{stats.questionsAttempted}</div>
          <div className="text-sm font-extrabold uppercase tracking-widest text-[#666]">Qns Solved</div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
