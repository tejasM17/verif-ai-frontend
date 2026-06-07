# VerifAI Frontend — Agent Guide

## Quick Start

```bash
npm install
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # Production build to dist/
npm run lint         # ESLint
```

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Forms | React Hook Form 7 + Zod 4 |
| Animation | Framer Motion 12 |
| Auth Identity | Firebase Auth (email/password) |
| Auth Sessions | Backend JWT (HTTP-only cookies + Bearer header) |

## Architecture

```
src/
├── lib/
│   ├── api.js              # Fetch wrapper, token management, auth interceptor
│   ├── firebase.js          # Firebase init, auth helpers
│   ├── validators.js        # Zod schemas
│   └── normalizeStudentProfile.js
├── context/
│   └── AuthContext.jsx      # Auth state (useReducer), login/register/logout
├── hooks/
│   └── useStudentProfile.js
├── services/                # API service modules (student, recruiter, application, company)
├── pages/                   # Lazy-loaded route components
├── components/
│   ├── auth/                # Auth UI (layout, inputs, guards, etc.)
│   ├── dashboard/           # Dashboard UI (sidebar, header, profile, etc.)
│   ├── applications/        # Application form, list, badges
│   ├── companies/           # Company cards, filters, detail panel
│   └── recruiter/           # Recruiter-specific components
```

## Authentication Flow

### Session Strategy
- Backend issues JWT `access_token` + `refresh_token` as HTTP-only cookies
- Frontend also stores tokens in `sessionStorage` and sends `Authorization: Bearer` header
- On 401, frontend interceptor attempts refresh via POST `/auth/refresh` with body token
- Backend `/auth/me` auto-refreshes via cookie if access token expired

### Page Refresh (Session Restore)
1. `AuthProvider` mounts → checks `hasStoredSession()` (sessionStorage)
2. Calls `GET /auth/me` with Bearer header
3. If access token valid → user data returned → session restored
4. If expired → backend auto-refreshes via cookie → returns new tokens + user data
5. If cookie missing → frontend interceptor refreshes via body token → retries `/auth/me`
6. All fail → `clearTokens()` → user sees login

### Login
1. `signInWithEmailAndPassword` (Firebase)
2. Get Firebase ID token
3. POST `/auth/login` with `{ firebase_token }`
4. Backend returns `{ access_token, refresh_token, user }` → stored in sessionStorage
5. Navigate to `/{role}/dashboard`

### Register
1. `createUserWithEmailAndPassword` (Firebase)
2. `sendEmailVerification`
3. POST `/auth/{role}/register` with `{ firebase_token, ...profileFields }`
4. Backend returns tokens + user → stored in sessionStorage
5. Navigate to `/verify-email`

### Logout
1. POST `/auth/logout` with refresh token
2. Clear sessionStorage + in-memory tokens
3. Firebase sign-out
4. Dispatch `LOGOUT` → redirects to login

## API Client (`src/lib/api.js`)

- `api.get/post/put/patch/delete/delete` — wrapper around `fetch()` with auth headers
- `authApi.*` — auth-specific endpoints (me, login, register, refresh, logout)
- Interceptor: on 401 → `attemptTokenRefresh()` → retry request
- `silentRefresh()` — direct refresh call (bypasses interceptor)
- All fetch calls include `credentials: 'include'` for cookie support

## Route Guards (`src/components/auth/RouteGuards.jsx`)

- `RequireAuth` — waits for `isLoading`, redirects to login if not authenticated
- `RequireRole({ role })` — same + checks role match, redirects to `/forbidden`

## Key Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `http://localhost:8000` | Backend URL |

## Coding Conventions

- PascalCase components, camelCase utilities
- `export default` for components, named exports for utilities
- Zod validation on all forms
- Lazy-load every page via `React.lazy()`
- Never log tokens
- No TypeScript (all `.jsx`)
- Tailwind v4: `@import "tailwindcss"` + `@theme` (no tailwind.config.js)
