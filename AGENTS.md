# VerifAI Frontend — AGENTS.md

Keep this file updated whenever routes, pages, contexts, or env vars change. Minimal text, low context.

## Project rules
- strictly follow only the user task's context that what to implement or edit in frontend project, and do not suggest your ideas.
- only focus on implementing the user task

## Recent Fixes / Known Bugs
- **`CommandPalette.jsx` TDZ crash (fixed 2026-06-25):** `const isSearching = query.trim().length > 0;` was declared AFTER the `useMemo` that consumed it → `Cannot access 'isSearching' before initialization` crashed the entire `/student` page. Rule: **declare every `const`/`let` BEFORE any `useMemo`/`useCallback`/function expression that references it** in the same component body.
- **One-time `401 Unauthorized` on `GET /me`:** caused by a stale Firebase idToken in `localStorage` from a previous session. `AuthContext.jsx` already handles this — on `/me` failure it calls `removeToken()` and treats the user as logged out. If you see it in DevTools, it is self-healing on the next render. Do not "fix" by silencing the catch.
- **`ObjectMultiplex - malformed chunk "[object Object]"` in console:** harmless noise from MetaMask's `contentscript.js`, not from this app. Ignore.

## Run / Test / Lint
```
cd verif-ai-frontend
npm install
npm run dev          # Vite dev server on :3000 (proxies nothing — talks to backend on :8000 directly)
npm run build        # production build into dist/
npm run lint         # ESLint (js + jsx)
npm run test         # Vitest single run
npm run test:watch   # Vitest watch mode
```

## Required Env (.env, prefix with VITE_)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_API_URL` — defaults to `http://localhost:8000` if unset

## Stack
- React 19 + Vite 8 + React Router 7 (no Redux / TanStack Query — local state in contexts only)
- Tailwind v4 (utility-only, no config file)
- Firebase JS SDK 12 (auth only — backend owns Firestore/Mongo via Admin SDK)
- Axios 1 (single instance with bearer-token interceptor in `api/auth.js`)
- Vitest 4 + Testing Library (jsdom env, single run via `npm test`)

## Routes (App.jsx)
| Path | Access | Page |
|---|---|---|
| `/login` | public | `pages/Login.jsx` |
| `/signup` | public | `pages/Signup.jsx` |
| `/forgot-password` | public | `pages/ForgotPassword.jsx` (STUB) |
| `/student` | auth + role=student | wraps `Layout` → `StudentDashboard` (index), `Profile`, `Settings`, `CompanyDetail` (nested `company/:uid`) |
| `/recruiter` | auth + role=recruiter | wraps `Layout` → `RecruiterDashboard` (index), `Profile`, `Settings`, `CompanyDetail` (nested `company/:uid`) |
| `/dashboard` | auth | redirects to `/student` or `/recruiter` based on role |
| `*` | any | redirects to `/login` |

Both role layouts share the same nested route shape, so a recruiter can also browse `/student/company/:uid` (when logged in as student) and vice versa — `ProtectedRoute` enforces role per top-level path.

## Auth Flow (frontend)
1. `AuthProvider` (in `contexts/AuthContext.jsx`) reads `verifai_token` from localStorage on mount
2. If present → `GET /me` to rehydrate user state
3. Login (email/pw) → `POST /login` → store idToken → `GET /me` → navigate to role's home
4. Social login (Google/GitHub) → Firebase popup → `signInWithGoogle()/signInWithGithub()` → get Firebase idToken → `POST /google` or `POST /github` → store returned app idToken → `GET /me` → navigate
5. Signup → `POST /signup` → redirect to `/login` (note: role param is currently dropped — see Known Gaps)
6. Every axios request auto-attaches `Authorization: Bearer <idToken>` via interceptor in `api/auth.js`
7. `ProtectedRoute` wraps role-scoped routes; redirects to `/login` if no user, to role's home if wrong role

## State
- `AuthContext` — global user, loading, role, login/signup/social/logout methods. Hook: `useAuth()` (in `hooks/useAuth.js`)
- `ProfileContext` — current user's profile data, exposed inside `Layout`. Hook: `useProfile()`. Methods: `profile`, `updateProfile(updates)`, `refreshProfile()`
- `CompanySearchContext` — wraps the command-palette state: `query`, `setQuery`, `results`, `feed`, `loading`. Hook: `useCompanySearch()`
- `PaletteContext` — wraps the open/close state of the CommandPalette modal. Hook: `usePalette()`
- Token storage — `utils/token.js` (`verifai_token` key)

## File Map
```
src/
  main.jsx                       Root mount, StrictMode
  App.jsx                        Router + AuthProvider, defines all routes
  index.css                      Tailwind v4 + custom animations (fade-in, slide-up, shake, pulse-soft)
  firebase.js                    Firebase app init (uses VITE_FIREBASE_* env)
  setupTests.js                  @testing-library/jest-dom matchers
  api/
    auth.js                      Axios instance + every backend call (signup, login, me, profile, resume, photo, companies)
  contexts/
    AuthContext.jsx              User state, login/signup/social/logout, token persistence
    ProfileContext.jsx           Profile data + updateProfile wrapper
    CompanySearchContext.jsx     Wraps the command-palette state: `query`, `setQuery`, `results`, `feed`, `loading`. Hook: `useCompanySearch()`
    PaletteContext.jsx           Wraps the open/close state of the CommandPalette modal. Hook: `usePalette()`
  hooks/
    useAuth.js                   Throws if used outside AuthProvider
  services/
    googleAuth.js                signInWithGoogle() → Firebase idToken
    githubAuth.js                signInWithGithub() → Firebase idToken
  utils/
    token.js                     getToken / setToken / removeToken (localStorage)
  components/
    Layout.jsx                   App shell: Sidebar + header search + content card. Wraps in ProfileProvider
    Sidebar.jsx                  Left nav, profile popup with logout
    ProtectedRoute.jsx           Auth + role guard, shows loading spinner while checking
    CommandPalette.jsx           Ctrl/Cmd+K modal — searches companies + roles via CompanySearchContext
    PaletteTrigger.jsx           Header button that opens the palette
    CompanyCard.jsx              Reusable company card (used in feed + search results)
    auth/
      AuthLayout.jsx             Two-pane login/signup shell (hero image + form card)
      AuthInput.jsx              Floating-label input with password show/hide
      AuthButton.jsx             Yellow primary button with spinner
      SocialButton.jsx           Google/GitHub/Apple social buttons
      PasswordStrength.jsx       5-level strength meter (weak → very strong)
  pages/
    Login.jsx                    Email/pw + Google + GitHub
    Signup.jsx                   Email/pw + role select (student/recruiter) + Google + GitHub
    ForgotPassword.jsx           STUB — fake success after 1.5s, no API call
    Dashboard.jsx                Bare placeholder, not wired into routes
    StudentDashboard.jsx         STUB — empty card, no content yet
    RecruiterDashboard.jsx       STUB — empty card, no content yet
    Profile.jsx                  Avatar upload, name/skills edit (student), name/company edit (recruiter), resume upload/preview/delete (student)
    Settings.jsx                 Delete-profile flow (with confirm) + logout
    CompanyDetail.jsx            Public company profile at `/<role>/company/:uid` — fetches GET /companies/{uid}
  __tests__/
    Login.test.jsx
    AuthContext.test.jsx
    ProtectedRoute.test.jsx
```

## API surface used by this frontend (`src/api/auth.js`)
| Export | HTTP | Backend endpoint |
|---|---|---|
| `signup(email, password, role)` | POST | `/signup` |
| `login(email, password)` | POST | `/login` |
| `googleLogin(idToken)` | POST | `/google` |
| `githubLogin(idToken)` | POST | `/github` |
| `getMe()` | GET | `/me` |
| `getProfile()` | GET | `/profile/me` |
| `updateProfile(data)` | PUT | `/profile/me` |
| `deleteProfile()` | DELETE | `/profile/me` |
| `updateRole(role)` | PUT | `/profile/role` |
| `uploadPhoto(file)` | PUT | `/profile/photo` (multipart) |
| `getPhotoUrl(photoUrl)` | (helper) | prepends `API_BASE` to relative paths |
| `uploadResume(file)` | POST | `/resume/upload` (multipart) |
| `getResumeInfo()` | GET | `/resume/me` |
| `getResumeDownloadUrl(uid)` | (helper) | `${API_BASE}/resume/file/${uid}` |
| `deleteResume()` | DELETE | `/resume/me` |
| `searchCompanies({q, location, role, limit, skip})` | GET | `/companies/search` |
| `listCompanies({limit, skip})` | GET | `/companies` |
| `getCompany(uid)` | GET | `/companies/{uid}` |
| `getCompanyLogoUrl(uid)` | (helper) | `${API_BASE}/profile/photo/${uid}` |

## Backend endpoints NOT yet wired into the frontend (available but unused)
The backend seeder now populates 5,000 companies, 50,000 recruiters, and 250,000 jobs. These endpoints exist but have no UI yet — add them to `api/auth.js` + a page when needed:
- `GET /profile/student`, `GET /profile/recruiter`
- `POST /profile/onboarding`
- `GET /profile/{uid}`
- `POST /applications/submit`, `GET /applications/me`, `GET /applications/recruiter/me`, `GET /applications/{app_id}`, `PATCH /applications/{app_id}/status`

## Style Conventions
- Tailwind v4 utility-only (no separate config file)
- Color palette: yellow-400 primary accent, gray-950/900/800 surfaces, gray-400/500 muted text
- Layout grid: 60-wide fixed sidebar (`w-60`), `ml-60` main column, content padded `p-6`
- Animations: `animate-fade-in`, `animate-slide-up`, `animate-slide-down`, `animate-shake`, `animate-pulse-soft` — all defined in `index.css`
- Components named exports default (`export default function Foo()`)
- Imports: relative (`../components/...`), no path aliases

## API Contract (frontend ↔ backend)
- Base URL: `import.meta.env.VITE_API_URL` or `http://localhost:8000`
- Auth header: `Authorization: Bearer <idToken>` injected automatically
- Resume upload uses `multipart/form-data` with field name `file`
- Photo upload uses `multipart/form-data` with field name `file`
- All POST/PUT bodies are JSON unless multipart
- Photo/resume URLs returned as paths like `/profile/photo/{uid}` and `/resume/file/{uid}` — prepend `API_BASE` for absolute URLs (see `getPhotoUrl`, `getResumeDownloadUrl`)
- Backend staging data (from `python -m app.seed run`) lives in MongoDB Atlas at the same `MONGODB_URI` the API uses; the seeded recruiter accounts are real Firebase Auth users — log in via any `<email>` from `seed_data/seed_credentials.csv` with the printed password

## Code Style Rules
- No inline comments
- JSX + JS only (no TypeScript yet)
- Components are functions, default-exported
- Keep page files under ~500 lines; split out sub-components (e.g. `SkillInput`, `ResumePreviewModal` live inside `Profile.jsx` because they're tightly coupled)
- Tests live next to code under `src/__tests__/`

## Known Gaps
- Signup posts `role` to `/signup` but the backend drops it (per AGENTS.md "role param is currently dropped"). To pick a role at signup time, set it via `POST /profile/onboarding` immediately after first login instead.
- `ForgotPassword.jsx` is a 1.5-second fake-success stub — no real password reset email is sent.
- `StudentDashboard.jsx` and `RecruiterDashboard.jsx` are empty placeholder cards. The seeder is ready for these to be filled with applied companies, recommended jobs, recruiter activity, etc. — wire endpoints from the "NOT yet wired" section above.