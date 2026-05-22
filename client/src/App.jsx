import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'

const AnoAI = lazy(() => import('./components/ui/animated-shader-background'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const UploadPage = lazy(() => import('./pages/UploadPage'))
const ReviewPage = lazy(() => import('./pages/ReviewPage'))
const QuestionBankPage = lazy(() => import('./pages/QuestionBankPage'))
const TestConfigPage = lazy(() => import('./pages/TestConfigPage'))
const TestCanvasPage = lazy(() => import('./pages/TestCanvasPage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const AdminQuestionBankPage = lazy(() => import('./pages/AdminQuestionBankPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const DocsPage = lazy(() => import('./pages/DocsPage'))
const ApiReferencePage = lazy(() => import('./pages/ApiReferencePage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const AdminAnalyticsPage = lazy(() => import('./pages/AdminAnalyticsPage'))

// Routes that should lock the UI into exam mode (no navbar, footer, or scrolling)
const EXAM_ROUTES = ['/test-canvas'];

const PageLoader = () => (
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
    return <PageLoader />;
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hide navbar and animated background during exam */}
      {!isExamMode && <Navbar />}
      <main className="main-content" style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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
  return (
    <Suspense fallback={null}>
      <AnoAI />
    </Suspense>
  );
}

export default App

