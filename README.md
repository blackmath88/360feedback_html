# 360° Leadership Feedback — Web Application

A browser-based, zero-dependency 360-degree leadership feedback system. Administrators create cases, invite respondents via unique token links, collect self-assessments and external ratings, and generate visual reports — all from static HTML files backed by either a Supabase database or the browser's `localStorage`.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Components](#2-architecture--components)
3. [Setup & Installation](#3-setup--installation)
4. [Usage Guide](#4-usage-guide)
5. [Features & Capabilities](#5-features--capabilities)
6. [Data & Customization](#6-data--customization)
7. [Security & Privacy](#7-security--privacy)
8. [Technical Details](#8-technical-details)
9. [Troubleshooting](#9-troubleshooting)
10. [License & Attribution](#10-license--attribution)

---

## 1. Project Overview

This application facilitates structured **360-degree leadership feedback** for individuals in leadership roles. A coordinator (administrator) creates a *case* for each leader under review, invites a group of peers or team members as external respondents, and asks the leader to complete a self-assessment. Once enough responses are collected, a comprehensive report is generated — visually comparing how the leader sees themselves against how others perceive them.

### Key Features

- **Self-assessment form** — The leader rates their own behaviour across five competency areas.
- **External feedback form** — Respondents complete the same questionnaire from a third-person perspective, accessed via a secure one-time token link.
- **Automated report** — Spider/radar charts, bar-chart comparisons, gap analysis, and open-ended reflections, all in the browser.
- **Bilingual** — Full German and English support throughout all forms and the report.
- **No server required** — Runs entirely from static files; data persists in `localStorage` when Supabase is unavailable.
- **Multiple export formats** — HTML (print-to-PDF), JSON, CSV, and plain text.

### Use Case

Any organisation running a cyclical leadership development programme can deploy this tool to its intranet or a static hosting service, configure Supabase credentials once, and immediately start collecting structured feedback.

---

## 2. Architecture & Components

### File Structure

```
.
├── index.html        # Administrator dashboard — case management
├── selbstbild.html   # Self-assessment form for the leader
├── fremdbild.html    # External feedback form for respondents
├── report.html       # Combined 360° report viewer
└── cmt-data.js       # Shared data layer (Supabase + localStorage)
```

### Pages

| File | Role | Access |
|------|------|--------|
| `index.html` | Create/edit/delete cases; add respondents; trigger email invitations; export data | Administrator |
| `selbstbild.html` | Self-rating questionnaire; URL param `?case=<id>` | Leader (via link) |
| `fremdbild.html` | External feedback form; URL params `?token=<token>&case=<id>` | Respondents (via unique invite link) |
| `report.html` | Full visual report; URL param `?case=<id>` | Administrator / Leader |

### Data Layer — `cmt-data.js`

The shared module exposes two namespaces:

- **`SB`** — Low-level Supabase REST calls (cases, respondents, self-assessments, response sets).
- **`CMT`** — High-level public API that every page uses. Tries Supabase first and falls back to `localStorage` on any network or auth failure.

### Data Flow

```
Administrator (index.html)
  │
  ├─► Creates case → saved in Supabase `cases` table (or localStorage)
  ├─► Adds respondent emails → unique tokens generated, saved in `respondents` table
  ├─► Sends mailto link with ?token=… → respondent opens fremdbild.html
  └─► Sends mailto link with ?case=… → leader opens selbstbild.html
           │                                        │
           ▼                                        ▼
  fremdbild.html                           selbstbild.html
  CMT.submitFremdbild()                    CMT.saveSelfAssessment()
  → saves to `response_sets`              → saves to `self_assessments`
           │                                        │
           └─────────────────┬──────────────────────┘
                             ▼
                        report.html
                   CMT.getReportData()
                   → reads all tables
                   → renders charts + analysis
```

---

## 3. Setup & Installation

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Optional: a [Supabase](https://supabase.com) project for persistent, multi-device storage
- A static file host or a simple local HTTP server (e.g., VS Code Live Server, `npx serve`, Python's `http.server`)

> **Note:** Opening files directly with `file://` URLs will work for some features but will block `localStorage` sharing across pages. Use a local HTTP server for best results.

### Local Development

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Deploying to a Static Host

Upload all files (`index.html`, `selbstbild.html`, `fremdbild.html`, `report.html`, `cmt-data.js`) to any static hosting provider (GitHub Pages, Netlify, Vercel, an internal intranet share, etc.). No build step is required.

### Supabase Configuration

Open `cmt-data.js` and update the two constants at the top:

```js
const SUPABASE_URL = 'https://<your-project>.supabase.co';
const SUPABASE_KEY = '<your-anon-public-key>';
```

Your Supabase project needs four tables with the following minimum schema:

| Table | Key Columns |
|-------|-------------|
| `cases` | `id`, `name`, `role`, `unit`, `year`, `cycle`, `owner`, `notes`, `status`, `created_at` |
| `respondents` | `id`, `case_id`, `email`, `token`, `submitted`, `submitted_at`, `created_at` |
| `self_assessments` | `id`, `case_id`, `answers` (jsonb), `reflection` (jsonb), `updated_at` |
| `response_sets` | `id`, `case_id`, `respondent_id`, `answers` (jsonb), `open_answers` (jsonb) |

If you do not have Supabase, the application falls back to `localStorage` automatically — no configuration needed.

### Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome / Edge 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Safari 14+ | ✅ Full support |
| Internet Explorer | ❌ Not supported |

---

## 4. Usage Guide

### Step 1 — Create a Case (Administrator)

1. Open `index.html`.
2. Click **Neuer Fall** (New Case).
3. Fill in the leader's name, role, organisational unit, year, and cycle.
4. Click **Erstellen** (Create). The case appears in the dashboard.

### Step 2 — Add Respondents

1. Click **Aktionen → Feedbackgeber verwalten** on the relevant case row.
2. Enter each respondent's email address and click **Hinzufügen** (Add).
3. A minimum of **3 respondents** must submit before the report can be generated (anonymity threshold).

### Step 3 — Send Invitations

**External feedback (respondents):**
- Click **✉ Per Mail einladen** next to each respondent, or **✉ Alle Ausstehende einladen** for a batch send.
- Your default email client opens with a pre-filled message containing the respondent's unique link (`fremdbild.html?token=…&case=…`).
- Alternatively, click **Link kopieren** to copy the link manually.

**Self-assessment (leader):**
- Click **✉ Per Mail senden** next to the *Selbstbild-Link* to email the leader their personal link (`selbstbild.html?case=…`).

### Step 4 — Complete the Forms

**Respondents** open their unique link and:
1. Choose their preferred language (DE/EN).
2. Rate each statement on a scale of 1 (strongly disagree) to 5 (strongly agree).
3. Answer four open-ended reflection questions.
4. Submit — the form is locked and the response is stored.

**The leader** follows the same process on `selbstbild.html`, but rates statements from a first-person perspective.

### Step 5 — View the Report

Once at least 3 respondents have submitted **and** the leader has completed the self-assessment:

1. Go to `index.html`.
2. Click **Aktionen → 📊 Bericht öffnen** on the case row.
3. The `report.html` page loads with the full analysis.

### Step 6 — Export

In `index.html`, click **Aktionen → Exportieren…** and choose:

| Format | Description |
|--------|-------------|
| **HTML** | Opens `report.html` — use browser Print → Save as PDF |
| **JSON** | Full raw data export for archiving or further processing |
| **CSV** | Competency averages table (semicolon-delimited) |
| **Text** | Human-readable plain-text summary |

---

## 5. Features & Capabilities

### Questionnaire Structure

The questionnaire comprises **77 statements** organised into **5 competency areas**, each with multiple sub-scales:

| # | Competency Area | Sub-scales |
|---|-----------------|------------|
| 1 | **Leadership by Example** | Trust & Confidence, Credibility, Dealing with Ambivalence |
| 2 | **Providing Guidance** | Developing Alignment, Future Prospects, Driving Innovation |
| 3 | **Managing Effectively** | Accountability, Goal Setting, Evaluating Results |
| 4 | **Developing Employees** | Empowerment, Coaching, Development, Empathy |
| 5 | **Shaping the Work Environment** | Communication, Resource Management, Conflict Handling, Change Management, Working Relationships |

Each competency area also contains a **"Leadership Pitfalls"** sub-scale (see [Section 6](#6-data--customization)).

### Self-Assessment vs. External Feedback

- The self-assessment (`selbstbild.html`) uses **first-person** statements ("I can convince others…").
- The external feedback form (`fremdbild.html`) automatically rewrites statements to **third-person** ("This leader can convince others…") using the `CMT.toFremd()` transformation in `cmt-data.js`.

### Anonymisation

Individual respondent scores are never shown separately. The report displays only **aggregated averages** across all submitted external responses. A minimum of 3 submissions is enforced before any aggregated data is visible.

### Report Visualisation

The generated report includes:

- **Spider/radar charts** — one overall chart plus per-competency charts, comparing self vs. external averages.
- **Bar-chart rows** — per sub-scale comparison with dots for self (blue), external average (red), and individual respondent values (grey).
- **Gap analysis table** — highlights *blind spots* (self > external by ≥ 0.8) and *hidden strengths* (external > self by ≥ 0.8).
- **Open-ended reflections** — aggregated qualitative responses from both the leader and respondents.

### Bilingual Support

All questionnaire text, labels, and UI elements are available in **German** and **English**. Language selection is stored per session and visible in the navigation bar of `selbstbild.html` and `fremdbild.html`.

---

## 6. Data & Customization

### Modifying Questionnaire Content

All questionnaire content lives in `cmt-data.js` in the `CMT.sections` array. Each section has:

```js
{
  id: 'unique_id',
  de: 'German Section Title',
  en: 'English Section Title',
  color: '#hexcolor',
  subsections: [
    {
      id: 'subsection_id',
      de: 'German Subsection Title',
      en: 'English Subsection Title',
      trap: false,           // true = Leadership Pitfalls sub-scale
      questions: [
        { id: 'q1', de: 'German statement…', en: 'English statement…', trap: false }
      ]
    }
  ]
}
```

To add or edit questions, modify the relevant `questions` array. Question `id` values must be unique across the entire questionnaire (they are used as dictionary keys in stored answers).

Open-ended reflection questions for both the leader (`CMT.selfReflection`) and respondents (`CMT.fremdReflection`) are also defined in `cmt-data.js` and follow the same `{id, de, en}` structure.

### Rating Scale

All quantitative items use a **1–5 Likert scale**:

| Value | Meaning |
|-------|---------|
| 1 | Strongly disagree / Never |
| 2 | Rather disagree / Rarely |
| 3 | Partially agree / Sometimes |
| 4 | Rather agree / Often |
| 5 | Strongly agree / Always |

Averages are computed per sub-scale and per section. Trap/pitfall questions are **excluded** from averages but are shown separately in the report.

### Leadership Pitfalls Sub-scale

Each competency area contains a dedicated **"Check: Leadership Pitfalls"** sub-scale (`trap: true`). These statements are phrased as critical self-reflections (e.g., "I sometimes set standards I cannot meet myself"). They appear in a distinct style in the report and are intentionally excluded from the main competency averages to avoid skewing results.

---

## 7. Security & Privacy

### Data Storage

- **Supabase (default):** Data is stored in a PostgreSQL database hosted on Supabase. Communication is over HTTPS using the project's anonymous public key. Row-level security policies should be configured on the Supabase project as appropriate for your deployment.
- **localStorage (fallback):** When Supabase is unreachable, all data is stored in the browser's `localStorage` under the key `cmt360_cases`. Data is tied to the browser/device and is not transmitted anywhere.

### Respondent Anonymity

- Each respondent is assigned a **cryptographically random 64-character hex token** (`CMT.newToken()` uses `crypto.getRandomValues`).
- The report never displays individual scores — only aggregated averages are shown.
- Report generation is blocked until at least **3 respondents** have submitted (configurable in `index.html`).

### Token-Based Access Control

- Respondent links contain a unique token (`?token=…`). Without the correct token, the feedback form cannot be submitted.
- Self-assessment links contain only the case ID (`?case=…`). Ensure this link is shared only with the leader.
- There is no authentication layer on `index.html` by default; protect it using your hosting platform's access controls (HTTP Basic Auth, VPN, private network, etc.) if required.

### Data Export for Compliance

All case data can be exported as JSON at any time from `index.html`. This allows you to retain a local archive of feedback data in compliance with data retention policies.

---

## 8. Technical Details

### Technology Stack

| Layer | Technology |
|-------|------------|
| UI / Logic | Vanilla HTML5, CSS3, JavaScript (ES2020+) |
| Typography | Google Fonts — *Inter* (sans-serif) and *PT Serif* |
| Charts | Inline SVG (no charting library) |
| Database | Supabase REST API (PostgreSQL) |
| Fallback storage | Browser `localStorage` |
| Unique IDs | `Date.now().toString(36)` + `Math.random()` |
| Secure tokens | `crypto.getRandomValues` (Web Crypto API) |

### Key Dependencies

This project has **no npm/bundler dependencies**. The only external resources loaded at runtime are:

- Google Fonts (two font families, loaded via CDN — can be self-hosted)
- Supabase REST API (only if credentials are configured)

All other logic is self-contained in the five project files.

### Browser Storage Mechanisms

| Mechanism | Used For |
|-----------|----------|
| `localStorage` | Offline/fallback case storage (`cmt360_cases` key) |
| URL parameters | Passing `case` ID and respondent `token` between pages |
| Session state | Language selection and in-progress answers on forms |

---

## 9. Troubleshooting

### The feedback form shows the report instead of an empty form

Ensure respondents are opening `fremdbild.html?token=…&case=…` (the feedback entry page), not `report.html`. Verify the link generated in the email invitation starts with `fremdbild.html`.

### "Bericht (n/3 nötig)" — Report button is greyed out

The report requires at least **3 submitted external responses**. Check the respondent list for pending submissions.

### Data not persisting between sessions

If Supabase credentials are not configured (or the project is unreachable), data is stored in `localStorage`. Data stored this way is **browser- and device-specific**. Use the JSON export to back up data or configure Supabase for cross-device access.

### Supabase errors in the browser console

Messages prefixed with `[CMT]` indicate Supabase API failures. The application automatically falls back to `localStorage`. Check:
- That `SUPABASE_URL` and `SUPABASE_KEY` in `cmt-data.js` are correct.
- That the required tables exist and have the correct column names.
- That your Supabase project is not paused (free-tier projects pause after inactivity).

### Email client does not open

The invitation links use `mailto:` URIs. Ensure the user's browser has a default email client configured. The full link is also available via the **"Link kopieren"** (copy link) button as a fallback.

### Fonts not loading

If deployed in an environment without internet access, the Google Fonts CDN will be unreachable. Download *Inter* and *PT Serif* and host them locally, then update the `<link>` tags in each HTML file accordingly.

---

## 10. License & Attribution

This project is provided as-is for educational and organisational use.  
No warranty is expressed or implied.

**Status:** Active development — contributions and adaptations welcome.
