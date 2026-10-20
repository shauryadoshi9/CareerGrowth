# CareerGrowth: AI-Powered Skill Mapping & Employability Platform

> **Hack for Social Cause 2026 (Innovate for Bharat)**  
> **Team Name:** Tatva | **Team ID:** `HSC|GJ|00051`  
> **Team Lead:** Shaurya Doshi | **Institute:** Dharmsinh Desai University (DDU), Nadiad, Gujarat  

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shauryadoshi9/CareerGrowth)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![NodeJS](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)

---

## One-Paragraph Summary

**CareerGrowth** is a full-stack educational and career-acceleration platform built for Hack for Social Cause 2026 by Team Tatva (HSC|GJ|00051) to bridge the youth employability gap in Indian higher education. Developed with a React 19 + TypeScript + Vite frontend and a pure Node.js HTTP backend with JSON persistence, CareerGrowth guides learners through explainable skill-gap diagnostics (Required minus Current formula), adaptive multimodal learning in 10 Indian languages, evidence-backed practical project portfolios, curated opportunity matching with live runtime SSE ingestion, simulated 1:1 mentorship scheduling, and dedicated role-based dashboards with early remedial intervention tracking for faculty and administrators.

---

## Live URL & Media Demonstration

* **Live Web App URL:** [https://tatva-careergrowth.onrender.com](https://tatva-careergrowth.onrender.com)
* **Public GitHub Repository:** [https://github.com/shauryadoshi9/CareerGrowth](https://github.com/shauryadoshi9/CareerGrowth)

### Platform Screenshots

| Student Dashboard & Skill-Gap Radar | Opportunity Matcher & Ingestion Stream |
|:---:|:---:|
| *(Screenshot Slot: Student Analytics & Gap Radar)* | *(Screenshot Slot: Hackathons & PM Scheme Matcher)* |

| Multilingual AI Study Buddy (10 Indian Languages) | Faculty Copilot & Remedial Interventions |
|:---:|:---:|
| *(Screenshot Slot: AI Study Buddy & Quiz)* | *(Screenshot Slot: Teacher Copilot Lesson Generator)* |

---

## 🧭 Implemented Features & Verification Audit

The following table reflects the exact status and verification path of every core platform feature:

| Feature | Implementation Status | Component / File Path |
|---|:---:|---|
| **Skill-Gap Analyzer** | Works (Deterministic `Required - Current` formula) | `src/components/SkillGapAnalyzer.tsx`, `src/services/aiEngine.ts` |
| **Adaptive Learning Engine** | Works (Interactive quiz, audio TTS, sample data badge) | `src/components/AdaptiveLearningEngine.tsx` |
| **Career Navigator** | Works (Structured 3-month milestone sequence) | `src/components/CareerNavigator.tsx` |
| **Vocational Hub** | Works (NCrF aligned projects, evidence submission) | `src/components/VocationalHub.tsx` |
| **10-Language Translation** | Works (Live switching: en, hi, gu, mr, ta, te, kn, bn, pa, ml) | `src/services/i18n.ts` |
| **Rural Offline Packs** | Demo-Simulated (Simulated download & sync telemetry) | `src/components/OfflinePackManager.tsx` |
| **Teacher Copilot** | Works (Curriculum generator across 10 languages with publish flow) | `src/components/TeacherCopilot.tsx` |
| **Risk Intervention Engine** | Demo-Simulated (Sample cohort data with remedial task assignment) | `src/components/RiskInterventionEngine.tsx` |
| **Opportunity Matcher & Refresh** | Demo-Simulated (Curated sample listings; manual on-demand ingest) | `src/components/OpportunityMatcher.tsx`, `server/index.js` |
| **1:1 Mentor Booking** | Works (Slot selection, server DB save, Google Meet link preview) | `src/components/MentorHub.tsx`, `server/index.js` |
| **Mock Interview Engine** | Demo-Simulated (Track selector, instant keyword rubric evaluation) | `src/components/MockInterviewEngine.tsx` |
| **Vocational Project Portfolio** | Works (Multi-step tracking, verified project evidence saved to DB) | `src/components/VocationalHub.tsx`, `server/index.js` |
| **Progress Sharing with Consent** | Works (Explicit consent toggle, unique share code, server scoped) | `src/components/StudentDashboard.tsx`, `server/index.js` |
| **AI Study Buddy & Tutor** | Works (Gemini 2.0 Flash API with expert pedagogical fallback) | `src/components/AIStudyBuddy.tsx`, `server/index.js` |
| **Per-User Data Isolation** | Works (All profile, skill, application, and booking data strictly user-scoped) | `server/index.js` |
| **Role-Based Dashboards** | Works (Dedicated views for Student, Teacher, and Administrator) | `StudentDashboard.tsx`, `TeacherDashboard.tsx`, `AdminDashboard.tsx` |

---

## 🔐 Demo Accounts & Role Permissions

The login modal contains 1-click test credentials for the seeded hackathon roles:

| Role | Email | Password | Seeded Identity | What This Role Sees |
|---|---|---|---|---|
| **Student** | `student.demo@careergrowth.org` | `Demo@2026!` | Aarav Patel | Personal Dashboard, Skill-Gap Analyzer, Roadmap, Quizzes, Opportunity Matcher, Portfolio, Mentor Booking |
| **Teacher** | `teacher.demo@careergrowth.org` | `Demo@2026!` | Dr. Sharma | Faculty Dashboard, Active Learner Metrics, Remedial Recovery Rate, AI Teacher Copilot, Intervention Logs |
| **Administrator** | `admin.demo@careergrowth.org` | `Demo@2026!` | Dean Verma | Institutional Analytics, Placement Readiness Index, University Enrollment Statistics, Risk Auditing |

> 🔒 **Security Notice:** New self-registered accounts (via registration, OTP verification, or demo Google login) are strictly provisioned as `student`. Teacher and Admin privileges exist only via the immutable seed file (`server/database.seed.json`).

---

## 📡 API Routes & Authorization Matrix

Protected endpoints require `Authorization: Bearer <JWT_TOKEN>`. Rate limiting enforces a strict cap of 10 requests/minute on authentication routes.

| Endpoint | Method | Auth Required | Allowed Roles | Description |
|---|:---:|:---:|:---:|---|
| `/api/health` | GET | No | Public | Health status, uptime, and Team Tatva metadata |
| `/api/auth/register` | POST | No | Public | Register new user (always assigned role `'student'`) |
| `/api/auth/login` | POST | No | Public | Authenticate with email and password |
| `/api/auth/send-otp` | POST | No | Public | Generate 6-digit OTP (preview in `DEMO_MODE=true` only) |
| `/api/auth/verify-otp` | POST | No | Public | Verify OTP and register (always role `'student'`) |
| `/api/auth/google-login` | POST | No | Public (`DEMO_MODE=true`) | Demo Google sign-in (student only; admin/teacher returns `403`) |
| `/api/auth/me` | GET | Yes | Any | Returns authenticated user session payload |
| `/api/profile` | GET, POST, PUT | Yes | Any | Read or modify user-scoped profile details |
| `/api/skills` | GET, POST | Yes | Any | User-isolated skills inventory |
| `/api/skills/:id` | PUT, DELETE | Yes | Any | Update or remove user-scoped skill |
| `/api/applications` | GET, POST | Yes | Any | User-isolated internship/hackathon applications |
| `/api/quiz` | POST | Yes | Any | Record diagnostic quiz submissions |
| `/api/portfolio/projects` | GET, POST | Yes | Any | User-scoped verified project artifacts |
| `/api/progress/share` | GET, POST | Yes | Any | Manage progress sharing consent and share code |
| `/api/opportunities` | GET | No | Public | View curated opportunities catalog |
| `/api/opportunities` | POST | Yes | Any | Post community-hosted opportunity listing |
| `/api/opportunities/refresh` | POST | Yes | Any | Trigger on-demand manual catalog ingestion |
| `/api/live/stream` | GET | No | Public | Server-Sent Events (SSE) real-time stream |
| `/api/mentors` | GET | No | Public | List available industry mentors |
| `/api/mentorship/bookings` | GET, POST | Yes | Student (own) / Faculty & Admin (all) | Book and view 1:1 mentorship sessions |
| `/api/ai-tutor` | POST | Yes | Any | Query AI Tutor (Gemini API with expert fallback) |
| `/api/interventions` | GET, POST | Yes | **Teacher, Admin Only** | Manage remedial interventions (Student gets `403`) |
| `/api/teacher/analytics` | GET | Yes | **Teacher, Admin Only** | Faculty cohort progress analytics (Student gets `403`) |
| `/api/institution/analytics`| GET | Yes | **Admin Only** | Departmental placement metrics (Student/Teacher gets `403`) |

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
* Node.js v20.x or v22.x LTS
* npm v10+

### 2. Clone and Install
```bash
git clone https://github.com/shauryadoshi9/CareerGrowth.git
cd CareerGrowth
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root based on `.env.example`:
```env
PORT=5000
JWT_SECRET=your_secure_random_jwt_secret_at_least_32_characters_long
GEMINI_API_KEY=your_optional_google_gemini_api_key
ALLOWED_ORIGIN=http://localhost:3000,http://localhost:3001
DEMO_MODE=true
TRUST_PROXY=false
NODE_ENV=development
```

> ⚠️ **Important:** `JWT_SECRET` must be at least 32 characters long. The server will reject startup if the secret is missing or insecure.

### 4. Run Automated Security Check Suite
```bash
npm run security-check
```
*Validates self-register role isolation, Google demo sign-in guards, 403 authorization barriers, 401 unauthenticated access blocks, and 429 rate limiting.*

### 5. Start Development Environment
```bash
# Terminal 1: Backend Server (Port 5000)
npm run start

# Terminal 2: Vite Frontend Dev Server (Port 3000)
npm run dev
```

### 6. Single-Service Production Build
```bash
npm run build
npm run start
```
The compiled single-page application from `/dist` and all `/api` endpoints are served on the single `PORT` (default `5000`).

---


> ℹ️ **Hosting Note on Free Tiers:** Free hosting instances spin down after periods of inactivity. On restart, the local JSON data automatically re-seeds from `server/database.seed.json`, ensuring the demo evaluation accounts always remain in a clean, predictable state for hackathon judges.

---

## 🔮 Scale-Up Roadmap

While this hackathon implementation uses a lightweight, self-contained architecture for zero-setup evaluation, the production roadmap envisions:
* **PostgreSQL + pgvector:** Transition from atomic JSON storage to a distributed relational schema with vector embeddings for high-dimensional skill taxonomy matching.
* **Redis Queue & Caching:** Offload external catalog indexing to background worker queues with distributed rate limiting.
* **Curriculum RAG Engine:** Index national NPTEL and state university syllabi into dense vector indices for automated lesson-plan alignment.
* **Cloud Object Storage:** Integrate AWS S3 or Cloudflare R2 for student capstone video demonstrations, GitHub repository mirrors, and PDF certificates.
* **WebRTC Live Telephony:** Direct peer-to-peer audio/video rooms for mentor calls within the platform.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).  
Developed by **Team Tatva (HSC|GJ|00051)** for **Hack for Social Cause 2026**.
