// src/pages/DiseaseInfoPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // <-- Tambahkan useCallback
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, Edit, Trash2 } from 'lucide-react'; // <-- Tambahkan ikon Edit, Trash2
import { getDiseases, saveDisease, deleteDisease } from '../services/diseaseService'; // <-- Impor fungsi save/delete
import { Spinner } from '../components/common/Spinner';
import AddEditDiseaseForm from '../components/common/AddEditDiseaseForm'; // <-- Impor komponen form
import toast from 'react-hot-toast'; // <-- Impor toast untuk notifikasi

const DiseaseInfoPage = () => {
    const { isAdmin } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State baru untuk menyimpan data penyakit yang sedang diedit
    const [editingDisease, setEditingDisease] = useState(null);

    // Bungkus fetchDiseases dengan useCallback agar tidak dibuat ulang terus menerus
    const fetchDiseases = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDiseases();
            console.log("DiseaseInfoPage: Data diterima:", data);
            setDiseases(data);
        } catch (err) {
            console.error("Error fetching diseases:", err);
            setError("Gagal memuat data penyakit.");
            toast.error("Gagal memuat data penyakit.");
        } finally {
            setLoading(false);
        }
    }, []); // Dependensi kosong

    // Panggil fetchDiseases saat komponen dimuat
    useEffect(() => {
        fetchDiseases();
    }, [fetchDiseases]); // <-- Tambahkan fetchDiseases ke dependensi

    // Fungsi untuk membuka modal tambah
    const handleOpenAddModal = () => {
        setEditingDisease(null); // Pastikan tidak ada data edit
        setIsModalOpen(true);
    };

    // Fungsi untuk membuka modal edit
    const handleOpenEditModal = (disease) => {
        setEditingDisease(disease); // Set data penyakit yang akan diedit
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDisease(null); // Reset data edit saat modal ditutup
    };

    // Fungsi yang dipanggil saat form disubmit (baik add maupun edit)
    const handleFormSubmit = async (diseaseId, diseaseData) => {
        const isEditing = Boolean(editingDisease);
        const actionVerb = isEditing ? 'mengupdate' : 'menambah';
        const loadingToastId = toast.loading(`Sedang ${actionVerb} data...`);
        try {
            await saveDisease(diseaseId, diseaseData);
            toast.success(`Data penyakit berhasil ${isEditing ? 'diupdate' : 'ditambahkan'}!`, { id: loadingToastId });
            handleCloseModal(); // Tutup modal
            fetchDiseases(); // Refresh daftar penyakit
        } catch (err) {
            console.error(`Error saving disease (${actionVerb}):`, err);
            toast.error(`Gagal ${actionVerb} data penyakit.`, { id: loadingToastId });
        }
    };

     // Fungsi untuk menghapus penyakit (dengan konfirmasi)
    const handleDeleteDisease = async (diseaseId, diseaseName) => {
         if (window.confirm(`Apakah Anda yakin ingin menghapus "${diseaseName || diseaseId}"?`)) {
             const loadingToastId = toast.loading('Menghapus data...');
             try {
                await deleteDisease(diseaseId);
                toast.success('Data penyakit berhasil dihapus.', { id: loadingToastId });
                fetchDiseases(); // Refresh daftar
             } catch (err) {
                 console.error("Error deleting disease:", err);
                 toast.error('Gagal menghapus data penyakit.', { id: loadingToastId });
             }
         }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-charcoal">Info Penyakit</h1>
                {isAdmin && (
                    <button
                        onClick={handleOpenAddModal} // <-- Panggil fungsi buka modal
                        className="bg-sage text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-all"
                    >
                        <PlusCircle size={20} /> Tambah
                    </button>
                )}
            </div>

            {/* Render Modal Form */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40" // z-index lebih rendah dari form
                    onClick={handleCloseModal} // Menutup modal jika backdrop diklik
                ></div>
            )}

            {/* Render Modal Form (akan muncul di atas backdrop karena z-index lebih tinggi) */}
            {isModalOpen && (
                <AddEditDiseaseForm
                    initialData={editingDisease}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                />
            )}

            {/* Tampilkan daftar penyakit */}
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Spinner />
                        <p className="ml-2">Memuat data penyakit...</p>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : diseases.length > 0 ? (
                    <ul className="space-y-4">
                        {diseases.map((disease) => (
                            <li key={disease.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:shadow-md transition-shadow">
                                <Link
                                    to={`/disease/${disease.id}`}
                                    className="flex-grow text-lg font-semibold text-charcoal hover:text-sage mr-4"
                                >
                                    {disease.nama || disease.id.replace(/_/g, ' ')}
                                </Link>
                                {/* Tombol Admin (Edit & Hapus) */}
                                {isAdmin && (
                                    <div className="flex-shrink-0 flex gap-2">
                                        <button
                                            onClick={() => handleOpenEditModal(disease)} // Panggil fungsi edit
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                         <button
                                            onClick={() => handleDeleteDisease(disease.id, disease.nama)} // Panggil fungsi hapus
                                            className="text-red-600 hover:text-red-800"
                                            title="Hapus"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">Belum ada data penyakit yang tersedia.</p>
                )}
            </div>
        </div>
    );
};

export default DiseaseInfoPage;