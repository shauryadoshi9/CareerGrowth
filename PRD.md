# Product Requirements Document (PRD)

## Project Title: Tatva (CareerGrowth)
**AI-Powered Integrated Education, Skill & Employability Platform — From Learning to Livelihood**  
**Initiative:** Hack for Social Cause 2026 (Team Tatva — `HSC|GJ|00051`)  
**Lead Entity:** Dharmsinh Desai University (DDU), Nadiad, Gujarat  
**Version:** 1.0.0 (Production Blueprint)  
**Status:** Approved Specification  

---

## 1. Problem Statement & Value Proposition

### 1.1 The Core Problem
In the Indian educational ecosystem, learners face a critical disconnect transitioning from academic education to gainful employment:
1. **Skill–Job Gap:** Students lack clarity on the precise delta between academic curricula and industry skill demands ("unknown unknowns").
2. **One-Size-Fits-All Pedagogy:** Heterogeneous student groups receive uniform learning materials without adaptive pacing or remedial feedback.
3. **Rural & Remote Inequity:** Learners in Tier-2/3 regions and rural government schools encounter acute scarcity of specialized teachers, quality guidance, and reliable internet connectivity.
4. **Unstructured Career Decisions:** Career and stream selections occur without objective, evidence-based diagnostic roadmaps.
5. **Practical Skill Deficit:** Technical and vocational concepts remain theoretical without structured portfolio proof or practical alignment (e.g., NCrF/NSDC standards).
6. **Vernacular Exclusion:** High-quality learning content and technical explanations are predominantly English-only, alienating learners more comfortable in regional Indian languages.
7. **Teacher Workload & Late Detection:** Educators spend disproportionate hours preparing lesson plans and remedial tests; student learning bottlenecks remain invisible until summative terminal examinations.

### 1.2 Value Proposition
Tatva (CareerGrowth) is an integrated Education & Employability Operating System that unifies 8 traditionally fragmented modules into a single platform driven by an explainable **Student Intelligence Engine** and a shared learner profile:
$$\text{ASSESS} \longrightarrow \text{DISCOVER} \longrightarrow \text{LEARN} \longrightarrow \text{PRACTICE} \longrightarrow \text{IMPROVE} \longrightarrow \text{SKILL} \longrightarrow \text{GUIDE} \longrightarrow \text{OPPORTUNITY}$$

- **For Learners:** Transparent skill-gap diagnostic ($Gap = \text{Required} - \text{Current}$), personalized multi-month milestone roadmaps, multilingual AI tutor (with offline fallback), practical project portfolios, and real-time opportunity matching.
- **For Teachers & NGO Mentors:** Automated AI Copilot for bilingual lesson planning and quiz generation, aggregate class-level weak concept heatmaps, and early proactive remedial interventions.
- **For Institutional Administrators:** Real-time placement readiness indexing, batch skill distribution analytics, and intervention auditing.

---

## 2. Target Users & Personas

| Persona | Role | Context & Key Pain Points | Primary Goal |
|---|---|---|---|
| **Aarav Patel** | Student (Higher Ed / Engineering) | Pre-final year undergraduate; unconfident about industry requirements; intimidated by English-only tutorials; needs structured pathway. | Identify missing skills, build verified project portfolio, practice mock interviews, and land internships. |
| **Pooja Solanki** | Rural / School Learner (Std 9–12) | Government school student in Gujarat; intermittent 2G/3G connectivity; Gujarati primary language; no career counselor. | Download lightweight offline study packs, receive vernacular guidance, and discover vocational/government career pathways. |
| **Dr. R. Sharma** | Faculty / NGO Mentor | Manages 60+ students per batch; lacks time to build individualized remedial materials; discovers failing students only after mid-terms. | Spot class-level conceptual gaps early, auto-generate localized lesson plans, and assign targeted remedial tasks. |
| **Dean S. Verma** | Institution Admin / Placement Head | Needs macro-level visibility into institutional readiness and accreditation metrics (NAAC, NIRF, NCrF). | Track cohort readiness indices, evaluate intervention impact, and monitor placement trajectory. |

---

## 3. Core User Journeys & User Stories

### 3.1 Student Core Journey
1. **Onboarding & Baseline Diagnostic:** Learner registers, selects domain/branch and target role (e.g., Full Stack Engineer, Solar PV Technician), and completes an initial 5-question baseline assessment.
2. **Skill-Gap Evaluation:** Learner reviews explainable radar chart and gap table ($Gap = \text{Required} - \text{Current}$).
3. **Adaptive Learning & AI Tutoring:** Learner engages with step-by-step milestones, consumes curated open content (SWAYAM, NPTEL, DIKSHA), and queries the AI Study Buddy in their chosen language (e.g., Gujarati, Hindi, English).
4. **Practice & Portfolio Building:** Learner completes hands-on projects, submits GitHub/live demonstration evidence, and completes rubric-graded mock interviews.
5. **Opportunity Discovery:** Learner receives filtered internship, hackathon, and scholarship listings matched against their readiness score, tracking applications directly.

### 3.2 Teacher / Mentor Journey
1. **Class Analytics Review:** Teacher logs in to inspect class cohort metrics, spotting high-risk students and weak topics.
2. **Lesson & Remedial Generation:** Teacher uses Teacher Copilot to generate a bilingual lesson outline and diagnostic quiz for a specific topic.
3. **Targeted Intervention:** Teacher assigns a remedial task with target dates and tracks the student's status from `Open` to `Under Review` to `Resolved`.

### 3.3 Key User Stories
- *As a Student*, I want to see exactly which skills I am missing for my desired role so that I do not waste time on redundant courses.
- *As a Student*, I want to switch platform text and AI explanations into Gujarati or Hindi so that language is never a barrier to conceptual understanding.
- *As a Rural Student*, I want to download study packs offline so that I can learn without constant active broadband.
- *As a Faculty Member*, I want an automated summary of cohort weaknesses so that I can tailor upcoming revision lectures before final exams.
- *As an Admin*, I want an institutional dashboard showing placement readiness across departments to drive targeted training programs.

---

## 4. Functional Requirements & Feature Modules

### 4.1 Module 1: Skill-Gap Analyzer
- **Diagnostic Engine:** Compute deterministic skill gap using the formula:
  $$\text{Gap Score} = \max(0, \text{Required Level} - \text{Current Level})$$
- **Input Parameters:** Target career role, self-evaluation, quiz scores, project evidence.
- **Visualizations:** Visual interactive radar chart (Recharts) and tabular breakdown classified into `Mastered`, `In Progress`, and `Critical Gap`.
- **Target Profiles:** Pre-seeded for software engineering, cloud, data science, solar technology, and EV maintenance.

### 4.2 Module 2: Career Navigator & Adaptive Roadmap
- **Milestone Engine:** Sequenced 3-to-6 month chronological learning path divided into Foundation, Intermediate, and Capstone milestones.
- **Curated Open Links:** Direct links to certified free national repositories (SWAYAM, NPTEL, NCERT, DIKSHA).
- **Progress Tracking:** Toggleable milestone checklist persisting completion state to backend.

### 4.3 Module 3: Adaptive Learning Engine & AI Study Buddy
- **Micro-Quiz Engine:** Concept-level multiple-choice evaluations with immediate pedagogical feedback.
- **AI Tutor:** Conversational assistant powered by Google Gemini 2.0 Flash API with fallback to built-in deterministic pedagogical engine when offline or API limit reached.
- **Multilingual Support:** 10 Indian languages (English, Hindi, Gujarati, Marathi, Tamil, Telugu, Kannada, Bengali, Punjabi, Malayalam).
- **Audio Synthesis:** Web Speech API integration for vernacular Text-to-Speech (TTS).

### 4.4 Module 4: Vocational & Practical Skill Hub
- **Practical Tracks:** Aligned with National Credit Framework (NCrF) and NSDC standards (e.g., Solar Installation, IoT Sensors, Electric Vehicle Battery Systems).
- **Evidence-Based Portfolio:** Multi-step project submission form accepting title, repository URL, live URL, and reflective summary.
- **Verification Workflow:** Student submissions saved to server with verification status indicators.

### 4.5 Module 5: Opportunity Matcher & Ingestion
- **Opportunity Repository:** Curated internships, hackathons, and national apprenticeship schemes (NCS, AICTE portal, PMKVY).
- **Matching Algorithm:** Compatibility calculation based on student skills and target career.
- **Application Tracker:** State tracking (`Applied`, `Reviewing`, `Accepted`, `Interview`).
- **Live Stream Sync:** SSE (Server-Sent Events) endpoint simulating real-time government and industry feed ingestion.

### 4.6 Module 6: Mentor Hub & Mock Interview
- **Mentor Scheduling:** Slot-based booking system with confirmed session dates, notes, and meeting link generation.
- **Mock Interview Simulator:** Track-specific technical and behavioral questions with instant keyword rubric evaluation, scoring clarity, technical depth, and problem-solving.

### 4.7 Module 7: Teacher Copilot & Risk Intervention
- **AI Lesson Generator:** Produces bilingual lesson plans, key conceptual analogies, and formative quiz questions on demand.
- **Risk Intervention Engine:** Flags at-risk learners based on engagement drops, low quiz scores, or stalled milestones.
- **Actionable Remediation:** Create, assign, and resolve remedial intervention tickets.

### 4.8 Module 8: Institution Analytics & Consent-Based Sharing
- **Institutional Index:** Aggregated placement readiness percentage, departmental distributions, and remedial recovery velocity.
- **Consent-Controlled Sharing:** Explicit student toggle generating unique shareable codes allowing parents or prospective employers read-only profile access.

---

## 5. Non-Functional Requirements (NFRs)

| Category | Requirement | Target Metric |
|---|---|---|
| **Performance** | Initial page load time on 3G network | $< 2.5\text{ seconds}$ |
| **Availability** | Core educational functionality availability | $99.9\%$ (works without third-party LLM via fallback) |
| **Resilience** | Offline / Low-bandwidth functionality | Downloadable JSON/localStorage pack with sync queue |
| **Security** | Authentication & data protection | JWT session tokens, bcrypt hash ($rounds \ge 10$), input sanitization |
| **Accessibility** | Usability across diverse demographics | WCAG 2.1 AA compliance, high contrast, readable typography |
| **Internationalization** | Multilingual UI and prompts | 10 Indian regional languages supported client-side |
| **Data Isolation** | Multi-tenant user integrity | Strict server-side verification of user ownership on every mutating route |

---

## 6. Roles & Permissions Matrix

| Capability / Route | Student | Teacher / NGO Mentor | Institution Admin | Public / Viewer |
|---|:---:|:---:|:---:|:---:|
| Take Diagnostic & Quizzes | Yes | View Sample | View Sample | No |
| View Personal Roadmap & Profile | Yes (Own) | No | No | Read-only (with consent token) |
| Submit Project Portfolio Evidence | Yes | No | No | Read-only |
| Book Mentorship Slot | Yes | Yes (Manage) | No | No |
| Use Teacher Copilot & Generator | No | Yes | Yes | No |
| Create & Update Risk Interventions | No | Yes | Yes | No |
| View Class Cohort Analytics | No | Yes (Class) | Yes (All Depts) | No |
| Institutional Placement Metrics | No | Summary | Full Access | No |

---

## 7. Pages & Screens Specification

1. **Authentication Screen:** Modal/view for Login, Register, Role Selector (Student/Teacher/Admin quick-switch for evaluation), Password Reset.
2. **Student Dashboard:** Overview banner, Skill Gap Radar, Readiness Scorecard, Quick Action cards, Active Milestones.
3. **Skill-Gap Analyzer Page:** Interactive target role selector, skill matrix ($Required - Current$), benchmark adjustments, recommended actions.
4. **Adaptive Learning & AI Tutor View:** Step-by-step syllabus module, Gemini chat pane, audio readout, micro-assessment modal.
5. **Career Navigator:** Multi-phase timeline view with milestone checkpoints and open government curriculum links.
6. **Vocational Hub & Portfolio:** Practical project cards, step-by-step project logger, evidence submission modal, portfolio gallery.
7. **Opportunity Matcher:** Filterable listings (Internships, Hackathons, Schemes), readiness match percentage, application tracker.
8. **Mentor Hub & Mock Interview:** Mentor directory, slot booking modal, interactive interview question simulator with automated rubric grading.
9. **Teacher Dashboard & Copilot:** Cohort readiness distribution, high-risk student table, lesson plan generator form, active remedial intervention tracker.
10. **Institutional Admin Dashboard:** Macro placement readiness gauge, department comparison charts, risk audit logs, system telemetry.

---

## 8. Data Requirements

- **User Accounts:** `id`, `name`, `email`, `password_hash`, `role`, `department`, `year_of_study`, `created_at`.
- **Learner Profiles:** `user_id`, `target_career`, `overall_readiness`, `consent_share_enabled`, `share_code`, `completed_milestones`.
- **Skill Evaluations:** `user_id`, `skill_id`, `current_level`, `required_level`, `last_assessed`.
- **Project Portfolios:** `id`, `user_id`, `title`, `track`, `repo_url`, `live_url`, `description`, `status`.
- **Interventions:** `id`, `student_id`, `teacher_id`, `subject`, `reason`, `status`, `assigned_task`, `created_at`, `resolved_at`.
- **Mentor Bookings:** `id`, `student_id`, `mentor_name`, `topic`, `slot_time`, `meeting_link`, `status`.
- **Opportunities:** `id`, `title`, `organization`, `type`, `stipend_or_prize`, `deadline`, `required_skills`, `apply_url`.

---

## 9. Integrations

1. **Google Gemini 2.0 Flash API:** Powers conversational tutoring, contextual remedial prompts, and teacher lesson generation.
2. **Built-in Offline Pedagogical Fallback:** Deterministic local rule engine serving responses and quiz evaluation if Gemini API is unreachable or rate-limited.
3. **Web Speech Synthesis API:** Native browser speech engine providing vernacular audio playback without external cloud dependencies.
4. **Curated Open Government Content:** SWAYAM, NPTEL, DIKSHA, and NCERT deep link curation.
5. **Government Opportunity Portals:** National Career Service (NCS) and AICTE Internship portal data schema alignment.

---

## 10. Loading, Empty, and Error States

- **Loading States:** Shimmer skeletons matching card geometry; inline spinner with textual status indicators during AI generation.
- **Empty States:** Friendly contextual illustrations with direct call-to-action buttons (e.g., "No projects submitted yet — Add your first practical build", "No upcoming mentor sessions — Book a slot").
- **Error States:** Non-blocking toast notifications with actionable recovery; fallback banner if Gemini API key is missing or quota exhausted with automatic fallback activation.

---

## 11. MVP Scope, Out-of-Scope Items & Success Criteria

### 11.1 In-Scope for MVP
- Complete 8-module functional prototype.
- Multi-role authenticated workflows (Student, Teacher, Admin).
- Deterministic Skill-Gap Analyzer with Recharts visualizer.
- Multilingual client-side support across 10 Indian languages.
- Gemini 2.0 AI Tutor with local fallback.
- Simulated offline pack download and synchronization telemetry.
- Project evidence submission and mentor slot booking.
- Teacher Copilot and remedial intervention lifecycle.
- Placement readiness analytics for administrators.

### 11.2 Out-of-Scope for MVP (Future Roadmap)
- Real-time video conferencing (simulated Google Meet link provided).
- Native Android/iOS binaries (handled via responsive web / PWA approach).
- Direct payment gateway integration (platform focuses on free and subsidized government education).
- Complex automated multi-tenant school district billing.

### 11.3 Success Criteria & Validation Metrics
- **Gap Accuracy:** 100% deterministic calculation of $(Required - Current)$ without arithmetic drift.
- **System Uptime & Fallback:** Platform remains 100% usable for learning and quizzes even with zero external AI API credits.
- **Multilingual Completeness:** Clean rendering and navigation across all 10 supported regional languages.
- **Role Isolation:** Zero cross-user data leakage or privilege escalation across authenticated sessions.

---

## 12. Assumptions & Decisions Requiring Approval

### 12.1 Assumptions
- Government curriculum syllabi (NCERT/AICTE/NSDC) can be modeled as modular hierarchical skill trees.
- Low-bandwidth users have modern Chromium or Safari browsers capable of Web Speech synthesis and IndexedDB/localStorage caching.
- Prototype uses a file-backed JSON store with transaction safety that is architecturally structured for drop-in migration to PostgreSQL.

### 12.2 Decisions Flagged for Approval
- **Decision 1:** Selection of Google Gemini 2.0 Flash as primary cloud LLM with local rule-based fallback. *(Approved)*
- **Decision 2:** Inclusion of all 10 scheduled Indian languages in client-side dictionary vs dynamic on-the-fly translation. *(Approved)*
- **Decision 3:** Storage mechanism transition timeline from JSON datastore to managed PostgreSQL for pilot deployment in Gujarat districts.
