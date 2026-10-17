# Design System & UI/UX Specification (DESIGN.md)

## Project Title: Tatva (CareerGrowth)
**AI-Powered Integrated Education, Skill & Employability Platform — From Learning to Livelihood**  
**Design Lead:** Senior Product Designer & UI/UX Systems Architect  
**Version:** 1.0.0 (Design Source of Truth)  
**Status:** Approved Design System  

---

## 1. Visual Direction & Design Principles

### 1.1 Core Visual Philosophy
Tatva's visual language embodies **Purposeful Simplicity, Dignity, and Radical Clarity**. Because the platform serves diverse Indian learners—from first-generation college students in rural Gujarat to advanced engineering candidates—the UI must never feel intimidating, cluttered, or overly generic.
- **Dignified & Professional:** Avoids childish gamification; treats learners as emerging industry professionals.
- **High Information Density with Low Cognitive Load:** Uses structured cards, explicit data tables, and intuitive visual progress indicators.
- **Vernacular-First Typography:** Headings and text accommodate complex scripts (Devanagari, Gujarati, Dravidian glyphs) without line-clipping or irregular baseline shifts.
- **Low-Bandwidth Elegance:** Clean SVG icons, CSS-driven micro-interactions, and minimal heavy bitmap assets.

### 1.2 Design Principles
1. **Explainability First:** Visual elements (such as radar charts and scores) always expose their underlying calculation ($Required - Current$) with clear textual tags.
2. **Predictable Component States:** Every interactive card, button, and input has deterministic Default, Hover, Active, Disabled, Loading, and Error states.
3. **Seamless Dual Themes:** Native Dark Mode (Deep Slate `#090d16` / `#0f172a`) optimized for prolonged night study sessions; Crisp Light Mode (`#fafafa` / `#ffffff`) for bright classroom projectors.

---

## 2. Color Palette & Typography System

### 2.1 Color Tokens

#### Dark Theme (Default)
| Token Name | Hex Value | Semantic Role |
|---|---|---|
| `--bg-primary` | `#090d16` | Main application background (Deep Midnight Slate) |
| `--bg-secondary` | `#0f172a` | Header, sidebar, and elevated panel surfaces |
| `--bg-card` | `#0f172a` | Standard content card background |
| `--bg-card-hover` | `#1e293b` | Interactive hover state for actionable cards |
| `--text-primary` | `#f8fafc` | High-contrast primary headings and titles |
| `--text-secondary` | `#94a3b8` | Subtitles, body descriptions, and table headers |
| `--text-muted` | `#64748b` | Timestamps, metadata pills, disabled text |
| `--border-color` | `rgba(255, 255, 255, 0.08)` | Default subtle card borders and dividers |
| `--border-highlight` | `rgba(255, 255, 255, 0.16)` | Active state and focused element borders |

#### Light Theme
| Token Name | Hex Value | Semantic Role |
|---|---|---|
| `--bg-primary` | `#fafafa` | Primary page canvas |
| `--bg-secondary` | `#ffffff` | Elevated navigation bar and control containers |
| `--bg-card` | `#ffffff` | Content cards and surfaces |
| `--bg-card-hover` | `#f8fafc` | Interactive card hover state |
| `--text-primary` | `#0f172a` | Deep navy primary text |
| `--text-secondary` | `#334155` | Secondary content and labels |
| `--text-muted` | `#64748b` | Muted caption and helper text |
| `--border-color` | `rgba(0, 0, 0, 0.08)` | Standard card boundary lines |
| `--border-highlight` | `rgba(0, 0, 0, 0.18)` | Hover/focus border color |

#### Functional Accents
| Accent | Hex (Dark) | Hex (Light) | Context of Use |
|---|---|---|---|
| **Primary Brand (Indigo)** | `#6366f1` | `#4f46e5` | Primary CTA buttons, active tab indicators, brand badges |
| **Success / Mastered (Emerald)** | `#10b981` | `#059669` | Completed milestones, high readiness scores ($\ge 80\%$), verified submissions |
| **Warning / In-Progress (Amber)** | `#f59e0b` | `#d97706` | Medium gap, pending review, partial milestone completion |
| **Danger / Critical Gap (Rose)** | `#f43f5e` | `#e11d48` | Critical skill gap ($Gap \ge 3$), high risk cohort alerts, failed validations |
| **Info / Government Portal (Cyan)** | `#06b6d4` | `#0891b2` | SWAYAM/NPTEL badges, live stream telemetry, external links |

---

### 2.2 Typography Hierarchy
- **Primary Body Font:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Heading Font:** `'Outfit', system-ui, sans-serif` (Crisp geometric personality)
- **Code / Monospace:** `'Fira Code', 'JetBrains Mono', Consolas, monospace`

| Style | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `Display 1` | 32px (2.0rem) | 1.2 | 700 (Bold) | Dashboard hero titles, major module headings |
| `Heading 2` | 24px (1.5rem) | 1.3 | 600 (Semi-bold) | Section headers, modal titles |
| `Heading 3` | 18px (1.125rem) | 1.4 | 600 (Semi-bold) | Card headings, milestone group titles |
| `Body Large` | 16px (1.0rem) | 1.5 | 400 / 500 | Explanations, AI dialogue body, quiz prompts |
| `Body Small` | 14px (0.875rem) | 1.5 | 400 | Data tables, form inputs, secondary descriptions |
| `Caption / Pill` | 12px (0.75rem) | 1.4 | 600 (Uppercase/Medium) | Skill badges, difficulty pills, timestamps |

---

## 3. Spacing, Grid & Layout System

### 3.1 8-Point Modular Grid
Spacing tokens follow a rigorous 8px increment rule:
- `space-1`: 4px (tight badge padding)
- `space-2`: 8px (icon gaps, micro-margins)
- `space-3`: 12px (form input vertical padding)
- `space-4`: 16px (standard card padding, internal layout gap)
- `space-6`: 24px (grid gap between dashboard cards)
- `space-8`: 32px (section break margins)
- `space-12`: 48px (page-level top/bottom container padding)

### 3.2 Responsive Container Breakpoints
- **Mobile (Base):** `< 640px` (Single column, sticky bottom navigation or compact drawer, collapsed radar charts)
- **Tablet (`md`):** `640px – 1024px` (2-column grid, horizontal scroll tabs)
- **Desktop (`lg` / `xl`):** `1024px – 1280px` (Fixed left navigation / contextual sidebars, 3-column dashboard widgets)
- **Wide Workstation (`2xl`):** `> 1280px` (Max container width clamped to `1440px` centered with fluid margins)

---

## 4. Reusable Component Library

### 4.1 Buttons & Controls
- **Primary Button:** Solid Indigo fill (`bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]`), white text, rounded-lg (`8px`), 12px vertical / 20px horizontal padding, transition duration 150ms.
- **Secondary / Outline Button:** Transparent fill, 1px border (`border-white/10 hover:border-white/20 hover:bg-white/5`), text primary.
- **Ghost / Icon Button:** Minimal background (`p-2 rounded-md hover:bg-white/10 text-slate-400 hover:text-white`).
- **Pill / Badge Component:** Compact height (`24px`), rounded-full, 8px horizontal padding, with colored status dot (e.g., green dot + "Verified" text).

### 4.2 Cards & Containers (`glass-card` System)
- **Base Panel (`glass-panel`):** Dark background (`#0f172a`), 1px border (`rgba(255,255,255,0.08)`), rounded-xl (`12px`), drop shadow `0 4px 6px -1px rgba(0, 0, 0, 0.2)`.
- **Interactive Card (`glass-card`):** Same as base panel with hover elevation: `translate-y-[-2px]`, border highlight (`rgba(255,255,255,0.16)`), subtle background transition to `#1e293b`.

### 4.3 Form Controls
- **Text & Select Inputs:** Dark background (`#090d16`), 1px subtle border, 12px horizontal padding, placeholder `#64748b`. Focused state displays a 2px Indigo ring with zero layout shift.
- **Radio / Choice Cards:** Full-width selectable cards with checkmark indicators for interactive quiz selections.

### 4.4 Data Visualization Standards
- **Radar Charts (Recharts):** Polar grid stroke `rgba(255,255,255,0.1)`. Two concentric polygons: Required Level (Indigo dashed line `#6366f1`, fill opacity 0.15) vs Current Level (Emerald solid line `#10b981`, fill opacity 0.35).
- **Progress Meters:** 6px height track (`bg-slate-800`), filled with dynamic gradient depending on score threshold (Rose for $<50\%$, Amber for $50-75\%$, Emerald for $\ge 75\%$).

---

## 5. Navigation & Form Workflows

### 5.1 Global App Header
- Left: Brand icon + "Tatva" logo + subtitle "Education & Skill OS".
- Center: Quick switcher tabs (Dashboard, Skill Gap, Career Roadmap, Practice & AI Tutor, Vocational Hub, Opportunities, Mentors).
- Right: Language selector dropdown (10 Indian flags/names), Theme toggle (Dark/Light), User Profile avatar with role badge.

### 5.2 Multi-Role Navigation Switching
- Role-specific contextual tabs render dynamically based on `user.role`:
  - **Student View:** Emphasizes Personal Learning, Gap Diagnostics, and Opportunities.
  - **Teacher View:** Highlights Class Roster, Lesson Generator Copilot, and Remedial Interventions.
  - **Admin View:** Displays Institutional Readiness, Accreditation Telemetry, and Cross-Department Heatmaps.

---

## 6. Loading, Empty, and Error States

### 6.1 Loading States
- **Skeleton Loaders:** Shimmer animation (`animate-pulse`) matching card and table geometry using neutral slate backgrounds (`bg-slate-800/50`).
- **AI Streaming / Generation Indicator:** Pulsing indigo badge accompanied by concise microcopy: *"Gemini 2.0 synthesizing pedagogical outline..."* or *"Offline engine computing deterministic roadmap..."*.

### 6.2 Empty States
- Consistently designed with:
  1. Centered minimalist SVG line illustration.
  2. Clear heading (e.g., *"No Active Interventions"*).
  3. Explanatory subtext explaining why it is empty.
  4. Primary actionable button (e.g., *"Explore Curated Courses"*).

### 6.3 Error & Resilience Banners
- **Non-blocking Toast Alerts:** Floating top-right notification with distinct icon and auto-dismiss after 4 seconds.
- **AI Fallback Banner:** When Gemini API key is absent or quota is exceeded, an informational amber banner informs the user: *"Running in Local Deterministic Mode — full functionality preserved without cloud API."*

---

## 7. Motion & Interaction Design

- **Principles:** Motion is functional, never decorative. Transitions provide spatial context for modal transitions and tab switches.
- **Timing:** 150ms for micro-interactions (button presses, hover states); 250ms for drawer/modal reveals.
- **Easing:** Standard `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out curve).
- **Accessibility:** Strict observance of `prefers-reduced-motion` media query to disable scale/translate transforms for sensitive users.

---

## 8. Accessibility (a11y) & Vernacular Standards

1. **Color Contrast:** All text tokens exceed WCAG 2.1 AA minimum ratio of $4.5:1$ against their respective backgrounds ($7:1$ for primary body text).
2. **Focus Visibility:** Standardized 2px high-visibility outline offset on keyboard focus tabs for complete keyboard navigability.
3. **Screen Readers:** ARIA labels on all icon-only buttons, modal dialogs, and progress bars.
4. **Multilingual Script Support:** Line-height defaults clamped at $1.5$ to ensure diacritical marks in Devanagari (Hindi, Marathi), Gujarati, Tamil, Telugu, and Bengali render with zero vertical clipping.
5. **Low-Bandwidth Mode:** Audio playback controls provide playback speed controls (0.75x, 1.0x, 1.25x) and lightweight fallback transcriptions.

---

## 9. Page-Level Layout Specifications

### 9.1 Student Dashboard Layout
- **Top Bar:** Personalized welcome banner with learner ID, department, target role, and overall readiness gauge.
- **Grid Column 1 (Left 60%):** Interactive Skill-Gap Radar + Next Best Recommended Action card.
- **Grid Column 2 (Right 40%):** Milestone Checklist + Recent Quiz Scores + Upcoming Mentor Session preview.
- **Bottom Shelf:** Live Ingestion Stream showing recent opportunities and hackathons.

### 9.2 Teacher Copilot & Intervention View
- **Split View:** Left pane contains Curriculum & Quiz Generator form; Right pane displays the generated bilingual lesson plan with immediate 1-click "Publish to Class" or "Export" buttons.
- **Lower Section:** Tabular risk tracking grid with status pills, priority tags, and quick-action resolution drawers.

### 9.3 Institutional Placement Readiness Page
- **KPI Summary Cards:** Average Batch Readiness, Total At-Risk Learners, Remedial Recovery Rate, Top Industry Skill Gaps.
- **Comparative Charts:** Bar chart of readiness across disciplines (Computer Science, Mechanical, Civil, Electrical, Vocational).
