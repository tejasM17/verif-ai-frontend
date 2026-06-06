import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCw6yx5RnXQQDRkM39qdJKWedJtCXfBCWg",
  authDomain: "verifai111.firebaseapp.com",
  projectId: "verifai111",
  storageBucket: "verifai111.firebasestorage.app",
  messagingSenderId: "302055620165",
  appId: "1:302055620165:web:275ac5ca8d972fd4972d2c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).then(() => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'Firebase persistence set to LOCAL',
    timestamp: new Date().toISOString(),
  }));
}).catch((err) => {
  console.warn(JSON.stringify({
    level: 'warn',
    message: 'Firebase persistence set failed',
    error: err.message,
    timestamp: new Date().toISOString(),
  }));
});

function waitForAuthReady(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, timeoutMs);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timer);
      unsubscribe();
      resolve(user);
    }, (error) => {
      clearTimeout(timer);
      unsubscribe();
      reject(error);
    });
  });
}

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  onAuthStateChanged,
  signOut,
  waitForAuthReady,
};

export default app;