# 🚀 VERIF-AI Setup Checklist

## Status: Frontend + Backend Connected & Ready

### ✅ Backend Status
- [x] Server running on `http://localhost:8000`
- [x] All routers loaded (auth, documents, analysis, profile, discover, verification)
- [x] MongoDB connected
- [x] Firebase initialized
- [x] API endpoints responding correctly
- [x] User registration working (test user created successfully)

### ✅ Frontend Status
- [x] Dev server running on `http://localhost:3000`
- [x] All components built and compiled
- [x] Backend API URLs configured
- [x] React Router with role-based routes
- [x] Responsive UI with Tailwind CSS

### ⚠️ Required: Firebase Credentials

To complete the setup, you need to provide your Firebase project credentials in `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000

# Get these from: https://console.firebase.google.com
VITE_FIREBASE_API_KEY=<your_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_bucket>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>
```

### 📋 Next Steps

**Option A: Use Your Own Firebase Project (Recommended)**
1. Go to: https://console.firebase.google.com/
2. Create or select a project
3. Register a Web app
4. Copy the Firebase SDK config
5. Paste values into `.env.local`
6. Enable Email/Password authentication in Firebase Console
7. Refresh frontend at `http://localhost:3000`

**Option B: Use Existing Firebase Project**
If you already have a Firebase project set up:
1. Get the config values from Firebase Console
2. Update `.env.local` with those values
3. Make sure Email/Password auth is enabled

### 🧪 Testing the Full Flow

Once you provide Firebase credentials:

1. **Register Flow**
   - Go to http://localhost:3000/register
   - Create student or recruiter account
   - Verify account in Firebase Console

2. **Upload Documents**
   - Student: Upload resume and certificates
   - Watch upload progress in browser

3. **Start Analysis**
   - Trigger AI verification process
   - Watch live WebSocket logs stream in real-time
   - See trust score calculated and displayed

4. **Discovery (Recruiter)**
   - Recruiter can search for students
   - View public profiles
   - Shortlist candidates

### 🔗 Connection Test Results

```
API Health:        ✅ Passing
Root Endpoint:     ✅ Passing
Auth Register:     ✅ Passing (test user created)
Auth Health:       ✅ Passing
MongoDB:           ✅ Connected
Firebase:          ✅ Initialized
Frontend:          ✅ Ready
```

### 📚 Quick Reference

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **Firebase Console**: https://console.firebase.google.com/
- **Frontend Code**: `/src`
- **Backend Code**: `../verif-ai-backend` (sibling directory)

### 🆘 Troubleshooting

**"Firebase: Error (auth/api-key-not-valid)"**
→ Update `.env.local` with valid Firebase credentials

**"Failed to connect to backend"**
→ Ensure backend is running on `http://localhost:8000`
→ Check `VITE_API_BASE_URL` in `.env.local`

**"CORS error"**
→ Backend should handle CORS (check backend logs)
→ If issue persists, update backend CORS settings

**"WebSocket connection failed"**
→ Backend WebSocket endpoint at `/api/v1/analysis/stream/{job_id}`
→ Requires valid Firebase token in query params

---

## 🎯 What's Ready to Test

✅ Complete authentication system (registration, login, logout)
✅ Role-based dashboards (Student vs Recruiter)
✅ Document upload with drag-and-drop
✅ Real-time analysis logs via WebSocket
✅ Trust score calculation and display
✅ Student discovery and search
✅ Profile shortlisting
✅ Responsive design for desktop and mobile

---

**Last Updated**: June 5, 2026
**Status**: Ready for Firebase credentials
