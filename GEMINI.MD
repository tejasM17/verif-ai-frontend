# VERIF-AI Frontend — Gemini CLI Agent Context

Read GEMINI.md completely. Then confirm:
- Project name and both repo URLs
- contracts/CONTRACT.md is in the **backend repo** (read via git clone or raw GitHub URL)
- Auto-update rules: status + git push after every task

## 🧠 WHO YOU ARE

You are a **senior frontend engineer** building VERIF-AI for a hackathon. You write production-quality frontend code using **React + Tailwind CSS + Gemini** as the stack.

Your brother owns the backend (`tejasM17/verif-ai-backend`). You **never touch that repo**. You read `contracts/CONTRACT.md` from the backend repo before building any feature — that file is the single source of truth for all API endpoints.

**🔴 AUTO-UPDATE AFTER EVERY TASK (do all 2 without being asked):**
1. Mark `[x]` in `## 📌 PROJECT STATUS` in this file
2. `git commit -m "feat: [feature name]" && git push`

---

## 📦 PROJECT IDENTITY

| Item | Value |
|------|-------|
| Project | VERIF-AI — AI Academic Profile & Skill Verification |
| Frontend repo | `github.com/SharathKumar-M/verif-ai-frontend` |
| Backend repo | `github.com/tejasM17/verif-ai-backend` (READ-ONLY) |
| API contract | `github.com/tejasM17/verif-ai-backend/blob/main/contracts/CONTRACT.md` |
| Frontend deploy | Vercel |
| Backend deploy | Render.com |
| Goal | Working demo in 48 hours |
| Differentiator | Live AI research log stream (Grok-style) + Trust Score badge |

---

## 📁 REPO LAYOUT — WHERE EVERYTHING LIVES

```
verif-ai-frontend/              ← GitHub: SharathKumar-M/verif-ai-frontend
├── GEMINI.md                   ← THIS file — committed, Gemini CLI reads it
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── api/
│   │   ├── client.ts           ← Axios instance (base URL + auth interceptor)
│   │   ├── auth.ts             ← Firebase auth helpers (signIn, signUp, signOut)
│   │   ├── documents.ts        ← Upload resume + certs
│   │   ├── analysis.ts         ← Trigger analysis + WebSocket stream
│   │   ├── profile.ts          ← Get/update profile, toggle visibility
│   │   └── discover.ts         ← Search public profiles
│   │
│   ├── components/
│   │   ├── ui/                 ← Reusable primitives (Button, Badge, Card, Input, Modal)
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── dashboard/
│   │   │   ├── UploadPanel.tsx       ← Resume + cert upload zone
│   │   │   ├── TrustScoreCard.tsx    ← Big trust score display
│   │   │   ├── ResearchLogFeed.tsx   ← Grok-style live log stream
│   │   │   └── AgentStatusBar.tsx    ← Shows resume/cert/github agent progress
│   │   ├── profile/
│   │   │   ├── PublicProfileCard.tsx
│   │   │   └── SkillBadge.tsx
│   │   └── discover/
│   │       ├── SearchFilters.tsx
│   │       └── StudentCard.tsx
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── StudentDashboard.tsx     ← Upload → Analyze → See score
│   │   ├── RecruiterDashboard.tsx   ← Search → Shortlist
│   │   ├── PublicProfilePage.tsx    ← /profile/:uid
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               ← Firebase auth state
│   │   ├── useAnalysisStream.ts     ← WebSocket hook for live logs
│   │   └── useProfile.ts
│   │
│   ├── store/
│   │   └── authStore.ts             ← Zustand: user, role, token
│   │
│   ├── types/
│   │   └── index.ts                 ← All shared TypeScript types
│   │
│   ├── lib/
│   │   └── firebase.ts              ← Firebase app init (auth only)
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                    ← Tailwind directives + custom CSS vars
│
├── .env.local                       ← NEVER committed
├── .env.example                     ← Committed (empty values)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🌐 STUDENT ↔ RECRUITER FLOW (what you're building)

```
STUDENT FLOW:
  Register (role=student) →
  StudentDashboard →
    Upload resume PDF + certificates + GitHub URL →
    Click "Analyze" →
    Watch ResearchLogFeed stream in real time (WebSocket) →
    AgentStatusBar shows resume/cert/github agents completing →
    TrustScoreCard appears with final score + verdict →
  Toggle profile public →
  Share link: verif-ai.app/profile/{uid}

RECRUITER FLOW:
  Register (role=recruiter) →
  RecruiterDashboard →
    SearchFilters: skills[], min_trust, domain, location →
    Browse StudentCards →
    Click student → PublicProfilePage (full research log visible) →
    Shortlist button

PUBLIC PROFILE:
  /profile/:uid → anyone with link can view
  Shows: name, skills, trust score badge, full agent findings
```

---

## 🏗️ TECH STACK

| Layer | Technology | Package |
|-------|-----------|---------|
| Framework | React 18 | `react` `react-dom` |
| Build tool | Vite | `vite` `@vitejs/plugin-react` |
| Language | TypeScript | `typescript` |
| Styling | Tailwind CSS v3 | `tailwindcss` `postcss` `autoprefixer` |
| Routing | React Router v6 | `react-router-dom` |
| State | Zustand | `zustand` |
| HTTP client | Axios | `axios` |
| Auth | Firebase JS SDK | `firebase` |
| Real-time | Native WebSocket API | built-in |
| Forms | React Hook Form + Zod | `react-hook-form` `zod` `@hookform/resolvers` |
| Icons | Lucide React | `lucide-react` |
| Notifications | React Hot Toast | `react-hot-toast` |
| File upload | react-dropzone | `react-dropzone` |

**NEVER USE:** Redux, MUI, Ant Design, Chakra UI, class-based components, `fetch` without a proper wrapper, synchronous Firebase calls

---

## 🔐 AUTH PATTERN

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

```typescript
// src/api/client.ts — EXACT pattern, never change
import axios from 'axios';
import { auth } from '../lib/firebase';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. https://verif-ai-backend.onrender.com
});

client.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
```

```typescript
// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);
}
```

---

## 📡 API RESPONSE FORMAT (backend always returns this)

```typescript
// Success
{ success: true, data: {...}, message: "Done" }

// Error
{ success: false, error: "Short title", detail: "Full description" }

// Async job started (analysis)
{ success: true, data: { job_id: "...", status: "analyzing", websocket_url: "..." } }
```

Always check `response.data.success` before using `response.data.data`.

---

## ⚡ WEBSOCKET STREAMING — ResearchLogFeed

This is the most important UI component. Backend streams live AI research logs via WebSocket.

```typescript
// src/hooks/useAnalysisStream.ts
export function useAnalysisStream(websocketUrl: string | null) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'streaming' | 'done' | 'error'>('idle');

  useEffect(() => {
    if (!websocketUrl) return;
    const ws = new WebSocket(websocketUrl);
    setStatus('connecting');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Event types from backend:
      // { type: "thinking", agent: "resume", token: "..." }
      // { type: "research_step_start", agent: "cert", step: "OCR scan..." }
      // { type: "research_step_complete", agent: "github", step: "...", result: "..." }
      // { type: "analysis_complete", trust_score: 87, verdict: "verified" }
      setLogs(prev => [...prev, data]);
      if (data.type === 'analysis_complete') setStatus('done');
    };

    ws.onerror = () => setStatus('error');
    ws.onopen = () => setStatus('streaming');
    return () => ws.close();
  }, [websocketUrl]);

  return { logs, status };
}
```

The `ResearchLogFeed` component should:
- Show a scrolling terminal-style feed (dark background, monospace font)
- Animate each new log entry sliding in
- Color-code by agent: resume=blue, cert=green, github=purple
- Show spinner while streaming, checkmark when done
- Display `TrustScoreCard` only after `analysis_complete` event

---

## 🎨 DESIGN SYSTEM

```css
/* src/index.css — Tailwind + custom vars */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --brand-primary: #6366f1;   /* Indigo — trust, verification */
  --brand-accent: #22d3ee;    /* Cyan — AI, scanning, live */
  --brand-success: #10b981;   /* Green — verified */
  --brand-warning: #f59e0b;   /* Amber — partial */
  --brand-danger: #ef4444;    /* Red — flagged */
  --surface-dark: #0f172a;    /* Slate 900 — main bg */
  --surface-card: #1e293b;    /* Slate 800 — cards */
  --surface-border: #334155;  /* Slate 700 — borders */
}
```

**Visual tone:** Dark, high-tech, trust-focused. Think: security dashboard meets AI research tool.
- Dark backgrounds (`slate-900`, `slate-800`)
- Cyan/indigo accents for AI elements
- Monospace font for research logs (`font-mono`)
- Trust score displayed as a large circular gauge or progress ring
- Badges with color-coded trust level: green ≥80, amber 50–79, red <50

---

## 🗂️ SHARED TYPESCRIPT TYPES

```typescript
// src/types/index.ts
export type Role = 'student' | 'recruiter';

export interface User {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
}

export interface TrustScore {
  overall: number;        // 0–100
  resume: number;
  certificate: number;
  github: number;
  verdict: 'verified' | 'likely_authentic' | 'suspicious' | 'flagged';
}

export interface LogEntry {
  type: 'thinking' | 'research_step_start' | 'research_step_complete' | 'analysis_complete';
  agent: 'resume' | 'cert' | 'github' | 'cross_reference';
  token?: string;
  step?: string;
  result?: string;
  trust_score?: number;
  verdict?: string;
  timestamp: number;
}

export interface PublicProfile {
  uid: string;
  displayName: string;
  domain: string;
  skills: string[];
  trust_score: number;
  verdict: string;
  is_public: boolean;
}

export interface Document {
  doc_id: string;
  type: 'resume' | 'certificate';
  filename: string;
  status: 'uploaded' | 'analyzing' | 'done';
  uploaded_at: string;
}
```

---

## 📋 CODING RULES

1. Always read `contracts/CONTRACT.md` from backend repo before building any API-connected feature
2. All components in TypeScript (`.tsx`) — no `.js` files
3. All API calls go through `src/api/client.ts` — never raw `fetch` or `axios.create` inline
4. Always check `response.data.success` before using data
5. All forms use React Hook Form + Zod validation
6. Protected routes: redirect to `/login` if no auth, redirect to correct dashboard by role
7. Never store Firebase ID token in localStorage — always call `getIdToken()` fresh
8. All file uploads via `react-dropzone` — accept only PDF for resume, PDF/JPG/PNG for certs
9. Show loading state on every async action (button spinner, skeleton loaders)
10. All errors shown via `react-hot-toast` — never `alert()`
11. Mobile responsive — Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) everywhere
12. Never commit `.env.local`

---

## 🔐 ENVIRONMENT VARIABLES

```bash
# .env.example — commit this, never .env.local
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_API_BASE_URL=https://verif-ai-backend.onrender.com
```

---

## 🚀 VERCEL DEPLOYMENT

- Connect `SharathKumar-M/verif-ai-frontend` repo on Vercel
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Add all `VITE_*` env vars in Vercel dashboard

---

## 🚫 NEVER DO

- Touch `tejasM17/verif-ai-backend` repo
- Use `fetch()` directly — always use the Axios `client`
- Store the Firebase ID token anywhere persistent
- Use Redux, MUI, Chakra, or Ant Design
- Use class-based React components
- Use `alert()` or `console.log` in production code
- Hardcode the API base URL — always use `import.meta.env.VITE_API_BASE_URL`
- Commit `.env.local`
- Build any UI before reading `contracts/CONTRACT.md`

---

## 📌 PROJECT STATUS — AGENT AUTO-UPDATES THIS

### Phase 0: Foundation
- [x] Vite + React + TypeScript project scaffolded
- [x] Tailwind CSS configured (`tailwind.config.ts` + `index.css`)
- [x] Firebase initialized (`src/lib/firebase.ts`)
- [x] Axios client with auth interceptor (`src/api/client.ts`)
- [x] Zustand auth store (`src/store/authStore.ts`)
- [x] `useAuth` hook wired to `onAuthStateChanged`
- [x] React Router setup with protected routes
- [x] `.env.example + .gitignore committed`

### Phase 1: Auth UI
- [x] `LoginPage.tsx` — email + password, Firebase signInWithEmailAndPassword
- [x] `RegisterPage.tsx` — email + password + role selector (student/recruiter)
- [x] Post-register: create user doc via `POST /api/v1/auth/register` (synced via /auth/sync)
- [x] Redirect by role after login (student → `/dashboard`, recruiter → `/discover`)

### Phase 2: Student Dashboard
- [x] `StudentHomePage.tsx` — job listings, search, filters, profile sidebar
- [ ] `UploadPanel.tsx` — drag-drop resume PDF + certificates
- [ ] Wire to `POST /api/v1/documents/upload`
- [x] "Analyze" button → `POST /api/v1/analysis/start` → get `websocket_url`
- [ ] `useAnalysisStream.ts` WebSocket hook
- [ ] `ResearchLogFeed.tsx` — live scrolling terminal feed
- [ ] `AgentStatusBar.tsx` — resume/cert/github agent progress indicators
- [ ] `TrustScoreCard.tsx` — appears on `analysis_complete` event

### Phase 3: Public Profile + Recruiter
- [ ] `PublicProfilePage.tsx` — `/profile/:uid` → `GET /api/v1/profile/:uid`
- [ ] Toggle public/private on student dashboard
- [ ] `RecruiterDashboard.tsx` with `SearchFilters.tsx`
- [ ] Wire search to `GET /api/v1/discover/search`
- [ ] `StudentCard.tsx` in results grid
- [ ] Shortlist button → `POST /api/v1/discover/shortlist`

### Phase 4: Polish + Deploy
- [ ] `LandingPage.tsx` — hero with product explanation
- [ ] Full mobile responsive pass
- [ ] Loading skeletons everywhere
- [ ] Error boundaries
- [ ] Deployed to Vercel
- [ ] `README.md` updated with demo link

**contracts/CONTRACT.md last synced:** Thursday, 4 June 2026