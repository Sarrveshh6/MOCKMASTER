const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const upload = require('./middleware/uploadMiddleware');
const { protect, admin } = require('./middleware/authMiddleware');
const pdfController = require('./controllers/pdfController');

dotenv.config();

function createApp(betterAuthHandler) {
  const app = express();

  // ─── Middleware ────────────────────────────────────────────────────────────────
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }));

  // Better Auth must run before body parsers (see better-auth Express docs).
  if (betterAuthHandler) {
    app.all('/api/auth/{*any}', betterAuthHandler);
  }

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ─── Health Check ──────────────────────────────────────────────────────────────
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', message: 'MOCKMASTER API is running 🚀' });
  });

  // ─── Routes (legacy JWT auth lives under /api/legacy-auth; Better Auth uses /api/auth/*) ──
  app.use('/api/legacy-auth', require('./routes/authRoutes'));
  app.use('/api/pdf', require('./routes/pdfRoutes'));
  app.use('/api/questions', require('./routes/questionRoutes'));
  app.use('/api/test', require('./routes/testRoutes'));
  app.use('/api/analytics', require('./routes/analyticsRoutes'));
  app.use('/api/blogs', require('./routes/blogRoutes'));

  app.post('/api/pdf/debug-parse', protect, admin, upload.single('pdf'), pdfController.debugParsePDF);

  // ─── Serve Static Frontend (Approach B) ─────────────────────────────────────────
  const path = require('path');
  const fs = require('fs');
  const clientDistPath = path.join(__dirname, 'client', 'dist');

  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // ─── 404 Handler ──────────────────────────────────────────────────────────────
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // ─── Global Error Handler ─────────────────────────────────────────────────────
  app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
}

module.exports = { createApp };
