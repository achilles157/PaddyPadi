// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Ganti dengan konfigurasi dari Firebase Console Anda
const firebaseConfig = {
  apiKey: "AIzaSyBkrL9uPp_d0QoFMT-r-lcHXtOrKjFKZyU",
  authDomain: "paddypadi.firebaseapp.com",
  projectId: "paddypadi",
  storageBucket: "paddypadi.appspot.com",
  messagingSenderId: "483761534784",
  appId: "1:483761534784:web:7f58680f2b82803668eca5"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan yang akan kita gunakan di seluruh aplikasi
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);