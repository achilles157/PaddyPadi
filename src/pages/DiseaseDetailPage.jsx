// src/pages/DiseaseDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import { getDiseaseById } from '../services/diseaseService';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '../components/common/Spinner'; // <-- Ubah import Spinner

const DiseaseDetailPage = () => {
    // Gunakan useParams untuk mendapatkan diseaseId dari URL
    const { diseaseId } = useParams(); // <-- Ganti 'id' menjadi 'diseaseId' agar sesuai dengan route di App.jsx
    const [disease, setDisease] = useState(null);
    const [loading, setLoading] = useState(true); // <-- Tambahkan state loading
    const [error, setError] = useState(null); // <-- Tambahkan state error
    const navigate = useNavigate(); // <-- Hook untuk navigasi kembali

    useEffect(() => {
        const fetchDisease = async () => {
            if (!diseaseId) { // Tambahkan pengecekan jika diseaseId tidak ada
                setError("ID Penyakit tidak ditemukan.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                // Gunakan diseaseId untuk fetch data
                console.log("DiseaseDetailPage: Mencari dokumen dengan ID:", diseaseId); // Log ID
                const data = await getDiseaseById(diseaseId);
                if (data) {
                    console.log("DiseaseDetailPage: Data ditemukan:", data); // Log data
                    setDisease(data);
                } else {
                    console.log("DiseaseDetailPage: Dokumen TIDAK ditemukan untuk ID:", diseaseId);
                    setError(`Detail untuk penyakit dengan ID "${diseaseId}" tidak ditemukan.`);
                }
            } catch (err) {
                console.error("Error fetching disease detail:", err);
                setError("Gagal memuat detail penyakit.");
            } finally {
                setLoading(false);
            }
        };
        fetchDisease();
    }, [diseaseId]); // <-- Dependensi useEffect adalah diseaseId

    // Tampilkan loading spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
                <p className="ml-2">Memuat detail penyakit...</p>
            </div>
        );
    }

    // Tampilkan pesan error jika ada
    if (error) {
        return (
            <div className="p-4 text-center">
                 <button
                    onClick={() => navigate(-1)} // Tombol kembali ke halaman sebelumnya
                    className="flex items-center gap-2 text-sage font-semibold mb-4 hover:underline"
                >
                    <ArrowLeft size={20} /> Kembali
                </button>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

     // Tampilkan pesan jika data tidak ada setelah loading selesai
     if (!disease) {
         return (
             <div className="p-4 text-center">
                 <button
                    onClick={() => navigate(-1)} // Tombol kembali
                    className="flex items-center gap-2 text-sage font-semibold mb-4 hover:underline"
                >
                    <ArrowLeft size={20} /> Kembali
                </button>
                 <p>Data penyakit tidak tersedia.</p>
             </div>
        );
     }

    // Tampilkan detail penyakit jika data sudah ada
    return (
        <div className="p-4 pb-20"> {/* Tambahkan padding bottom */}
            {/* Tombol kembali */}
             <button
                onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
                className="flex items-center gap-2 text-sage font-semibold mb-4 hover:underline"
            >
                <ArrowLeft size={20} /> Kembali
            </button>

            {/* Gunakan field 'nama' */}
            <h1 className="text-3xl font-bold text-charcoal mb-6">{disease.nama}</h1>

            {/* Bagian Penjelasan (Gejala) */}
            {disease.penjelasan && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-sage mb-2">Deskripsi / Gejala</h2>
                    <p className="text-charcoal whitespace-pre-line">{disease.penjelasan}</p>
                </div>
            )}

             {/* Bagian Penyebab */}
             {disease.penyebab && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-sage mb-2">Penyebab</h2>
                    <p className="text-charcoal whitespace-pre-line">{disease.penyebab}</p>
                </div>
             )}


            {/* Bagian Penanggulangan (Treatment/Pencegahan) */}
            {disease.penanggulangan_cepat && Array.isArray(disease.penanggulangan_cepat) && disease.penanggulangan_cepat.length > 0 && (
                 <div className="mb-6">
                    <h2 className="text-xl font-bold text-sage mb-2">Penanganan / Pencegahan</h2>
                     <ul className="list-disc list-inside text-charcoal space-y-1">
                         {disease.penanggulangan_cepat.map((step, index) => (
                            <li key={index}>{step}</li>
                         ))}
                     </ul>
                 </div>
            )}

            {/* Anda bisa tambahkan field lain jika ada di Firestore */}

        </div>
    );
};

export default DiseaseDetailPage;