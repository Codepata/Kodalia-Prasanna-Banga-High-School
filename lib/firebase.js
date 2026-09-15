// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <-- Added import
import {gtag} from "firebase/analytics"; // <-- Added import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

gtag("config", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, {origin: "firebase", firebase_id: process.env.NEXT_PUBLIC_FIREBASE_APP_ID, firebase_project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, firebase_app_name: process.env.NEXT_PUBLIC_FIREBASE_APP_NAME});

dataLayer.push({ event: "gtm.js", "gtm.start": 1789459880892, "gtm.uniqueEventId": 3 });
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);

export { app, analytics, auth };