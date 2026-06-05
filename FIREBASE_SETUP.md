# Firebase Setup Guide for VERIF-AI Frontend

## 🔥 Getting Your Firebase Credentials

1. Go to: https://console.firebase.google.com/
2. Select your project (or create one)
3. Go to **Project Settings** (gear icon)
4. Scroll to **Your apps** → Find or create a Web app
5. Copy these values from the **Firebase SDK snippet**:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 📝 Update .env.local

Fill in these exact values in your `.c:\Users\Nishanth\MyProjects\hackathon\verif-ai-frontend\.env.local`:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=<your apiKey>
VITE_FIREBASE_AUTH_DOMAIN=<your authDomain>
VITE_FIREBASE_PROJECT_ID=<your projectId>
VITE_FIREBASE_STORAGE_BUCKET=<your storageBucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your messagingSenderId>
VITE_FIREBASE_APP_ID=<your appId>
```

## ✅ Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Optional: Enable **Google** for social login

## 🧪 Test the Connection

1. The frontend will auto-reload when you save `.env.local`
2. Try registering a new account
3. Check Firebase Console → Authentication → Users to see your account

---

**Need Help?** Check the official docs: https://firebase.google.com/docs/web/setup
