# Master Implementation Plan (IMPLEMENTATION_PLAN.md)

## Project Title: Tatva (CareerGrowth)
**AI-Powered Integrated Education, Skill & Employability Platform — From Learning to Livelihood**  
**Role:** Senior Technical Lead  
**Context:** Based strictly on [PRD.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/PRD.md), [DESIGN.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/DESIGN.md), [ARCHITECTURE.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/ARCHITECTURE.md), [DATABASE.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/DATABASE.md), [API.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/API.md), and [AGENTS.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/AGENTS.md).  
**Version:** 1.0.0  
**Status:** Approved Engineering Roadmap  

---

## 1. Development Principles & Staging Strategy

Development is structured into **8 sequential, independently verifiable phases**. Foundations (security, auth, data integrity) are established before user-facing feature modules. Every phase specifies:
- **Goal**
- **Features / Tasks**
- **Affected Files / Modules**
- **Dependencies / Prerequisites**
- **Database / API Changes**
- **Verification Tests Required**
- **Completion Criteria**

---

## 2. Implementation Phases

### Phase 1: Foundation, Security & Design System Tokens
- **Goal:** Establish a robust environment, enforce security boundaries, and wire Tailwind v4 design tokens.
- **Tasks:**
  1. Validate `.env` loading and ensure `JWT_SECRET` has minimum 32-character enforcement on startup.
  2. Implement atomic write-and-rename mechanism in datastore manager (`server/database.json.tmp` $\to$ `renameSync`).
  3. Verify Tailwind v4 `@custom-variant dark` tokens, slate palettes, and typography hierarchy in `src/index.css`.
  4. Integrate automated `scripts/security-check.mjs` pre-commit audit checking for secrets and plaintext passwords.
- **Affected Files:**
  - `server/index.js`
  - `src/index.css`
  - `scripts/security-check.mjs`
  - `.env.example`
- **Dependencies:** None (Baseline).
- **Database / API Changes:** Health check endpoint `GET /api/health`.
- **Tests Required:**
  - Automated security audit: `node scripts/security-check.mjs`.
  - Typecheck: `npm run typecheck`.
- **Completion Criteria:** Server boots cleanly, enforces JWT secret validation, passes security audit with zero warnings, and serves design tokens.

---

### Phase 2: Authentication, RBAC & Multi-Tenant Data Isolation
- **Goal:** Implement secure user authentication with strict role-based access control (`student`, `teacher`, `admin`).
- **Tasks:**
  1. Implement `POST /api/auth/register` with role fixed to `student` and bcrypt hashing ($rounds=10$).
  2. Implement `POST /api/auth/login` returning signed JWT session tokens ($7\text{ day expiry}$).
  3. Implement `POST /api/auth/send-otp` and `/api/auth/verify-otp` for phone/email low-friction verification.
  4. Wire `AuthContext.tsx` with session caching in `localStorage` and automatic re-authentication via `GET /api/auth/me`.
  5. Implement role-protected route guards (`requireRole`) preventing students from accessing faculty/admin endpoints.
- **Affected Files:**
  - `server/index.js`
  - `src/context/AuthContext.tsx`
  - `src/App.tsx`
- **Dependencies:** Phase 1.
- **Database / API Changes:** `users`, `userProfiles` schemas; `/api/auth/*` routes.
- **Tests Required:**
  - Registration with duplicate email yields `409 Conflict`.
  - Attempted role escalation during registration is rejected.
  - Invalid JWT tokens return `401 Unauthorized`.
- **Completion Criteria:** All three demo personas can log in, receive isolated profiles, and role routing functions flawlessly.

---

### Phase 3: Diagnostic Skill-Gap Engine & Career Navigator
- **Goal:** Deliver the core deterministic diagnostic engine and chronological career milestone roadmap.
- **Tasks:**
  1. Implement skill taxonomy mapping for 5 core tracks (Full Stack, AI/Data Science, Cloud, Solar PV Tech, EV Systems).
  2. Construct deterministic skill-gap calculation: $Gap = \max(0, Required - Current)$ and Readiness Index formula.
  3. Build interactive SVG Radar Chart in `SkillGapAnalyzer.tsx` using Recharts.
  4. Build 3-month milestone sequence in `CareerNavigator.tsx` linking to SWAYAM, NPTEL, and DIKSHA curriculum units.
  5. Enable milestone completion toggles persisting state to `userProfiles`.
- **Affected Files:**
  - `src/components/SkillGapAnalyzer.tsx`
  - `src/components/CareerNavigator.tsx`
  - `src/data/careers.ts`
  - `server/index.js`
- **Dependencies:** Phase 2.
- **Database / API Changes:** `userSkills` entity; `GET /api/skills`, `POST /api/skills`, `PUT /api/skills/:id`.
- **Tests Required:**
  - Verification that $Gap$ calculation has zero arithmetic drift.
  - Verification that changing target career recalculates radar polygon in under $50\text{ms}$.
- **Completion Criteria:** Students can select target careers, visualize their skill gap, and check off curriculum milestones with live persistence.

---

### Phase 4: Vernacular Multilingual Layer & Resilient AI Tutoring
- **Goal:** Implement 10 Indian language support and dual-tier AI tutoring (Gemini 2.0 Flash + Offline Fallback).
- **Tasks:**
  1. Build client-side translation dictionary `src/services/i18n.ts` supporting: `en`, `hi`, `gu`, `mr`, `ta`, `te`, `kn`, `bn`, `pa`, `ml`.
  2. Implement backend endpoint `POST /api/ai-tutor` with rate-limiting ($20\text{ req/min/user}$) and server-side `GEMINI_API_KEY`.
  3. Implement deterministic fallback pedagogical engine returning pre-indexed curriculum explanations if API is unreachable.
  4. Integrate Web Speech API synthesis for vernacular text-to-speech audio playback in `AdaptiveLearningEngine.tsx`.
- **Affected Files:**
  - `src/services/i18n.ts`
  - `src/services/aiEngine.ts`
  - `src/components/AdaptiveLearningEngine.tsx`
  - `src/components/AIStudyBuddy.tsx`
  - `server/index.js`
- **Dependencies:** Phase 3.
- **Database / API Changes:** `userTutorHistory` entity; `POST /api/ai-tutor`.
- **Tests Required:**
  - Instant UI language switching across all 10 languages without text clipping.
  - Severing network connection gracefully activates fallback pedagogical responses.
- **Completion Criteria:** AI tutor responds accurately in vernacular languages with zero crashes when offline.

---

### Phase 5: Vocational Hub & Practical Evidence Portfolio
- **Goal:** Enable practical vocational project tracking aligned with National Credit Framework (NCrF) and NSDC standards.
- **Tasks:**
  1. Build practical track catalogs (Solar PV, Smart Agriculture IoT, Electric Vehicle Servicing) in `VocationalHub.tsx`.
  2. Implement multi-step project logger (Title, Track, GitHub Repo, Live URL, Reflective Technical Architecture).
  3. Implement `GET & POST /api/portfolio/projects` with strict `userId` scoping.
  4. Add verification badges (`Submitted`, `Under Faculty Review`, `Verified`).
- **Affected Files:**
  - `src/components/VocationalHub.tsx`
  - `server/index.js`
  - `src/types/index.ts`
- **Dependencies:** Phase 2, Phase 3.
- **Database / API Changes:** `userPortfolioProjects` entity; `/api/portfolio/projects`.
- **Tests Required:**
  - Submitting a project without a title or description returns `400 Bad Request`.
  - Student A cannot view or mutate Student B's unshared projects.
- **Completion Criteria:** Students can submit portfolio proof and view their verified practical project records.

---

### Phase 6: Opportunity Matcher & Mentorship Booking Engine
- **Goal:** Connect students to live internships, hackathons, government schemes, and 1:1 mentor sessions.
- **Tasks:**
  1. Build filterable opportunity catalog in `OpportunityMatcher.tsx` matching listings against user skill readiness.
  2. Implement Server-Sent Events (SSE) endpoint `GET /api/live/stream` pushing simulated real-time opportunity notifications.
  3. Implement low-bandwidth polling fallback `GET /api/live/updates`.
  4. Build mentor directory and slot reservation workflow in `MentorHub.tsx`.
  5. Implement `POST /api/mentors/book` with auto-generated Google Meet meeting links.
  6. Implement mock interview simulator with keyword rubric scoring in `MockInterviewEngine.tsx`.
- **Affected Files:**
  - `src/components/OpportunityMatcher.tsx`
  - `src/components/MentorHub.tsx`
  - `src/components/MockInterviewEngine.tsx`
  - `server/index.js`
- **Dependencies:** Phase 2, Phase 5.
- **Database / API Changes:** `opportunities`, `mentorshipBookings`, `userApplications`; `/api/opportunities/*`, `/api/mentors/*`, `/api/live/*`.
- **Tests Required:**
  - SSE connection delivers periodic heartbeat and data events without connection leaks.
  - Booking an unavailable slot returns validation error.
- **Completion Criteria:** Real-time stream functions smoothly, opportunities match readiness, and mentorship sessions persist to the database.

---

### Phase 7: Teacher Copilot, Remedial Interventions & Admin Analytics
- **Goal:** Provide faculty with automated curriculum tools and institutional heads with macro accreditation telemetry.
- **Tasks:**
  1. Build AI Teacher Copilot in `TeacherCopilot.tsx` generating bilingual lesson plans and formative quizzes.
  2. Implement Risk Intervention Engine in `RiskInterventionEngine.tsx` flagging learners with low scores or stalled progress.
  3. Implement `GET & POST /api/interventions` with `teacher` and `admin` RBAC authorization.
  4. Build macro institutional dashboard in `AdminDashboard.tsx` and `InstitutionAnalytics.tsx` calculating Placement Readiness Index (PRI) and departmental heatmaps.
  5. Implement consent-based sharing in `StudentDashboard.tsx` generating unique cryptographic `shareCode`.
- **Affected Files:**
  - `src/components/TeacherCopilot.tsx`
  - `src/components/RiskInterventionEngine.tsx`
  - `src/components/TeacherDashboard.tsx`
  - `src/components/AdminDashboard.tsx`
  - `src/components/InstitutionAnalytics.tsx`
  - `server/index.js`
- **Dependencies:** Phases 2 through 6.
- **Database / API Changes:** `interventions`, `userProgressShare`; `/api/interventions`, `/api/teacher/analytics`, `/api/institution/analytics`.
- **Tests Required:**
  - Student attempting `GET /api/interventions` receives `403 Forbidden`.
  - Consent toggle invalidates old share codes when disabled.
- **Completion Criteria:** Teachers can generate lesson plans and track interventions; administrators can view macro readiness across all branches.

---

### Phase 8: Low-Bandwidth Offline Sync, Production Build & Audit
- **Goal:** Package offline learning bundles, verify production build, and pass comprehensive security audit.
- **Tasks:**
  1. Implement `OfflinePackManager.tsx` simulating downloadable JSON study packs and telemetry sync queues.
  2. Execute production Vite build `npm run build` and verify that `server/index.js` serves static assets from `dist/`.
  3. Run comprehensive end-to-end security audit script `node scripts/security-check.mjs`.
  4. Validate responsive mobile navigation (<640px) and dark/light mode contrast across all 8 modules.
- **Affected Files:**
  - `src/components/OfflinePackManager.tsx`
  - `vite.config.ts`
  - `server/index.js`
- **Dependencies:** All previous phases.
- **Database / API Changes:** None.
- **Tests Required:**
  - `npm run build` executes without errors.
  - `node scripts/security-check.mjs` returns `SECURITY AUDIT PASSED`.
  - Zero TypeScript compilation errors (`tsc --noEmit`).
- **Completion Criteria:** Single production command `node server/index.js` launches the complete full-stack platform serving all 8 modules with 100% test passing.

---

## 3. Recommended First Task

> **RECOMMENDED FIRST TASK:**  
> **Phase 1, Task 1 & 4:** Execute the automated security and environment validation script (`node scripts/security-check.mjs`) and verify that the production build pipeline (`npm run build`) runs cleanly without TypeScript or packaging errors.
