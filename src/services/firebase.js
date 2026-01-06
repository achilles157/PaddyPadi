/**
 * Firebase Configuration dan Initialization
 * 
 * File ini menginisialisasi koneksi Firebase dengan konfigurasi
 * dari environment variables. Mengexport instance auth, db (Firestore),
 * dan messaging (FCM) untuk digunakan di seluruh aplikasi.
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/** Firebase Authentication instance */
export const auth = getAuth(app);

/** Firestore Database instance */
export const db = getFirestore(app);

/** Firebase Cloud Messaging instance */
export const messaging = getMessaging(app);
