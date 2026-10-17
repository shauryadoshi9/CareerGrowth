# Architecture Blueprint (ARCHITECTURE.md)

## Project Title: Tatva (CareerGrowth)
**AI-Powered Integrated Education, Skill & Employability Platform — From Learning to Livelihood**  
**Role:** Senior Software Architect  
**Version:** 1.0.0 (Production Architecture Source of Truth)  
**Status:** Approved System Architecture  

---

## 1. Executive Architecture Summary & Guiding Principles

Tatva is designed as a **unified, resilient, zero-bloat web platform**. It bridges the divide between cutting-edge AI capabilities and resource-constrained environments (low-bandwidth rural schools, low-power client devices).

### 1.1 Architectural Tenets
1. **Simplicity Over Distributed Complexity:** A single deployable full-stack service (Pure Node.js API serving the pre-compiled React 19 Vite application) eliminates multi-container orchestrator overhead for MVP while maintaining clean separation of concerns.
2. **Pedagogical Resilience (Dual-Tier AI):** Cloud AI (Google Gemini 2.0 Flash) powers rich reasoning, while an integrated local deterministic fallback engine guarantees 100% platform availability even during cloud API rate limits, network blackouts, or absent API keys.
3. **Data Portability:** An atomic, transactional JSON datastore for zero-config rapid execution, designed with an explicit schema contract ready for immediate migration to managed PostgreSQL.
4. **Zero-Trust Client Boundary:** Client state is treated as untrusted; all scoring, skill gap math, role-based access checks, and resource mutations are authenticated and validated server-side.

---

## 2. Recommended Tech Stack & Rationale

| Layer | Selected Technology | Version | Architectural Rationale |
|---|---|---|---|
| **Frontend Framework** | React + TypeScript | React 19, TS 5.7 | Industry standard for accessible, type-safe interactive dashboards; seamless integration with reactive state and charting. |
| **Build & Dev Tool** | Vite | Vite 6.1 | Near-instant Hot Module Replacement (HMR), tree-shaking, and lightweight static production bundles (<400KB gzipped). |
| **Styling** | Tailwind CSS v4 | v4 | Zero-runtime CSS compiler; enforces strict design tokens (spacing, typography, dark/light theme variables). |
| **Visualization** | Recharts | 2.15+ | Responsive SVG rendering for radar charts, skill gap progression meters, and institutional heatmaps. |
| **Backend Runtime** | Node.js (HTTP Core) | Node.js v20+ LTS | High-throughput, asynchronous event-driven I/O; built using native `http` module to minimize external dependency supply-chain attack surfaces. |
| **Authentication** | JWT + bcrypt | `jsonwebtoken`, `bcrypt` | Stateless, cryptographically signed JSON Web Tokens ($HS256$) with high-cost salt hashing ($rounds=10$) for credential security. |
| **AI Integration** | Google Gemini 2.0 Flash + Fallback | REST API (`v1beta`) | Ultra-low latency, multi-turn reasoning, cost-effective API for Indian languages; paired with a deterministic pedagogical rule engine. |
| **Data Layer** | Atomic JSON $\to$ PostgreSQL | POSIX / RDBMS ready | Atomic file locking (`fs.writeFileSync` to temp + rename) guarantees crash resistance; typed entities map directly to relational tables. |
| **Internationalization** | Client-Side Translation Dictionary | 10 Indian Languages | Zero latency, offline-capable UI string resolution without costly recurring machine translation API calls. |

---

## 3. High-Level System Architecture & Component Diagram

```
+-----------------------------------------------------------------------------------+
|                                CLIENT BROWSER                                     |
|  +---------------------+  +-------------------------+  +-----------------------+  |
|  |  Student Dashboard  |  |  Teacher Copilot View   |  |   Admin Analytics     |  |
|  +---------------------+  +-------------------------+  +-----------------------+  |
|  +-----------------------------------------------------------------------------+  |
|  | UI Services: i18n (10 Languages) | Web Speech TTS | Offline Sync Queue      |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           |
                                   HTTPS / SSE Stream
                                           |
+------------------------------------------v----------------------------------------+
|                            UNIFIED NODE.JS BACKEND                                |
|  +-----------------------------------------------------------------------------+  |
|  | Security Filter: CORS | Rate Limiting | JWT Session Auth | Role RBAC Guard   |  |
|  +-----------------------------------------------------------------------------+  |
|  | REST Router:                                                                |  |
|  |  - /api/auth/*       (Register, Login, Password Reset, Verify)             |  |
|  |  - /api/skills/*     (Baseline Diagnostic, Radar Calculation)              |  |
|  |  - /api/copilot/*    (Gemini Lesson Generator & Fallback)                  |  |
|  |  - /api/mentor/*     (Slot Reservation & Google Meet Preview)               |  |
|  |  - /api/interventions/* (Risk Flagging, Remedial Task Resolution)          |  |
|  |  - /api/stream/opportunities (Server-Sent Events Ingestion)                |  |
|  +-----------------------------------------------------------------------------+  |
|  | Student Intelligence Engine:                                                |  |
|  |  - Gap Formula: Required - Current                                         |  |
|  |  - Explainable Readiness Index                                              |  |
|  +-------------------------------------+---------------------------------------+  |
+----------------------------------------|------------------------------------------+
                     +-------------------+-------------------+
                     |                                       |
+--------------------v-------------------+   +---------------v----------------------+
|            PERSISTENCE LAYER           |   |           AI INTELLIGENCE            |
|  - Atomic JSON Datastore (MVP)         |   |  - Primary: Google Gemini 2.0 API    |
|  - Thread-safe File Locking            |   |  - Secondary: Deterministic Fallback |
|  - PostgreSQL Migration Interface      |   |    Pedagogical Knowledge Base        |
+----------------------------------------+   +--------------------------------------+
```

---

## 4. End-to-End Data Flow

### 4.1 Diagnostic Assessment to Personalized Milestone Generation
1. **User Action:** Student selects "Target Career: Full Stack Developer" and completes a 5-topic baseline assessment.
2. **Client Dispatch:** `POST /api/skills/assess` with `{ careerId, responses }`.
3. **Server Execution:**
   - Evaluates response correctness against topic benchmarks.
   - Updates `userSkills` entity in datastore.
   - Computes gap scores: $Gap_i = \max(0, Required_i - Current_i)$.
   - Calculates overall readiness:
     $$\text{Readiness \%} = \left( 1 - \frac{\sum Gap_i}{\sum Required_i} \right) \times 100$$
4. **Milestone Sequencing:** Synthesizes a 3-month roadmap matching high-gap topics to free national educational modules (SWAYAM, NPTEL).
5. **Persistence & Response:** Persists updated profile atomically and returns gap metrics and milestone objects to the client.

### 4.2 AI Study Buddy & Teacher Copilot Execution
1. **Prompt Dispatch:** Client initiates `POST /api/copilot/chat` or `/api/copilot/lesson-plan` with user context, language code, and prompt text.
2. **API Key Verification:** Server checks for valid `GEMINI_API_KEY` in environment.
3. **Execution Branch:**
   - **Branch A (Cloud AI Online):** Dispatches HTTPS payload to Gemini 2.0 Flash (`generateContent`). Parses structured JSON response.
   - **Branch B (Offline / Fallback):** Triggers deterministic pedagogical engine matching subject keywords against pre-indexed curated curriculum templates.
4. **Delivery:** Delivers pedagogical payload to client with metadata flag `source: "gemini"` or `source: "fallback"`.

---

## 5. Folder & Project Structure

```
CareerGrowth/
├── dist/                          # Compiled production assets (built by Vite)
├── docs/                          # Architectural specifications & hackathon reports
├── public/                        # Static assets, favicon, manifest
├── scripts/
│   └── security-check.mjs         # Automated pre-commit security & vulnerability auditor
├── server/
│   ├── database.json              # Active transactional datastore (gitignored)
│   ├── database.seed.json         # Immutable seed dataset with pre-configured roles
│   └── index.js                   # Pure Node.js REST API server & static file host
├── src/
│   ├── components/                # Modular domain UI components
│   │   ├── AdaptiveLearningEngine.tsx  # Interactive quizzes & audio study buddy
│   │   ├── AdminDashboard.tsx          # Institutional placement analytics & heatmaps
│   │   ├── CareerNavigator.tsx         # Chronological milestone roadmap
│   │   ├── InstitutionAnalytics.tsx    # Macro readiness charts & department telemetry
│   │   ├── MentorHub.tsx               # 1:1 mentorship booking & scheduling
│   │   ├── MockInterviewEngine.tsx     # Keyword rubric interview evaluation
│   │   ├── OfflinePackManager.tsx      # Low-bandwidth pack management
│   │   ├── OpportunityMatcher.tsx      # Curated internships & live SSE stream
│   │   ├── RiskInterventionEngine.tsx  # At-risk learner tracking & remediation
│   │   ├── SkillGapAnalyzer.tsx        # Deterministic radar chart & gap calculation
│   │   ├── StudentDashboard.tsx        # Central learner hub & consent sharing
│   │   ├── TeacherCopilot.tsx          # AI lesson planning & formative quiz builder
│   │   ├── TeacherDashboard.tsx        # Cohort progress & remedial recovery
│   │   └── VocationalHub.tsx           # NCrF practical project portfolio logger
│   ├── context/
│   │   └── AuthContext.tsx        # Client authentication & session management
│   ├── data/                      # Client-side taxonomy benchmarks & curated courses
│   ├── services/
│   │   ├── aiEngine.ts            # Client-side AI dispatch & fallback wrappers
│   │   └── i18n.ts                # 10 Indian language localized string dictionary
│   ├── types/
│   │   └── index.ts               # Shared TypeScript domain contracts
│   ├── App.tsx                    # Top-level view switcher & role router
│   ├── index.css                  # Tailwind v4 directives & design tokens
│   └── main.tsx                   # React root hydration
├── .env.example                   # Environment configuration template
├── package.json                   # Project manifest & dependency constraints
├── tsconfig.json                  # TypeScript compiler rules
└── vite.config.ts                 # Vite bundle configuration
```

---

## 6. Authentication, Authorization & Security Boundaries

### 6.1 Authentication Lifecycle
- **Tokens:** Stateless JSON Web Tokens (`jwt`) signed using $HS256$ algorithm with an enforced minimum 32-character secret (`JWT_SECRET`).
- **Session Duration:** 7-day expiration (`expiresIn: '7d'`).
- **Password Security:** Salted hashes using `bcrypt` ($10$ rounds minimum). Plaintext passwords are never logged or stored.

### 6.2 Role-Based Access Control (RBAC)
- Three primary roles: `student`, `teacher`, `admin`.
- **Enforcement:** Every protected endpoint verifies `req.headers.authorization`.
- **Privilege Escalation Prevention:** User registration hardcodes `role: "student"`. Elevation to `teacher` or `admin` can only occur through administrative database seeding.

### 6.3 Resource Ownership Isolation
Mutating routes (e.g., updating project portfolios, booking mentor sessions, updating consent tokens) enforce `item.userId === authenticatedUser.id`. Cross-user data modification attempts return `403 Forbidden`.

---

## 7. Database Architecture & Persistence Strategy

### 7.1 MVP Atomic JSON Store
- **Atomic Writes:** Data is written to `database.json.tmp` and renamed via `fs.renameSync` to eliminate partial-write corruptions during abrupt process terminations.
- **Auto-Seeding:** If `database.json` is absent on server start, the server automatically initializes state from `database.seed.json`.

### 7.2 Migration Path to PostgreSQL
All entities possess uniform relational primary keys (`id: string (UUID)`). Relational joins (e.g., `user` $\to$ `interventions`, `user` $\to$ `projects`) adhere to foreign key constraints, enabling direct migration to PostgreSQL tables with zero application rewrite.

---

## 8. External Integrations & AI Resilience

### 8.1 Primary AI: Google Gemini 2.0 Flash
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Parameters:** `temperature: 0.3` (for grounded educational consistency), `response_mime_type: "application/json"`.
- **Rate-Limit Resilience:** Automatic circuit breaker switches to deterministic fallback upon receiving HTTP $429$ or $503$.

### 8.2 Built-in Deterministic Fallback Engine
- Grounded in curated educational blueprints (NCERT, AICTE, NPTEL syllabus mappings).
- Executes keyword matching to serve verified lesson structures and multiple-choice questions without requiring internet access or third-party cloud credits.

---

## 9. Environment Configuration

| Variable Name | Required | Default / Example | Purpose |
|---|:---:|---|---|
| `PORT` | No | `5000` | HTTP port on which the combined server listens. |
| `NODE_ENV` | No | `development` | Environment mode (`development` vs `production`). |
| `JWT_SECRET` | **Yes** | *(Min 32 random chars)* | Cryptographic secret for signing JWT auth tokens. Server aborts if $< 32$ chars. |
| `ALLOWED_ORIGIN` | No | `http://localhost:3000,http://localhost:3001` | CORS whitelist for development and production domains. |
| `GEMINI_API_KEY` | No | `AIzaSy...` | Optional cloud API key for Google Gemini 2.0 Flash. Fallback engine activates if absent. |
| `DEMO_MODE` | No | `true` | Enables rapid 1-click test credentials on authentication modal. |

---

## 10. Error Handling & Security Hardening

1. **Global Uncaught Exception Trapping:** `process.on('uncaughtException')` ensures graceful error logging without crashing the server.
2. **CORS Hardening:** Strict origin checking against `ALLOWED_ORIGIN` list; wildcard `*` rejected in production mode.
3. **Input Sanitization:** JSON request bodies are parsed under strict byte limits ($1\text{MB}$) to prevent Denial of Service (DoS) memory exhaustion.
4. **Header Security:** Native HTTP security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`).

---

## 11. Testing & Deployment Approach

### 11.1 Verification Strategy
- **TypeScript Static Verification:** `npm run typecheck` (`tsc --noEmit`) validates complete type integrity across all components and services.
- **Security Audit Script:** Automated pre-commit execution of `scripts/security-check.mjs` verifying secret safety, password hashing compliance, and dependency hygiene.
- **Production Build Validation:** `npm run build` generates optimized distribution bundles in `dist/`.

### 11.2 Production Deployment (Single Container / Service)
1. Build frontend: `npm run build`.
2. Start server: `node server/index.js`.
3. The server serves both API endpoints under `/api/*` and compiled single-page application static assets from `dist/` with client-side routing fallback (`index.html`).
