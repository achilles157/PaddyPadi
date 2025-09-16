// src/services/reportService.js
import { db, storage, auth } from './firebase';
import { query, where, getDocs, orderBy } from 'firebase/firestore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mengunggah gambar ke Firebase Storage dan menyimpan data laporan ke Firestore.
 * @param {File} imageFile - File gambar yang akan diunggah.
 * @param {object} predictionData - Data hasil prediksi dari model.
 * @param {object} location - Data geolokasi { latitude, longitude }.
 */
export const saveReport = async (imageFile, predictionData, location) => {
    if (!auth.currentUser) throw new Error("Pengguna belum login.");

    // 1. Buat path unik untuk gambar di Storage
    const imageRef = ref(storage, `reports/${auth.currentUser.uid}/${uuidv4()}`);

    // 2. Unggah gambar
    const uploadResult = await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    // 3. Siapkan data untuk disimpan di Firestore
    const reportData = {
        userId: auth.currentUser.uid,
        imageUrl: imageUrl,
        diseaseName: predictionData.class_name || predictionData.name,
        confidence: predictionData.confidence,
        location: location || null,
        timestamp: serverTimestamp(), // Gunakan timestamp server
    };

    // 4. Simpan dokumen ke koleksi 'reports'
    const docRef = await addDoc(collection(db, "reports"), reportData);
    
    console.log("Laporan berhasil disimpan dengan ID:", docRef.id);
    return { id: docRef.id, ...reportData };
};

export const getReports = async () => {
    if (!auth.currentUser) throw new Error("Pengguna belum login.");
    
    const reportsCol = collection(db, 'reports');
    // Query untuk mengambil laporan milik user, diurutkan dari yang terbaru
    const q = query(
        reportsCol, 
        where("userId", "==", auth.currentUser.uid), 
        orderBy("timestamp", "desc")
    );

    const reportSnapshot = await getDocs(q);
    const reportList = reportSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return reportList;
};