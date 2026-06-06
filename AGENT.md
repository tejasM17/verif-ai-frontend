# Project Overview

- **Name:** VerifAI
- **Purpose:** Two-sided hiring platform connecting students with recruiters via credential verification & AI matching
- **Frontend:** React 19, Vite 8, Tailwind CSS 4, Framer Motion 12, React Router DOM 7, React Hook Form 7, Zod 4, Lucide React
- **Backend:** Python FastAPI (localhost:8000), Firebase Auth
- **Status:** Early stage — auth flows only, no dashboard pages

# Architecture

| Layer | Stack |
|-------|-------|
| Frontend | React 19 SPA (no SSR), Vite 8 dev server on :3000 |
| Backend | Python FastAPI at `VITE_API_URL` (default `localhost:8000`) |
| Auth Identity | Firebase Auth (email/password) |
| Auth Sessions | Custom JWT (access + refresh tokens) from FastAPI |
| Validation | Zod 4 on frontend, FastAPI/Pydantic on backend |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, dark mode via `.dark` class |
| Path alias | `@` → `/src` |

# Folder Map

| Directory | Purpose |
|-----------|---------|
| `src/lib/` | API client, Firebase init, Zod validators |
| `src/context/` | AuthContext with useReducer (single auth provider) |
| `src/components/auth/` | Auth UI primitives (card, input, button, layout) |
| `src/pages/` | Page components, all lazy-loaded via `React.lazy()` |
| `src/hooks/` | Reserved for custom hooks (empty) |
| `src/components/ui/` | Reserved for shared UI primitives (empty) |

# Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_API_URL` | FastAPI backend base URL | No (default `http://localhost:8000`) |

Firebase config is hardcoded in `src/lib/firebase.js` (project: verifai111). No env vars for Firebase keys.

# Authentication Flow

## Firebase + Custom JWT Dual Layer

1. **Firebase Auth** handles identity: `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`, `sendEmailVerification`
2. **Custom backend** validates Firebase ID token, issues JWT `access_token` + `refresh_token` + `user` object

## Registration (Student/Recruiter)

1. `createUserWithEmailAndPassword(auth, email, password)` → Firebase creates user
2. `sendEmailVerification(user)` triggered
3. `getIdToken(true)` → Firebase ID token
4. POST `/auth/{role}/register` with `{ firebase_token, ...profileFields }`
5. Backend returns `{ access_token, refresh_token, user }` → stored in localStorage
6. Navigate to `/verify-email`

## Login

1. `signInWithEmailAndPassword(auth, email, password)` → Firebase user
2. `getIdToken()` → Firebase ID token
3. POST `/auth/login` with `{ firebase_token }`
4. Backend returns `{ access_token, refresh_token, user }` → stored in localStorage
5. Navigate to `/{role}/dashboard`

## Token Refresh

1. 401 response intercepted in `api.js` fetch wrapper
2. POST `/auth/refresh` with `{ refresh_token }`
3. On success: overwrite stored tokens, retry original request
4. On failure: clear localStorage, redirect to `/session-expired`

## Storage Keys (localStorage)

| Key | Value |
|-----|-------|
| `{role}_access_token` | JWT access token |
| `{role}_refresh_token` | JWT refresh token |
| `user_role` | `"student"` or `"recruiter"` |

## Auth State (`AuthContext`)

```
{ user, firebaseUser, role, isLoading, isAuthenticated, error }
```

Provided via `useAuth()` hook with: `login`, `register`, `logout`, `clearError`.

# API Contracts

## Base
```
BASE_URL = http://localhost:8000
```

All auth requests send `Authorization: Bearer {access_token}` header (except login/register/refresh/health).

| Method | Route | Auth | Request Body | Response |
|--------|-------|------|-------------|----------|
| POST | `/auth/student/register` | Firebase token in body | `{ firebase_token, full_name, phone, college_name, branch, graduation_year, skills }` | `{ data: { access_token, refresh_token, user } }` |
| POST | `/auth/recruiter/register` | Firebase token in body | `{ firebase_token, company_name, recruiter_name, phone, company_website?, company_logo: null, designation }` | `{ data: { access_token, refresh_token, user } }` |
| POST | `/auth/login` | Firebase token in body | `{ firebase_token }` | `{ data: { access_token, refresh_token, user } }` |
| POST | `/auth/refresh` | None | `{ refresh_token }` | `{ data: { access_token, refresh_token } }` |
| POST | `/auth/logout` | Bearer token | `{}` | - |
| GET | `/health` | None | - | - |

# Database Schema

No frontend models — all schema lives in FastAPI backend. Validation implies:

### Student Profile (registration payload)
`{ firebase_token, full_name, phone, college_name, branch, graduation_year: number, skills }`

### Recruiter Profile (registration payload)
`{ firebase_token, company_name, recruiter_name, phone, company_website?, company_logo: null, designation }`

### Login response `user` object
Shape unknown (opaque backend object). Returned inside `{ data: { access_token, refresh_token, user } }`.

# Frontend State Management

- **Auth:** `AuthContext` + `useReducer` — single reducer, 6 actions (`SET_FIREBASE_USER`, `SET_USER`, `SET_LOADING`, `SET_ERROR`, `LOGOUT`, `CLEAR_ERROR`)
- **Forms:** Local `useState` for loading/error/success; `react-hook-form` + `zodResolver` for field state
- **Persistence:** localStorage for tokens/role; Firebase `onAuthStateChanged` rehydrates on reload
- **API Layer:** Custom fetch wrapper in `src/lib/api.js` with auto-refresh on 401, method helpers (`get/post/put/patch/delete`), separate `authApi` object for auth endpoints

# Coding Rules

- **Naming:** PascalCase components + files, camelCase utilities/functions, barrel `index.js` exports
- **Exports:** `export default` for components, `export` named for utilities
- **Error handling:** try-catch in all async ops; categorize Firebase errors by code (e.g. `auth/email-already-in-use`); set error via `auth/setError` or local state
- **Validation:** All forms use Zod schemas in `src/lib/validators.js` + `@hookform/resolvers/zod`. Password: 8-128 chars, 1 upper, 1 lower, 1 number
- **Imports:** Use `@/` path alias for `src/` imports
- **Lazy loading:** Every page component must be `React.lazy(() => import())`
- **Security:** Never log tokens; never move Firebase keys to env (hardcoded by design); Firebase `onAuthStateChanged` must handle null user (trigger logout)
- **Accessibility:** `aria-invalid`, `aria-describedby`, `role="alert"` on errors

# Current Features

## Implemented
- Student signup/login, Recruiter signup/login
- Forgot password, Reset password (via Firebase oobCode)
- Email verification polling (3s interval, manual check + resend)
- Session expired page, auto token refresh on 401
- Dark mode (`.dark` class toggle in Tailwind v4 `@theme`)
- Responsive two-column auth layout (single column mobile)
- Form validation (Zod + react-hook-form)
- Framer Motion page transitions + auth card animations

## In Progress
- None

## Planned
- Student dashboard (`/student/dashboard`), Recruiter dashboard (`/recruiter/dashboard`)
- Job search, profiles, AI matching, credential verification, analytics (all backend-dependent)

# Known Issues

- Google/LinkedIn social login buttons are placeholders ("coming soon")
- `README.md` is default Vite template (not customized)
- No loading skeleton components
- Dashboard pages referenced in redirects do not exist (will 404)

# Agent Notes

- **Backend is a separate repo.** All FastAPI endpoints assumed, not verified. If backend changes response contracts, update `src/lib/api.js` and this file.
- **Firebase config is hardcoded.** Never move to env vars — Firebase SDK config is public by design.
- **Dual token strategy:** Firebase token used ONLY for initial auth with backend. All subsequent API calls use backend JWT. Never mix.
- **Role is embedded in localStorage key** (`student_access_token` vs `recruiter_access_token`). API helpers extract role from `localStorage.getItem('user_role')`.
- **Refresh loop protection:** `api.js` uses `isRefreshing` flag to prevent concurrent refresh calls. Do not remove.
- **No TypeScript.** All files are `.jsx`. Do not add TS without explicit request.
- **Tailwind v4** uses `@import "tailwindcss"` (not `@tailwind` directives) and `@theme` for custom design tokens. No `tailwind.config.js`.
- **React 19** — `forwardRef` still works, no breaking changes for current patterns.
- **Vite 8** — config is minimal, no proxy configured. API calls go directly to `localhost:8000` (CORS handled by backend).
