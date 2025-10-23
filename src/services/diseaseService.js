// src/services/diseaseService.js

import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const getDiseaseById = async (id) => {
  try {
    console.log("Firestore: Mencari dokumen dengan ID:", id); // Log ID yang dicari
    const docRef = doc(db, 'disease', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Firestore: Dokumen ditemukan!", docSnap.data()); // Log jika ditemukan
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Firestore: Dokumen TIDAK ditemukan untuk ID:", id); // Log jika tidak ditemukan
      return null;
    }
  } catch (error) {
    console.error("Firestore: Error saat getDiseaseById:", error); // Log jika ada error koneksi/lainnya
    return null;
  }
};

export const getDiseases = async () => {
   try {
     console.log("Firestore: Mengambil semua dokumen dari 'disease'...");
     const querySnapshot = await getDocs(collection(db, 'disease'));
     console.log("Firestore: Snapshot query diterima, jumlah dokumen:", querySnapshot.size); // Log jumlah dokumen
     const diseases = querySnapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     }));
     return diseases;
   } catch (error) {
     console.error("Firestore: Error saat getDiseases:", error); // Log jika error
     return [];
   }
};

// --- Fungsi Baru untuk Admin ---

/**
 * Menambah atau Mengupdate data penyakit.
 * Menggunakan setDoc agar bisa membuat dokumen baru dengan ID spesifik
 * atau menimpa/mengupdate yang sudah ada.
 * @param {string} diseaseId - ID dokumen (misal: 'bacterial_leaf_blight')
 * @param {object} diseaseData - Objek berisi data penyakit (nama, penjelasan, dll.)
 */
export const saveDisease = async (diseaseId, diseaseData) => {
    try {
        console.log(`Firestore: Menyimpan data untuk ID: ${diseaseId}`, diseaseData);
        const docRef = doc(db, 'disease', diseaseId);
        // setDoc akan membuat dokumen jika belum ada, atau menimpa jika sudah ada.
        // Anda mungkin ingin menambahkan opsi merge: true jika hanya ingin update sebagian:
        // await setDoc(docRef, diseaseData, { merge: true });
        await setDoc(docRef, diseaseData);
        console.log("Firestore: Data penyakit berhasil disimpan.");
    } catch (error) {
        console.error("Firestore: Error saat saveDisease:", error);
        throw error;
    }
};

/**
 * (Opsional) Fungsi untuk menghapus data penyakit.
 * @param {string} diseaseId - ID dokumen yang akan dihapus
 */
export const deleteDisease = async (diseaseId) => {
    try {
        console.log(`Firestore: Menghapus dokumen dengan ID: ${diseaseId}`);
        const docRef = doc(db, 'disease', diseaseId);
        await deleteDoc(docRef);
        console.log("Firestore: Dokumen penyakit berhasil dihapus.");
    } catch (error) {
        console.error("Firestore: Error saat deleteDisease:", error);
        throw error;
    }
};