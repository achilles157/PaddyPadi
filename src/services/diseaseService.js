import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const getDiseaseById = async (id) => {
  try {
    console.log("Firestore: Mencari dokumen dengan ID:", id); 
    const docRef = doc(db, 'disease', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Firestore: Dokumen ditemukan!", docSnap.data()); 
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Firestore: Dokumen TIDAK ditemukan untuk ID:", id); 
      return null;
    }
  } catch (error) {
    console.error("Firestore: Error saat getDiseaseById:", error); 
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
     console.error("Firestore: Error saat getDiseases:", error); 
     return [];
   }
};
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