import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  where
} from 'firebase/firestore';

const reportsCollectionRef = collection(db, 'reports');

/**
 * Mengambil semua laporan, opsional filter berdasarkan userId.
 * @param {string|null} userId - ID user untuk filter (null untuk semua laporan)
 * @returns {Promise<Array>} Array laporan terurut berdasarkan timestamp
 */
export const getReports = async (userId = null) => {
  try {
    let q;
    if (userId) {
      q = query(reportsCollectionRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
    } else {
      q = query(reportsCollectionRef, orderBy('timestamp', 'desc'));
    }
    const data = await getDocs(q);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

/**
 * Mengambil laporan berdasarkan ID.
 * @param {string} reportId - ID laporan
 * @returns {Promise<Object|null>} Data laporan atau null jika tidak ditemukan
 */
export const getReportById = async (reportId) => {
  try {
    const reportDocRef = doc(db, 'reports', reportId);
    const reportDoc = await getDoc(reportDocRef);
    if (reportDoc.exists()) {
      return { ...reportDoc.data(), id: reportDoc.id };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    throw error;
  }
};

/**
 * Menambahkan laporan baru.
 * @param {Object} reportData - Data laporan yang akan ditambahkan
 * @returns {Promise<string>} ID laporan yang baru dibuat
 */
export const addReport = async (reportData) => {
  try {
    const newReportRef = await addDoc(reportsCollectionRef, reportData);
    return newReportRef.id;
  } catch (error) {
    console.error("Error adding report:", error);
    throw error;
  }
};

/**
 * Mengupdate laporan yang sudah ada.
 * @param {string} reportId - ID laporan yang akan diupdate
 * @param {Object} updatedData - Data yang akan diupdate
 */
export const updateReport = async (reportId, updatedData) => {
  try {
    const reportDocRef = doc(db, 'reports', reportId);
    await updateDoc(reportDocRef, updatedData);
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};

/**
 * Menghapus laporan berdasarkan ID.
 * @param {string} reportId - ID laporan yang akan dihapus
 */
export const deleteReport = async (reportId) => {
  try {
    const reportDocRef = doc(db, 'reports', reportId);
    await deleteDoc(reportDocRef);
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

/**
 * Mengambil laporan terbaru dengan limit jumlah.
 * @param {number} count - Jumlah laporan yang diambil (default: 5)
 * @param {string|null} userId - ID user untuk filter (opsional)
 * @returns {Promise<Array>} Array laporan terbaru
 */
export const getLatestReports = async (count = 5, userId = null) => {
  try {
    let q;
    if (userId) {
      q = query(reportsCollectionRef, where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(count));
    } else {
      q = query(reportsCollectionRef, orderBy('timestamp', 'desc'), limit(count));
    }
    const data = await getDocs(q);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error fetching latest reports:", error);
    throw error;
  }
};
