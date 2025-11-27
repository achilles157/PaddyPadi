import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBkrL9uPp_d0QoFMT-r-lcHXtOrKjFKZyU",
  authDomain: "paddypadi.firebaseapp.com",
  projectId: "paddypadi",
  storageBucket: "paddypadi.appspot.com",
  messagingSenderId: "483761534784",
  appId: "1:483761534784:web:7f58680f2b82803668eca5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);