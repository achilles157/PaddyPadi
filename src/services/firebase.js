// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase Anda yang telah disalin
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan yang akan digunakan
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);