import { db } from './firebase';
import { collection, getDocs, doc, getDoc, deleteDoc, setDoc, addDoc } from 'firebase/firestore';

/**
 * Mengambil data penyakit berdasarkan ID.
 * @param {string} id - ID dokumen penyakit
 * @returns {Promise<Object|null>} Data penyakit atau null jika tidak ditemukan
 */
export const getDiseaseById = async (id) => {
  try {
    const docRef = doc(db, 'disease', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching disease by ID:", error);
    return null;
  }
};

/**
 * Mengambil semua data penyakit dari Firestore.
 * @returns {Promise<Array>} Array berisi semua data penyakit
 */
export const getDiseases = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'disease'));
    const diseases = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return diseases;
  } catch (error) {
    console.error("Error fetching diseases:", error);
    return [];
  }
};

/**
 * Menyimpan atau mengupdate data penyakit.
 * @param {string|null} id - ID dokumen (null untuk dokumen baru)
 * @param {Object} data - Data penyakit yang akan disimpan
 * @throws {Error} Jika gagal menyimpan data
 */
export const saveDisease = async (id, data) => {
  try {
    if (id) {
      const docRef = doc(db, 'disease', id);
      await setDoc(docRef, data, { merge: true });
    } else {
      if (data.id) {
        const docRef = doc(db, 'disease', data.id);
        await setDoc(docRef, data);
      } else {
        await addDoc(collection(db, 'disease'), data);
      }
    }
  } catch (error) {
    console.error("Error saving disease:", error);
    throw error;
  }
};

/**
 * Menghapus data penyakit berdasarkan ID.
 * @param {string} diseaseId - ID dokumen yang akan dihapus
 * @throws {Error} Jika gagal menghapus data
 */
export const deleteDisease = async (diseaseId) => {
  try {
    const docRef = doc(db, 'disease', diseaseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting disease:", error);
    throw error;
  }
};