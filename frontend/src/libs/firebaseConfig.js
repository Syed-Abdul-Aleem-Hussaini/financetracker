// /src/libs/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyDsk6_8Hk_XTvzk3pKJKsx52mDX2K46Ilc",
  authDomain: "financetracker-aded6.firebaseapp.com",
  projectId: "financetracker-aded6",
  storageBucket: "financetracker-aded6.firebasestorage.app",
  messagingSenderId: "770764154315",
  appId: "1:770764154315:web:8af29376e65ba89d15424e",
  measurementId: "G-NNYDE9JCFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ✅ ADD THIS

export { auth }; // ✅ EXPORT auth so your other files can use it
