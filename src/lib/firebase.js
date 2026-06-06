import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  onAuthStateChanged,
  signOut
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

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  onAuthStateChanged,
  signOut
};

export default app;