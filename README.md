# MockMaster 🎯
### Intelligent Mock Test Generator from PDF Documents

<div align="center">

![MockMaster Banner](https://img.shields.io/badge/MockMaster-v1.0.0-1D4ED8?style=for-the-badge&logo=bookstack&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-F59E0B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)

**Upload a PDF → AI extracts questions → You review → Generate mock tests → Track performance**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Screenshots](#-screenshots) • [Contributing](#-contributing)

</div>

---

## 📌 What is MockMaster?

MockMaster is a full-stack web application that transforms previous year question paper PDFs into interactive mock tests using AI. Students upload their PDF question papers, an AI (GPT-4o) extracts the MCQ questions, the user reviews and approves the extracted questions, and then generates randomized timed mock tests from the validated question bank.

> **Key Design Principle:** AI extraction is never saved automatically. Every question passes through a human review screen before entering the database. This ensures data quality.

---

## ✨ Features

### 📄 PDF Processing
- Upload PDF question papers (up to 20 MB)
- Automatic text extraction using `pdf-parse`
- Intelligent chunking for large documents

### 🤖 AI Question Extraction
- Powered by OpenAI GPT-4o
- Extracts: question text, 4 options, correct answer, difficulty level, topic
- Smart deduplication to avoid repeat questions across chunks

### ✅ Human-in-the-Loop Review
- Review every AI-extracted question before saving
- Edit question text, options, correct answer, difficulty, and topic
- Approve or reject individual questions
- Blocked save if correct answer is unknown (AI confidence too low)

### 📝 Mock Test Generation
- Filter by subject, difficulty, and number of questions
- Mixed difficulty mode (30% easy / 50% medium / 20% hard)
- Fisher-Yates shuffled for true randomization
- Custom time duration per test

### 🎮 Two Test Modes
| Feature | Quiz Mode | Test Mode |
|---|---|---|
| Answer feedback | Instant (per question) | After submission |
| Correct answer shown | Yes, immediately | Yes, in results |
| Use case | Learning & practice | Exam simulation |

### 📊 Performance Analytics
- Score, accuracy %, correct/incorrect/skipped counts
- Topic-wise performance breakdown
- Weak area detection (topics with < 50% accuracy)
- Full test history

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 18, React Router v6, Axios, Tailwind CSS, Recharts |
| **Backend** | Node.js 20 LTS, Express.js 4 |
| **Database** | MongoDB + Mongoose |
| **AI** | OpenAI API (GPT-4o) |
| **Auth** | JWT (HS256) + bcryptjs |
| **PDF Parse** | pdf-parse |
| **File Upload** | Multer |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20 LTS or higher
- MongoDB (local or Atlas)
- OpenAI API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Sarrveshh6/MOCKMASTER.git
cd MOCKMASTER
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mockmaster

# Auth
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-proj-...

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=20971520
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Create the Uploads Folder

```bash
mkdir server/uploads
```

### 5. Run the Application

```bash
# From the root directory (runs both client and server)
npm run dev
```

Or run separately:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

### 6. Open in Browser

```
http://localhost:5173
```

---

## 📁 Project Structure

```
mockmaster/
├── client/                     ← React frontend (Vite)
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── UploadPage.jsx
│       │   ├── ReviewPage.jsx      ← Human review screen
│       │   ├── TestConfigPage.jsx
│       │   ├── TestPage.jsx
│       │   ├── ResultsPage.jsx
│       │   └── AnalyticsPage.jsx
│       ├── components/
│       │   ├── QuestionCard.jsx
│       │   ├── CountdownTimer.jsx
│       │   ├── TopicBarChart.jsx
│       │   └── ProtectedRoute.jsx
│       ├── hooks/
│       ├── services/api.js         ← Axios instance
│       └── context/AuthContext.jsx
│
├── server/                     ← Node.js + Express backend
│   ├── models/                 ← Mongoose schemas
│   ├── routes/                 ← API route definitions
│   ├── controllers/            ← Request handlers
│   ├── services/               ← Business logic
│   │   ├── aiService.js        ← OpenAI integration
│   │   ├── pdfExtractor.js     ← pdf-parse wrapper
│   │   ├── testEngine.js       ← Test generation algorithm
│   │   └── evaluationService.js
│   ├── middleware/
│   └── server.js
│
├── .env                        ← Do not commit
└── README.md
```

---

## 🔌 API Reference

All endpoints follow the response format:

```json
// Success
{ "success": true, "data": { ... }, "message": "..." }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

Protected routes require: `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register new user |
| `POST` | `/api/auth/login` | No | Login and get JWT |
| `GET` | `/api/auth/me` | Yes | Get current user |
| `POST` | `/api/pdf/upload` | Yes | Upload PDF file |
| `POST` | `/api/pdf/:pdfId/extract` | Yes | Extract questions via AI |
| `POST` | `/api/questions/save` | Yes | Save approved questions |
| `GET` | `/api/questions` | Yes | Get question bank |
| `PUT` | `/api/questions/:id` | Yes | Edit a question |
| `DELETE` | `/api/questions/:id` | Yes | Delete a question |
| `GET` | `/api/test/generate` | Yes | Generate mock test |
| `POST` | `/api/test/submit` | Yes | Submit test answers |
| `POST` | `/api/test/quiz-answer` | Yes | Submit single answer (quiz mode) |
| `GET` | `/api/results/:attemptId` | Yes | Get test result |
| `GET` | `/api/analytics/dashboard` | Yes | Dashboard stats |
| `GET` | `/api/analytics/topics` | Yes | Topic-wise analytics |

---

## 🗺 User Flow

```
Register / Login
      ↓
Upload PDF  →  AI Extracts Questions  →  Review & Approve
                                                ↓
                                         Saved to Question Bank
                                                ↓
                              Configure Test (subject / difficulty / count)
                                                ↓
                              Attempt Test (Quiz Mode or Test Mode)
                                                ↓
                              View Results + Topic Breakdown
                                                ↓
                              Analytics Dashboard (Weak Areas)
```

---

## 🗄 Database Collections

| Collection | Purpose |
|---|---|
| `users` | Auth, roles |
| `pdfdocuments` | Uploaded PDFs + extraction status |
| `questions` | Approved question bank |
| `testattempts` | Active and completed test sessions |
| `answers` | Per-question answer records |
| `results` | Final scores and topic breakdowns |

---

## 🧠 How the AI Extraction Works

1. PDF text is extracted using `pdf-parse`
2. Text is cleaned (remove page numbers, extra whitespace)
3. Text is chunked into ~3000-character segments with 200-char overlap
4. Each chunk is sent to GPT-4o with a strict structured prompt
5. GPT-4o returns a JSON array of questions with options, correct answer, difficulty, and topic
6. Output is validated (wrong shape = discarded, not crashed)
7. Duplicate questions across chunks are removed using Dice coefficient similarity
8. The full list is returned to the frontend for **user review — not saved yet**

---

## ⚙️ Scripts

```bash
# Root
npm run dev          # Run client + server concurrently

# Server
npm run dev          # nodemon server.js
npm run start        # node server.js

# Client
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt (cost factor 12)
- JWT tokens expire in 7 days
- All private routes protected by auth middleware
- PDF MIME type and file size validated before upload
- Users can only access their own questions and test attempts
- `passwordHash` field is `select: false` — never returned in API responses

---

## 🚧 Known Limitations (v1.0)

- Scanned/image-based PDFs are not supported (text-selectable PDFs only)
- AI extraction accuracy depends on PDF formatting quality
- No real-time collaboration — question banks are per-user only
- English-language PDFs only in the current version

---

## 🔮 Planned Features

- [ ] OCR support for scanned PDFs
- [ ] Adaptive testing (difficulty adjusts based on live performance)
- [ ] Question bank sharing between educators and students
- [ ] Auto difficulty calibration based on aggregate performance data
- [ ] Mobile app (React Native)
- [ ] Multi-language PDF support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing structure and does not break any existing functionality.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Sarrvesh**
- GitHub: [@Sarrveshh6](https://github.com/Sarrveshh6)

---

## 🎓 Academic Note

MockMaster is a final-year BCA project. It is built for academic purposes and demonstrates full-stack web development with AI integration, human-in-the-loop design patterns, and real-time performance analytics.

---

<div align="center">

Made with ❤️ for students who are tired of manually creating mock tests.

⭐ Star this repo if you found it useful!

</div>
