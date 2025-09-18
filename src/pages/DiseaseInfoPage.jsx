// Di file: src/pages/DiseaseInfoPage.jsx

import React, { useState } from 'react'; // <-- Tambahkan useState
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle } from 'lucide-react';
// import AddDiseaseForm from '../components/common/AddDiseaseForm'; // <-- Akan kita buat nanti

const DiseaseInfoPage = () => {
    const { isAdmin } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false); // <-- State untuk kontrol form

    const handleAddDisease = (diseaseData) => {
        // Logika untuk menyimpan ke firestore akan ada di sini
        console.log("Data penyakit baru:", diseaseData);
        setIsModalOpen(false); // Tutup modal setelah submit
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-charcoal">Info Penyakit</h1>
                {isAdmin && (
                    <button 
                        onClick={() => setIsModalOpen(true)} // <-- Tambahkan onClick di sini
                        className="bg-sage text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-all"
                    >
                        <PlusCircle size={20} /> Tambah
                    </button>
                )}
            </div>
            
            {/* Tampilkan Form/Modal jika isModalOpen bernilai true */}
            {isModalOpen && (
                <div /* Ini akan menjadi komponen form kita nanti */>
                    <h2>Form Tambah Penyakit Baru akan muncul di sini.</h2>
                    <button onClick={() => setIsModalOpen(false)}>Batal</button>
                </div>
                // <AddDiseaseForm onSubmit={handleAddDisease} onCancel={() => setIsModalOpen(false)} />
            )}

            {/* ... (Tampilkan daftar penyakit) ... */}
        </div>
    );
};

export default DiseaseInfoPage;