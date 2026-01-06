import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

const REPORTS_COLLECTION = 'reports';

/**
 * Menambahkan laporan baru ke Firestore dengan timestamp server.
 * @param {Object} reportData - Data laporan yang akan ditambahkan
 * @returns {Promise<Object>} Data laporan dengan ID yang baru dibuat
 */
export const addReport = async (reportData) => {
  try {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      ...reportData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...reportData, createdAt: new Date() };
  } catch (e) {
    console.error("Error adding document:", e);
    throw e;
  }
};

/**
 * Mengambil semua laporan milik user tertentu.
 * @param {string} userId - ID user
 * @returns {Promise<Array>} Array laporan terurut berdasarkan createdAt
 */
export const getReportsByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    return reports;
  } catch (e) {
    console.error("Error getting documents:", e);
    throw e;
  }
};

/**
 * Menghapus laporan berdasarkan ID.
 * @param {string} reportId - ID laporan yang akan dihapus
 */
export const deleteReport = async (reportId) => {
  try {
    await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
  } catch (e) {
    console.error("Error removing document:", e);
    throw e;
  }
};
