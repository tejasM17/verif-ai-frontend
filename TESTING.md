# VerifAI — Testing Guide

## Backend Tests

### Setup

```bash
cd verifai-backend
pip install -r requirements.txt
```

### Run All Tests

```bash
pytest app/tests/ -v
```

### Run Specific Test File

```bash
pytest app/tests/test_auth.py -v
pytest app/tests/test_student.py -v
pytest app/tests/test_recruiter.py -v
```

### Test Architecture

| Layer | Strategy |
|-------|----------|
| Firebase | Mocked via `@patch("app.services.auth.verify_firebase_token")` |
| MongoDB | `InMemoryAuthRepository` (autouse fixture in conftest.py) |
| Firestore | Dict-backed mocks for `StudentRepository`/`RecruiterRepository` |
| Rate Limiting | Disabled via `RATE_LIMIT_ENABLED=false` |
| HTTP Client | `httpx.AsyncClient` with `ASGITransport` (in-process, no real server) |

### Test Files

| File | Tests | Coverage |
|------|-------|----------|
| `test_auth.py` | 18 | Register (student/recruiter, Firebase/email), Login, /auth/me, Refresh, Logout, Role guards |
| `test_student.py` | 2 | Student profile, Recruiter blocked from student routes |
| `test_recruiter.py` | 3 | Recruiter profile, Student blocked from recruiter routes, Delete profile |

### Auth Endpoint Tests

| Test | Endpoint | Expected |
|------|----------|----------|
| Health check | `GET /health` | 200 |
| Student register (Firebase) | `POST /auth/register/student` | 200 + JWT pair |
| Student register (email) | `POST /auth/register/student` | 200 + user data |
| Student register (no creds) | `POST /auth/register/student` | 422 |
| Recruiter register (Firebase) | `POST /auth/register/recruiter` | 200 + JWT pair |
| Recruiter register (email) | `POST /auth/register/recruiter` | 200 + user data |
| Duplicate email | `POST /auth/register/student` | 409 USER_ALREADY_REGISTERED |
| Login (Firebase) | `POST /auth/login` | 200 + access_token |
| Login (email) | `POST /auth/login` | 200 + access_token |
| Login wrong password | `POST /auth/login` | 401 INVALID_CREDENTIALS |
| Login unregistered | `POST /auth/login` | 404 USER_NOT_REGISTERED |
| /auth/me (Bearer) | `GET /auth/me` | 200 + user data |
| /auth/me (no token) | `GET /auth/me` | 401 NO_CREDENTIALS |
| /auth/me (cookie) | `GET /auth/me` | 200 + user data |
| Token refresh | `POST /auth/refresh` | 200 + new tokens |
| Refresh reuse | `POST /auth/refresh` | 401 TOKEN_REUSED |
| Protected endpoint (cookie) | `GET /student/profile` | 200 |
| Logout | `POST /auth/logout` | 200 |
| Role guard (student) | `GET /student/profile` | 200 |
| Role guard (recruiter→student) | `GET /student/profile` | 403 ROLE_MISMATCH |
| Role guard (student→recruiter) | `GET /recruiter/profile` | 403 ROLE_MISMATCH |

## Frontend

No automated frontend tests. Manual testing:

1. Start backend: `cd verifai-backend && uvicorn app.main:app --reload --port 8000`
2. Start frontend: `cd verifai-frontend && npm run dev`
3. Test login → page refresh → session persists
4. Test register → verify-email → login flow
5. Test role-based routing (student/recruiter dashboards)
