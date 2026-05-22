import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AnoAI from './components/ui/animated-shader-background'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import ReviewPage from './pages/ReviewPage'
import QuestionBankPage from './pages/QuestionBankPage'
import TestConfigPage from './pages/TestConfigPage'
import TestCanvasPage from './pages/TestCanvasPage'
import ResultPage from './pages/ResultPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AdminQuestionBankPage from './pages/AdminQuestionBankPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DocsPage from './pages/DocsPage'
import ApiReferencePage from './pages/ApiReferencePage'
import BlogPage from './pages/BlogPage'
import SupportPage from './pages/SupportPage'
import AdminAnalyticsPage from './pages/AdminAnalyticsPage'

import Footer from './components/Footer'

// Routes that should lock the UI into exam mode (no navbar, footer, or scrolling)
const EXAM_ROUTES = ['/test-canvas'];

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isExamMode = EXAM_ROUTES.some(r => location.pathname.startsWith(r));

  // ── Exam Lockdown Effects ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isExamMode) return;

    // Block right-click
    const noCtx = (e) => e.preventDefault();
    document.addEventListener('contextmenu', noCtx);

    // Block common cheat shortcuts (Ctrl+C, Ctrl+U, F12, PrintScreen, etc.)
    const noKeys = (e) => {
      const blocked =
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey && ['u', 'U', 's', 'S', 'p', 'P', 'a', 'A'].includes(e.key));
      if (blocked) e.preventDefault();
    };
    document.addEventListener('keydown', noKeys);

    return () => {
      document.removeEventListener('contextmenu', noCtx);
      document.removeEventListener('keydown', noKeys);
    };
  }, [isExamMode]);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'var(--bg-beige)',
        fontFamily: 'var(--font-heading)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Loading MockMaster...</h2>
          <div className="doodle-pulse" style={{ marginTop: '20px', fontSize: '3rem' }}>🚀</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hide navbar and animated background during exam */}
      {!isExamMode && <Navbar />}
      <main className="main-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/api-reference" element={<ApiReferencePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/support" element={<SupportPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/questions" element={<QuestionBankPage />} />
            <Route path="/test-config" element={<TestConfigPage />} />
            <Route path="/test-canvas" element={<TestCanvasPage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/questions" element={<AdminQuestionBankPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          </Route>
        </Routes>
      </main>
      {/* Hide footer during exam */}
      {!isExamMode && <Footer />}
    </div>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ScrollToTop />
            {/* Hide animated background during exam (performance + focus) */}
            <AnoAIWrapper />
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

// Conditionally render the animated background shader only outside exam mode
function AnoAIWrapper() {
  const location = useLocation();
  const isExamMode = EXAM_ROUTES.some(r => location.pathname.startsWith(r));
  if (isExamMode) return null;
  return <AnoAI />;
}

export default App

