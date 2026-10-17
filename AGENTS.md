# AI Coding Agent Development & Engineering Rules (AGENTS.md)

## Project Title: Tatva (CareerGrowth)
**AI-Powered Integrated Education, Skill & Employability Platform — From Learning to Livelihood**  
**Role:** Senior Principal Engineer & AI Coding-Agent Specialist  
**Version:** 1.0.0 (Agent Rules of Engagement)  
**Status:** Mandatory Engineering Directives  

---

## 1. Prime Directive for AI Agents

All AI coding agents, autonomous subagents, and human contributors operating in this repository MUST read and adhere strictly to the project source of truth documents:
- [PRD.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/PRD.md) — Product requirements, user journeys, MVP scope.
- [DESIGN.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/DESIGN.md) — UI design tokens, typography, dark/light themes, component states.
- [ARCHITECTURE.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/ARCHITECTURE.md) — Tech stack, data flow, security boundaries, file structure.
- [DATABASE.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/DATABASE.md) — Schemas, constraints, atomic persistence, entity models.
- [API.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/API.md) — Endpoint specifications, status codes, payload contracts.

**Core Invariant:** NEVER hallucinate architecture patterns, invent unnecessary external dependencies, weaken security guards, or break existing working functionality.

---

## 2. Code Quality & Naming Conventions

1. **Clarity Over Cleverness:** Write explicit, self-documenting TypeScript and JavaScript. Avoid obscure one-liners or premature functional abstractions.
2. **File Naming Standards:**
   - React Components: `PascalCase.tsx` (e.g., `SkillGapAnalyzer.tsx`, `TeacherCopilot.tsx`).
   - Hooks & Contexts: `camelCase.ts` or `PascalCase.tsx` (e.g., `useAuth.ts`, `AuthContext.tsx`).
   - Services & Utilities: `camelCase.ts` (e.g., `aiEngine.ts`, `i18n.ts`).
   - Scripts: `kebab-case.mjs` (e.g., `security-check.mjs`).
3. **Symbol Naming:**
   - Interfaces & Types: `PascalCase` prefixed or suffixed logically (e.g., `LearnerProfile`, `SkillGapRecord`).
   - Functions & Methods: `camelCase` starting with an active verb (e.g., `computeSkillGap`, `fetchOpportunities`, `renderRadarChart`).
   - Constants: `UPPER_SNAKE_CASE` for global immutable configuration (e.g., `DEFAULT_BENCHMARK_LEVEL`, `MAX_AI_QUERIES_PER_MIN`).

---

## 3. Project & Folder Structure Discipline

Maintain strict separation of concerns across the project layout:
```
CareerGrowth/
├── server/             # Pure Node.js HTTP REST backend & persistence engine
├── src/
│   ├── components/     # Self-contained domain feature components
│   ├── context/        # React context providers (AuthContext, ThemeContext)
│   ├── data/           # Static taxonomy maps and fallback curriculum seeds
│   ├── services/       # Network calls, i18n dictionaries, and audio synthesis
│   └── types/          # Global TypeScript interfaces and domain schemas
```
- **Rule:** Do NOT place backend database calls or filesystem operations inside `src/`.
- **Rule:** Do NOT place UI markup, JSX, or browser-specific objects (`localStorage`, `window`) inside `server/`.

---

## 4. Component Reuse & Design System Compliance

1. **Design Token Adherence:** Every component must utilize the tokens specified in [DESIGN.md](file:///c:/Users/shaur/OneDrive/Desktop/CareerGrowth/DESIGN.md).
   - Card surfaces must use `.glass-card` or `.glass-panel`.
   - Dark mode background: `#090d16` / `#0f172a`.
   - Text contrast: `text-white` for titles, `text-slate-400` for subtitles, `text-slate-500` for timestamps.
2. **Never Create Ad-Hoc Utility Classes:** Reuse existing Tailwind primitives and CSS variables rather than creating one-off hex colors.
3. **Mandatory UI States:** Every interactive component must handle:
   - **Loading State:** Skeleton shimmer or progress spinner.
   - **Empty State:** Helpful prompt and CTA if arrays or records are empty.
   - **Error State:** Non-crashing visual notification with retry option.

---

## 5. Dependency Management

1. **Zero-Bloat Policy:**
   - Do NOT install heavy packages when native browser APIs or Node.js built-ins suffice.
   - Example: Use native `fetch()`, native `crypto`, native `http`, and native `Web Speech API`.
   - Never install arbitrary ORMs, heavy analytics bundles, or UI component suites (e.g., Material UI, Ant Design) that conflict with Tailwind v4.
2. **Package Modifications:**
   - Always verify bundle impact before adding a package.
   - Run `npm audit` and ensure zero high/critical vulnerabilities.

---

## 6. Type Safety & Static Analysis

1. **Strict TypeScript Standards:**
   - Avoid `any` at all costs. Use explicit interfaces, generics, or `unknown` with type narrowing.
   - All API response payloads must be typed in `src/types/index.ts`.
2. **Static Verification Requirement:**
   - Before completing any task involving code changes, the agent MUST run:
     `npm run typecheck` or `npx tsc --noEmit`
   - Zero compilation errors are permitted.

---

## 7. Error Handling & Resilience

1. **Defensive Programming:**
   - Always wrap asynchronous promises in `try / catch` blocks.
   - Never let an unhandled promise rejection crash the backend process.
2. **AI Fallback Resilience:**
   - Any code calling Google Gemini 2.0 (`/api/ai-tutor`) MUST implement automatic fallback to the deterministic offline knowledge base.
   - The UI must inform the user gracefully when operating in offline/fallback mode without throwing catastrophic red screens.

---

## 8. Security, Secrets & Privacy

1. **Zero Client Secrets:**
   - NEVER expose `JWT_SECRET`, database passwords, or `GEMINI_API_KEY` to the client bundle (`src/` or `import.meta.env`).
   - Secrets belong exclusively in server environment variables or `.env`.
2. **Strict JWT Verification:**
   - Server must reject startup if `JWT_SECRET` is missing or $< 32$ characters.
   - Every protected route must extract and verify `Bearer <token>` before modifying state.
3. **Password Security:**
   - Passwords must always be hashed with `bcrypt` ($rounds \ge 10$).
4. **Data Isolation (Multi-Tenancy):**
   - Mutating endpoints (`/api/profile`, `/api/skills`, `/api/portfolio/projects`) must strictly compare `targetUserId === req.user.id`.
   - Never allow one student to overwrite another student's skills or submissions.

---

## 9. Database & State Access Discipline

1. **Atomic File Persistence:**
   - Always use the atomic write pattern (`database.json.tmp` $\to$ `renameSync`) to prevent file corruption during server reloads.
2. **No Data Destruction:**
   - Never delete `database.seed.json`.
   - If `database.json` is missing, auto-seed from `database.seed.json`.
3. **Deterministic Math:**
   - Skill gaps must always use the pure formula:
     $$\text{Gap} = \max(0, \text{Required Level} - \text{Current Level})$$
   - Never introduce floating-point rounding errors or arbitrary adjustments to gap values.

---

## 10. Automated Testing & Verification

1. **Automated Security Audit:**
   - Run `node scripts/security-check.mjs` to verify password hashes, secret leaks, and critical code boundaries.
2. **End-to-End Build Verification:**
   - Before committing production code, run `npm run build` to verify that Vite bundles without tree-shaking failures or asset resolution bugs.
3. **Verification Integrity:**
   - Never modify or delete tests solely to make a test suite pass.
   - Address the root cause of failures.

---

## 11. Git & Change Discipline

1. **Inspect Before Modifying:**
   - Always read and analyze existing files before making edits. Understand the surrounding context and existing abstractions.
2. **Focused & Atomic Commits:**
   - Keep commits small, descriptive, and focused on the immediate task.
   - Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
3. **Continuous GitHub Synchronization:**
   - As mandated by project workflow, push every completed, verified milestone output to `origin main` using `git push origin main`.
4. **Clean Working Tree:**
   - Never leave transient test files, untracked logs, or dirty intermediate files in the workspace.
