# VerifAI Frontend — Deploy to Vercel

## One-time setup

1. Create a Vercel account at https://vercel.com (sign in with GitHub recommended).
2. In Vercel Dashboard, click **Add New… → Project**.
3. Import the GitHub repo that contains `verif-ai-frontend/`.
4. **Important:** in the "Root Directory" picker, set it to `verif-ai-frontend` (don't deploy from the repo root).
5. Framework preset: Vite (auto-detected).
6. Build command: `npm run build` (default).
7. Output directory: `dist` (default).

## Setting environment variables

In the Vercel project settings → **Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `VITE_API_URL` | `https://verifai-backend.onrender.com` | **No trailing slash.** The backend URL from the Render deploy. |
| `VITE_FIREBASE_API_KEY` | (copy from frontend `.env`) | |
| `VITE_FIREBASE_AUTH_DOMAIN` | (copy from frontend `.env`) | |
| `VITE_FIREBASE_DATABASE_URL` | (copy from frontend `.env`) | |
| `VITE_FIREBASE_PROJECT_ID` | (copy from frontend `.env`) | |
| `VITE_FIREBASE_STORAGE_BUCKET` | (copy from frontend `.env`) | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | (copy from frontend `.env`) | |
| `VITE_FIREBASE_APP_ID` | (copy from frontend `.env`) | |

Apply to **Production** (and optionally Preview if you want preview deploys to work).

Click **Deploy**. First build takes ~1 minute.

## CORS — required after first deploy

The backend's `main.py` currently allows only `http://localhost:3000`. Once the frontend has its Vercel URL:

1. Copy the Vercel URL (e.g. `https://verif-ai.vercel.app`).
2. In Render Dashboard → `verifai-backend` → Environment → set `CORS_ORIGINS` to that URL (plus `http://localhost:3000` for local dev, comma-separated).
3. Render auto-redeploys. Wait ~2 min.

Without this, the frontend will load but every API call will fail with a CORS error in the browser console.

## Smoke test

1. Open the Vercel URL in a private browser window.
2. You should see the login page (yellow-on-dark theme).
3. Sign up → log in.
4. Land on `/student` — you should see "Companies Hiring Now" (empty if seeder hasn't run, populated if it has).
5. Click any company → click "Apply for Job" → upload a PDF → fill in the "Why hire you" box → Submit.
6. After submitting, you should land on `/student/applied` with your application showing status `submitted`.

## URL you'll have

`https://verif-ai.vercel.app` (or whatever Vercel assigned) — this is your public frontend URL.

## Troubleshooting

- **Blank page after deploy:** check Vercel's "Functions" or "Build" log. Usually a missing env var or a build-time import error.
- **Login works but API calls 401:** the Firebase token isn't being accepted — check `VITE_FIREBASE_API_KEY` matches the Firebase project the backend's `firebase-key.json` points to.
- **API calls fail with CORS error:** see "CORS — required after first deploy" above.
- **"Failed to fetch" on everything:** the backend may be asleep (Render free tier sleeps after 15 min idle). First request takes ~30s to wake. Subsequent requests are fast.
