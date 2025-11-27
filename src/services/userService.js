import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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