// src/utils/dummyModel.js
const diseases = [
    { name: "Bacterial Leaf Blight", confidence: 97.5 },
    { name: "Brown Spot", confidence: 95.2 },
    { name: "Leaf Smut", confidence: 96.8 },
];

export const dummyPredict = (imageFile) => {
    console.log("Memulai prediksi dummy untuk:", imageFile.name);

    return new Promise(resolve => {
        // Simulasi waktu proses model (2-3 detik)
        setTimeout(() => {
            // Pilih penyakit secara acak dari daftar
            const result = diseases[Math.floor(Math.random() * diseases.length)];
            console.log("Prediksi dummy selesai:", result);
            resolve(result);
        }, 2500);
    });
};