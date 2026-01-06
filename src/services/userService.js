import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Membuat dokumen profil user baru di Firestore.
 * Dipanggil setelah user berhasil mendaftar untuk menyimpan data profil.
 * @param {Object} user - Objek user dari Firebase Auth
 * @param {string} user.uid - User ID unik
 * @param {string} user.email - Email user
 * @returns {Promise<Object>} Data user yang disimpan
 */
export const createUserProfileDocument = async (user) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.email.split('@')[0],
        createdAt: serverTimestamp(),
    };

    await setDoc(userRef, userData);
    return userData;
};
