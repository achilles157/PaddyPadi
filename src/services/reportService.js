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

// Fungsi untuk mendapatkan semua laporan (atau laporan spesifik user)
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
    console.error("Error fetching reports: ", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan laporan berdasarkan ID
export const getReportById = async (reportId) => {
  try {
    const reportDocRef = doc(db, 'reports', reportId);
    const reportDoc = await getDoc(reportDocRef);
    if (reportDoc.exists()) {
      return { ...reportDoc.data(), id: reportDoc.id };
    } else {
      console.log("No such report document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching report by ID: ", error);
    throw error;
  }
};

// Fungsi untuk menambahkan laporan baru
export const addReport = async (reportData) => {
  try {
    // reportData harus menyertakan userId, imageURL, prediction, timestamp, dll.
    const newReportRef = await addDoc(reportsCollectionRef, reportData);
    return newReportRef.id;
  } catch (error) {
    console.error("Error adding report: ", error);
    throw error;
  }
};

// Fungsi untuk memperbarui laporan
export const updateReport = async (reportId, updatedData) => {
  try {
    const reportDocRef = doc(db, 'reports', reportId);
    await updateDoc(reportDocRef, updatedData);
    console.log("Report updated successfully!");
  } catch (error) {
    console.error("Error updating report: ", error);
    throw error;
  }
};

// Fungsi untuk menghapus laporan
export const deleteReport = async (reportId) => {
  try {
    const reportDocRef = doc(db, 'reports', reportId);
    await deleteDoc(reportDocRef);
    console.log("Report deleted successfully!");
  } catch (error) {
    console.error("Error deleting report: ", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan laporan terbaru 
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
    console.error("Error fetching latest reports: ", error);
    throw error;
  }
};