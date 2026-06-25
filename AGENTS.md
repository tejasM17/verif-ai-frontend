# VerifAI Frontend — AGENTS.md

Keep this file updated whenever routes, pages, contexts, or env vars change. Minimal text, low context.

## Project rules
- strictly follow only the user taks's context that what to implement or edit in frontend project, and dod not suggest your ideas.
- only focus on implementing the user task

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

## Routes (App.jsx)
| Path | Access | Page |
|---|---|---|
| `/login` | public | `pages/Login.jsx` |
| `/signup` | public | `pages/Signup.jsx` |
| `/forgot-password` | public | `pages/ForgotPassword.jsx` |
| `/student` | auth + role=student | wraps `Layout` → `StudentDashboard` at index, `Profile`, `Settings` |
| `/recruiter` | auth + role=recruiter | wraps `Layout` → `RecruiterDashboard` at index, `Profile`, `Settings` |
| `/dashboard` | auth | redirects to `/student` or `/recruiter` based on role |
| `*` | any | redirects to `/login` |

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
- Token storage — `utils/token.js` (`verifai_token` key)

## File Map
```
src/
  main.jsx                       Root mount, StrictMode
  App.jsx                        Router + AuthProvider, defines all routes
  index.css                      Tailwind v4 + custom animations (fade-in, slide-up, shake, pulse-soft)
  firebase.js                    Firebase app init (uses VITE_FIREBASE_* env)
  api/
    auth.js                      Axios instance + every backend call (signup, login, me, profile, resume, photo)
  contexts/
    AuthContext.jsx              User state, login/signup/social/logout, token persistence
    ProfileContext.jsx           Profile data + updateProfile wrapper
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
    Dashboard.jsx                Bare placeholder, not used by routes
    StudentDashboard.jsx         STUB — empty card, no content yet
    RecruiterDashboard.jsx       STUB — empty card, no content yet
    Profile.jsx                  Avatar upload, name/skills edit (student), name/company edit (recruiter), resume upload/preview/delete (student)
    Settings.jsx                 Delete-profile flow (with confirm) + logout
  __tests__/
    Login.test.jsx
    AuthContext.test.jsx
    ProtectedRoute.test.jsx
    setupTests.js                @testing-library/jest-dom matchers
```

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

## Code Style Rules
- No inline comments
- JSX + JS only (no TypeScript yet)
- Components are functions, default-exported
- Keep page files under ~500 lines; split out sub-components (e.g. `SkillInput`, `ResumePreviewModal` live inside `Profile.jsx` because they're tightly coupled)
- Tests live next to code under `src/__tests__/`

