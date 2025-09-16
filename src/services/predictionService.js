// src/services/predictionService.js

// Alamat backend FastAPI Anda
const API_URL = 'http://127.0.0.1:8000';

/**
 * Menjalankan model saringan TF.js (saat ini dummy).
 * Di masa depan, di sinilah logika inferensi TF.js berada.
 * @param {ImageData} frame - Frame dari kamera.
 * @returns {Promise<boolean>} - True jika terdeteksi sesuatu yang mencurigakan.
 */
export const runScreenerModel = async (frame) => {
    // Logika Dummy: Anggap setiap 5 detik sekali mendeteksi sesuatu.
    const isSuspicious = Math.random() < 0.1; // Peluang 10% per frame
    return isSuspicious;
};

/**
 * Mengirim gambar ke backend untuk dianalisis oleh model ahli.
 * @param {File} imageFile - File gambar yang akan dianalisis.
 * @returns {Promise<object>} - Hasil prediksi dari backend.
 */
export const runExpertModel = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error calling expert model:", error);
        // Kembalikan error agar bisa ditangani di UI
        throw error;
    }
};