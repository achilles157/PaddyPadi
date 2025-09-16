// src/services/userService.js
import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Membuat dokumen pengguna baru di koleksi 'users' setelah registrasi.
 * @param {object} user - Objek user dari Firebase Auth setelah registrasi.
 */
export const createUserProfileDocument = async (user) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.email.split('@')[0], // Nama default dari email
        createdAt: serverTimestamp(),
    };

    await setDoc(userRef, userData);
    return userData;
};