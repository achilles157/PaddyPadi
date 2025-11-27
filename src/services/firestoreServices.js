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

export const addReport = async (reportData) => {
  try {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      ...reportData,
      createdAt: serverTimestamp() 
    });
    console.log("Document written with ID: ", docRef.id);
    return { id: docRef.id, ...reportData, createdAt: new Date() }; 
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

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
    console.error("Error getting documents: ", e);
    throw e;
  }
};

export const deleteReport = async (reportId) => {
  try {
    await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error removing document: ", e);
    throw e;
  }
};