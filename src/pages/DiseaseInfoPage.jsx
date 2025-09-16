import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle } from 'lucide-react';

const DiseaseInfoPage = () => {
    const { isAdmin } = useAuth(); // Ambil status admin

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-charcoal">Info Penyakit</h1>
                {/* Tombol ini hanya muncul jika user adalah admin */}
                {isAdmin && (
                    <button className="bg-sage text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <PlusCircle size={20} /> Tambah
                    </button>
                )}
            </div>
            {/* ... (Tampilkan daftar penyakit) ... */}
        </div>
    );
};

export default DiseaseInfoPage;