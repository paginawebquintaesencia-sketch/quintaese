import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required config values are present
const isConfigured = Object.values(firebaseConfig).every(
  (value) => value !== undefined && value !== ""
);

// Initialize Firebase only if configured, otherwise provide a mock or throw a clear error in development
let app;
let auth: any;
let db: any;

if (!isConfigured) {
  if (typeof window !== "undefined") {
    console.warn(
      "Firebase is not configured. Please check your .env.local file and ensure all variables are set."
    );
  }
} else {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseApp() {
  return app;
}

export { auth, db };

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !app) {
    return Promise.resolve(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((supported) =>
      supported ? getAnalytics(app) : null,
    );
  }

  return analyticsPromise;
}
