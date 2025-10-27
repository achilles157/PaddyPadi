// src/services/firestoreService.js
import { db } from './firebase'; // Pastikan Anda mengimpor 'db' dari firebase.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc,
  serverTimestamp // Untuk timestamp otomatis dari server
} from 'firebase/firestore';

const REPORTS_COLLECTION = 'reports';

// Fungsi untuk membuat laporan baru
export const addReport = async (reportData) => {
  try {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      ...reportData,
      createdAt: serverTimestamp() // Otomatis menambahkan timestamp saat laporan dibuat
    });
    console.log("Document written with ID: ", docRef.id);
    return { id: docRef.id, ...reportData, createdAt: new Date() }; // Mengembalikan data dengan ID
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Fungsi untuk mengambil semua laporan berdasarkan userId
export const getReportsByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc") // Urutkan dari yang terbaru
    );
    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() // Konversi Firestore Timestamp ke Date object
    }));
    return reports;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Fungsi untuk menghapus laporan
export const deleteReport = async (reportId) => {
  try {
    await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error removing document: ", e);
    throw e;
  }
};