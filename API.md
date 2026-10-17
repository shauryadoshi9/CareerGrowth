# API Integration & Protocol Specification (API.md)

## Project Title: Tatva (CareerGrowth)
**AI-Powered Integrated Education, Skill & Employability Platform — From Learning to Livelihood**  
**Role:** Senior Backend Architect & API Integration Engineer  
**Version:** 1.0.0 (API Source of Truth)  
**Status:** Approved API Specification  

---

## 1. Global API Conventions & Protocol Standards

### 1.1 Base Configuration & Security
- **Protocol:** HTTP/1.1 and HTTP/2 over TLS/HTTPS.
- **Base URI:** `https://careergrowth.org/api` (Local Dev: `http://localhost:5000/api`).
- **Format:** `application/json; charset=utf-8` for all requests and responses (except SSE streams).
- **Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`.
- **Statelessness:** All session state resides in cryptographically signed JWT tokens ($HS256$). The backend maintains zero sticky session requirements.

### 1.2 Global Error Response Schema
All error responses return standard HTTP status codes accompanied by a uniform JSON body:
```json
{
  "success": false,
  "error": "Human readable error description",
  "code": "ERROR_MACHINE_CODE"
}
```

| HTTP Status | Semantic Meaning | Description |
|---|---|---|
| `200 OK` | Success | Request succeeded; returned resource payload in body. |
| `201 Created` | Created | Resource successfully persisted. |
| `400 Bad Request` | Validation Failure | Missing required fields, malformed JSON, or schema violation. |
| `401 Unauthorized` | Authentication Required | Token missing, signature invalid, or token expired. |
| `403 Forbidden` | Access Denied | Authenticated role lacks permission or violates resource ownership. |
| `404 Not Found` | Not Found | Requested endpoint or resource ID does not exist. |
| `429 Too Many Requests` | Rate Limited | Request rate exceeds safe thresholds (e.g., AI Tutor query limit). |
| `500 Server Error` | Internal Failure | Unhandled server error; stack trace hidden in production. |

---

## 2. Authentication & Identity Endpoints

### 2.1 `POST /api/auth/register`
Creates a new learner account. Role is strictly defaulted to `student`.
- **Access:** Public.
- **Request Body:**
  ```json
  {
    "name": "Pooja Solanki",
    "email": "pooja.solanki@example.com",
    "password": "SecurePassword123!",
    "department": "Electrical Engineering",
    "institution": "Government Polytechnic"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr-1718901234",
      "name": "Pooja Solanki",
      "email": "pooja.solanki@example.com",
      "role": "student"
    }
  }
  ```

### 2.2 `POST /api/auth/login`
Authenticates existing credentials against `bcrypt` hash.
- **Access:** Public.
- **Request Body:**
  ```json
  {
    "email": "student.demo@careergrowth.org",
    "password": "Demo@2026!"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr-demo-student",
      "name": "Demo Student (Aarav Patel)",
      "email": "student.demo@careergrowth.org",
      "role": "student"
    }
  }
  ```

### 2.3 `POST /api/auth/send-otp` & `POST /api/auth/verify-otp`
Passwordless mobile/email verification for low-friction onboarding in rural learning hubs.
- **Send OTP Request:** `{ "email": "user@domain.in" }` $\to$ Returns `{ "success": true, "message": "OTP dispatched" }`.
- **Verify OTP Request:** `{ "email": "user@domain.in", "otp": "492019" }` $\to$ Returns JWT session token.

### 2.4 `GET /api/auth/me`
Resolves and validates the caller's active JWT session token.
- **Access:** Authenticated (`Bearer <token>`).
- **Response (`200 OK`):** User metadata, role, profile details, and server capabilities.

---

## 3. Learner Profile & Deterministic Skill-Gap Endpoints

### 3.1 `GET /api/profile` & `PUT /api/profile`
Retrieves or updates the student's biographical and academic settings (preferred language, target career, GPA).
- **Access:** Authenticated (Scoped to `req.user.id`).
- **Update Request Body:**
  ```json
  {
    "preferredLanguage": "gu",
    "targetCareerId": "career-solar-tech",
    "academicGpa": 8.7
  }
  ```

### 3.2 `GET /api/skills`
Fetches the active user's evaluated skill competency records.
- **Access:** Authenticated.
- **Response (`200 OK`):**
  ```json
  [
    {
      "id": "s1",
      "skillId": "python",
      "name": "Python & Data Structures",
      "currentLevel": 4,
      "requiredLevel": 5,
      "category": "technical",
      "updatedAt": "2026-03-10T14:22:00.000Z"
    }
  ]
  ```

### 3.3 `POST /api/skills` & `PUT /api/skills/:id`
Evaluates and updates skill scores based on diagnostic quiz results or project submissions.
- **Validation:** `currentLevel` must be integer $0 \le x \le 5$. `requiredLevel` must be $1 \le x \le 5$.
- **Gap Calculation:** Executed server-side: $Gap = \max(0, Required - Current)$.

---

## 4. Practical Portfolio & Assessment Endpoints

### 4.1 `GET /api/portfolio/projects` & `POST /api/portfolio/projects`
Manages evidence-backed vocational and technical builds.
- **Access:** Authenticated (`POST` strictly scoped to caller's identity).
- **Request Body:**
  ```json
  {
    "title": "Grid-Tied 5kW Solar Inverter Telemetry Logger",
    "track": "solar-tech",
    "repoUrl": "https://github.com/learner/solar-logger",
    "liveUrl": "https://solar-logger.demo.app",
    "description": "Implemented ESP32 microcontroller firmware collecting voltage and inverter telemetry with RS485 Modbus protocol."
  }
  ```
- **Response (`201 Created`):** Returns saved project object with `status: "submitted"`.

### 4.2 `GET /api/quiz-submissions` & `POST /api/quiz-submissions`
Persists formative and diagnostic micro-assessment outcomes.
- **Payload:** `{ "moduleId": "mod-python-01", "score": 80, "totalQuestions": 5, "answers": [...] }`.

---

## 5. Privacy & Consent-Gated Sharing

### 5.1 `GET /api/progress-share` & `POST /api/progress-share`
Allows learners to generate, refresh, or revoke a secure public sharing code.
- **Toggle Consent Request:** `{ "consentGranted": true }`.
- **Response (`200 OK`):**
  ```json
  {
    "consentGranted": true,
    "shareCode": "TATVA-SH-98214A",
    "shareableUrl": "https://careergrowth.org/verify/TATVA-SH-98214A"
  }
  ```

---

## 6. Mentorship & Mock Interview Endpoints

### 6.1 `GET /api/mentors`
Returns directory of vetted industry mentors and academic faculty available for 1:1 sessions.
- **Access:** Public / Authenticated.

### 6.2 `POST /api/mentors/book`
Reserves a 30-minute guidance slot.
- **Request Body:**
  ```json
  {
    "mentorId": "men-01",
    "mentorName": "Dr. Sharma",
    "topic": "Renewable Energy Career Pathways",
    "slotTime": "2026-03-22T10:00:00.000Z"
  }
  ```
- **Response (`201 Created`):** Returns confirmed booking with auto-generated secure Google Meet link preview.

### 6.3 `GET /api/mentors/bookings`
- **Student View:** Returns only sessions booked by caller.
- **Teacher/Admin View:** Returns all cohort scheduled sessions.

---

## 7. Opportunity Matcher & Real-Time SSE Streams

### 7.1 `GET /api/opportunities`
Filterable catalog of verified internships, hackathons, and national apprenticeship schemes.
- **Query Parameters:** `?type=Internship&skills=python,react`.

### 7.2 `GET /api/live/stream` (Server-Sent Events)
Live push stream delivering notifications of new government apprenticeships, hackathon registrations, and institutional alerts.
- **Headers:** `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`.
- **Heartbeat:** Keep-alive ping sent every 15 seconds.

### 7.3 `GET /api/live/updates` (Low-Bandwidth Fallback)
Lightweight polling fallback for clients operating on firewalled 2G/3G mobile networks.

---

## 8. AI Tutoring & Teacher Copilot Proxy

### 8.1 `POST /api/ai-tutor`
Secure server-side proxy to Google Gemini 2.0 Flash API.
- **Access:** Authenticated.
- **Rate Limit:** Clamped to $20\text{ queries / min / user}$.
- **Security Guard:** Never accepts or exposes client-side API keys. Keys reside strictly in backend environment (`GEMINI_API_KEY`).
- **Request Body:**
  ```json
  {
    "prompt": "Explain Ohm's Law and Solar PV cell resistance in Gujarati with a practical example.",
    "language": "gu",
    "context": {
      "userRole": "student",
      "targetCareer": "solar-tech"
    }
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "response": "ઓહ્મનો નિયમ (Ohm's Law) વિદ્યુત પ્રવાહ...",
    "source": "gemini",
    "timestamp": "2026-03-10T14:25:00.000Z"
  }
  ```
- **Fallback Resilience:** If Gemini is unreachable, times out ($>8000\text{ms}$), or hits quotas, returns deterministic curriculum response with `"source": "fallback"`.

---

## 9. Role-Protected Faculty & Admin Endpoints

### 9.1 `GET /api/interventions` & `POST /api/interventions`
- **Authorization:** `teacher` or `admin` only (`403 Forbidden` if student).
- **Create Intervention (`POST`):**
  ```json
  {
    "studentId": "usr-demo-student",
    "studentName": "Aarav Patel",
    "actionType": "Remedial Worksheet",
    "note": "Assigned recursive tree traversal practice module due to quiz score < 50%."
  }
  ```

### 9.2 `GET /api/teacher/analytics`
- **Authorization:** `teacher` or `admin`.
- **Response:** Cohort recovery rate, at-risk count, active learners, and curriculum units published.

### 9.3 `GET /api/institution/analytics`
- **Authorization:** `admin` only.
- **Response:** University enrollment totals, average GPA, Placement Readiness Index (PRI), and departmental readiness distributions.

### 9.4 `GET /api/health`
Zero-dependency operational health check reporting server uptime, memory usage, and persistence status.
- **Response (`200 OK`):** `{ "status": "healthy", "uptime": 412.3, "dbReady": true }`.
