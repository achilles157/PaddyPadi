// src/services/diseaseService.js

import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const getDiseases = async () => {
  try {
    // (Point 4) Menggunakan koleksi 'disease'
    const querySnapshot = await getDocs(collection(db, 'disease'));
    const diseases = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return diseases;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

export const getDiseaseById = async (id) => {
  try {
    // (Point 4) Menggunakan koleksi 'disease'
    const docRef = doc(db, 'disease', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};