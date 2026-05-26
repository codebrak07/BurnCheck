import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWBFGp6vXobCD4oTTdcZvmLOtp9Ic38nA",
  authDomain: "burncheck-3b5b5.firebaseapp.com",
  projectId: "burncheck-3b5b5",
  storageBucket: "burncheck-3b5b5.firebasestorage.app",
  messagingSenderId: "73802861166",
  appId: "1:73802861166:web:f1b76dd74da16c470af47f",
  measurementId: "G-XZFMENR1ZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };
