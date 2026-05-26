import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
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
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
