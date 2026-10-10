# CareerGrowth — AI-Powered Skill Mapping & Employability Platform

> **Hack for Social Cause 2026 (Innovate for Bharat)**  
> **Team Name:** Tatva | **Team ID:** `HSC|GJ|00051`  
> **Team Lead:** Shaurya Doshi | **Institute:** Dharmsinh Desai University (DDU), Nadiad, Gujarat  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![NodeJS](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)

---

## 📌 Project Overview

**CareerGrowth** is a unified digital platform built for **Hack for Social Cause (Team Tatva, ID: HSC|GJ|00051)** that addresses youth unemployability and skill gaps in Indian higher education. 

Rather than isolated point solutions, CareerGrowth provides an end-to-end continuum:
1. **Explainable Skill-Gap Diagnostics**: Mathematical gap calculation against industry taxonomies.
2. **Adaptive Learning & AI Study Buddy**: Low-latency multilingual learning with audio speech support.
3. **Vocational & Practical Portfolio Hub**: Evidence-backed project records aligned with NCrF guidelines.
4. **Opportunity Matcher & Runtime Live Ingestion**: GPA and skill-weighted matching with Devfolio, Unstop, and PM Internship Scheme listings.
5. **1:1 Industry Mentorship Booking**: Verified scheduling with calendar and Google Meet preview links.
6. **Teacher Copilot & Remedial Intervention Spotlight**: Faculty lesson generator in 10 Indian languages with proactive learning hurdle tracking.
7. **Institutional Analytics Console**: Departmental placement readiness and empirical pilot testing benchmarks.

> **Origin Note**: Conceptualized to address systemic skill-mapping barriers across universities, polytechnics, and rural colleges.

---

## 📸 Screenshots & Demo Video

| Student Dashboard & Skill Gap | Opportunity Matcher & Live Stream |
|:---:|:---:|
| *(Screenshot Slot: Student Analytics & Gap Radar)* | *(Screenshot Slot: Hackathons & PM Scheme Matcher)* |

| Multilingual AI Tutor (10 Indian Languages) | Faculty Copilot & Remedial Interventions |
|:---:|:---:|
| *(Screenshot Slot: AI Study Buddy & Quiz)* | *(Screenshot Slot: Teacher Copilot Lesson Generator)* |

> 📹 **Live Demonstration Video:** [Watch Demo Video](https://youtube.com) *(Insert your recorded hackathon video link here)*

---

## 🔐 Seeded Demo Accounts (Role-Based Access)

To test role-based access control (RBAC), the login page features 1-click quick-fill buttons for all three seeded roles:

| Role | Email | Password | Name | Default Landing View |
|---|---|---|---|---|
| **Student** | `student.demo@careergrowth.org` | `Demo@2026!` | Aarav Patel | Student Dashboard (`/dashboard`) |
| **Faculty / Teacher** | `teacher.demo@careergrowth.org` | `Demo@2026!` | Dr. Sharma | Teacher Dashboard (`/teacher-dashboard`) |
| **Administrator** | `admin.demo@careergrowth.org` | `Demo@2026!` | Dean Verma | Institutional Analytics (`/admin-dashboard`) |

---

## 🛠️ Tech Stack Architecture

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti.
* **Backend**: Node.js raw `http` engine, JSON Web Tokens (`jsonwebtoken`), `bcrypt` password hashing.
* **Storage**: Local atomic file storage (`server/database.json`), seeded automatically from `server/database.seed.json`.
* **Real-Time Layer**: Server-Sent Events (SSE) streaming live opportunity tickers and applicant counters.
* **AI Engine**: Google Gemini 2.0 Flash API with zero-downtime built-in expert pedagogical engine fallback.

---

## ⚙️ Local Development Setup

### Prerequisites
* Node.js v20.x or v24.x LTS
* npm v10+

### 1. Clone the Repository
```bash
git clone https://github.com/shauryadoshi9/CareerGrowth.git
cd CareerGrowth
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root (see `.env.example`):
```env
PORT=5000
JWT_SECRET=your_secure_random_jwt_secret_at_least_32_characters_long
GEMINI_API_KEY=your_optional_google_gemini_api_key
ALLOWED_ORIGIN=http://localhost:3000,http://localhost:3001
DEMO_MODE=true
```

> ⚠️ **Security Rule**: `JWT_SECRET` must be at least 32 characters long. The server will refuse to start if it is missing or insecure.

### 4. Run in Development Mode
In two terminal tabs (or run dev script):

**Terminal 1 (Backend Server):**
```bash
npm run start
```
*Backend active on `http://localhost:5000`*

**Terminal 2 (Frontend Dev Server):**
```bash
npm run dev
```
*Frontend dev server opens on `http://localhost:3000` (proxies `/api` to port 5000)*

### 5. Production Build & Single-Port Serving
```bash
npm run build
npm run start
```
The Node.js server automatically serves the compiled `/dist` single-page application and all `/api` endpoints simultaneously on `PORT` (default 5000).

---

## 🚀 Free Deployment Guide (Render Web Service)

You can host both the frontend and backend together as a single Render Web Service for free:

1. Push your repository to GitHub.
2. Sign in to [Render](https://dashboard.render.com/) and click **New + > Web Service**.
3. Connect your GitHub repository `CareerGrowth`.
4. Configure the service settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** `Free`
5. In the **Environment Variables** tab, configure:
   - `JWT_SECRET`: *(A random string of 32+ characters)*
   - `ALLOWED_ORIGIN`: `*` (or your assigned `https://careergrowth.onrender.com` domain)
   - `DEMO_MODE`: `true`
   - `GEMINI_API_KEY`: *(Optional: your Google Gemini API key)*
6. Click **Deploy Web Service**.

> ℹ️ **Storage Note on Free Tiers**: Render free tier instances use ephemeral disks. The database resets to `server/database.seed.json` on cold restarts, which preserves demo integrity for hackathon judges.

---

## 📡 API Endpoints & Role Permissions

All endpoints return standard JSON payloads. Protected endpoints require `Authorization: Bearer <token>`.

| Endpoint | Method | Auth Required | Allowed Roles | Description |
|---|:---:|:---:|:---:|---|
| `/api/health` | GET | No | Public | Server operational status & hackathon team ID |
| `/api/auth/register` | POST | No | Public | Register student/teacher account (password min 8 chars) |
| `/api/auth/login` | POST | No | Public | Authenticate with credentials and receive JWT |
| `/api/auth/send-otp` | POST | No | Public | Generate 6-digit OTP code (demo preview in dev mode) |
| `/api/auth/verify-otp` | POST | No | Public | Verify OTP and create verified account |
| `/api/auth/google-login`| POST | No | Public | Demo Sign-In with simulated Google account identity |
| `/api/auth/me` | GET | Yes | Any | Returns authenticated session profile and role |
| `/api/profile` | GET, POST, PUT | Yes | Any | Retrieve and update user-scoped learner profile |
| `/api/skills` | GET, POST | Yes | Any | Retrieve and add verified skills to user profile |
| `/api/skills/:id` | PUT, DELETE | Yes | Any | Update or remove specific skill in user profile |
| `/api/applications` | GET, POST | Yes | Any | View and submit job / internship applications |
| `/api/quiz-submissions` | GET, POST | Yes | Any | Submit and review diagnostic quiz answers |
| `/api/portfolio/projects`| GET, POST | Yes | Any | Record multi-step vocational portfolio projects |
| `/api/progress-share` | GET, POST | Yes | Any | Update parent/faculty progress sharing consent |
| `/api/mentors` | GET | No | Public | List available industry mentors |
| `/api/mentors/book` | POST | Yes | Any | Schedule 1:1 mentorship slot with Google Meet link |
| `/api/mentors/bookings` | GET | Yes | Student (own) / Faculty & Admin (all) | Retrieve booked mentorship sessions |
| `/api/opportunities` | GET | No | Public | Query curated opportunity catalog |
| `/api/opportunities` | POST | Yes | Any | Submit community opportunity |
| `/api/opportunities/refresh`| POST | Yes | Any | Trigger on-demand manual ingestion from catalog |
| `/api/live/stream` | GET | No | Public | Server-Sent Events stream for live opportunities |
| `/api/ai-tutor` | POST | Yes | Any | Rate-limited tutor query (Gemini API with expert fallback) |
| `/api/custom-input` | POST | Yes | Any | Generic data submission endpoint |
| `/api/interventions` | GET | Yes | Student (assigned) / Faculty & Admin (all) | View student remedial support records |
| `/api/interventions` | POST | Yes | **Teacher, Admin Only** | Log student remedial intervention (Student gets `403`) |
| `/api/teacher/analytics` | GET | Yes | **Teacher, Admin Only** | Faculty cohort progress & recovery metrics (Student gets `403`) |
| `/api/institution/analytics`| GET | Yes | **Admin Only** | University-wide placement metrics (Student/Teacher gets `403`) |

---

## 🔮 Scale-Up Roadmap

Planned enhancements for production enterprise scale:
- [ ] **Database Migration**: Migrate atomic JSON storage to PostgreSQL with pgvector for semantic search.
- [ ] **Distributed Caching & Ingestion**: Redis Streams and Celery workers for automated scraping of national portals.
- [ ] **Curriculum RAG**: Embed NPTEL, AICTE, and state university syllabi to generate hyper-specific diagnostic assessments.
- [ ] **Cloud Storage**: AWS S3 / Cloudflare R2 bucket integration for student project video artifacts and PDF resumes.
- [ ] **Live Video SDK**: WebRTC / Dyte integration for built-in 1:1 video mentorship calls.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).  
Developed by **Team Tatva (HSC|GJ|00051)** for the **Innovate for Bharat — Hack for Social Cause 2026 Hackathon**.
