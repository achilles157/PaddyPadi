import React, { useState, useEffect } from 'react';

// Props:
// - initialData: Objek penyakit yang ada (untuk mode edit), null/undefined untuk mode add
// - onSubmit: Fungsi yang dipanggil saat form disubmit (menerima ID dan data)
// - onCancel: Fungsi yang dipanggil saat tombol Batal diklik

const AddEditDiseaseForm = ({ initialData, onSubmit, onCancel }) => {
    // State untuk menyimpan nilai input form
    const [diseaseId, setDiseaseId] = useState('');
    const [nama, setNama] = useState('');
    const [penjelasan, setPenjelasan] = useState('');
    const [penyebab, setPenyebab] = useState('');
    const [penanggulangan, setPenanggulangan] = useState(''); 

    const isEditMode = Boolean(initialData);

    // Isi form dengan initialData jika dalam mode edit
    useEffect(() => {
        if (isEditMode && initialData) {
            setDiseaseId(initialData.id); // ID tidak bisa diedit
            setNama(initialData.nama || '');
            setPenjelasan(initialData.penjelasan || '');
            setPenyebab(initialData.penyebab || '');
            setPenanggulangan(Array.isArray(initialData.penanggulangan_cepat)
                ? initialData.penanggulangan_cepat.join('\n')
                : '');
        } else {
            // Reset form jika mode add
            setDiseaseId('');
            setNama('');
            setPenjelasan('');
            setPenyebab('');
            setPenanggulangan('');
        }
    }, [initialData, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!diseaseId.trim() && !isEditMode) {
             alert("ID Penyakit (misal: bacterial_leaf_blight) wajib diisi!");
             return;
        }
         if (!nama.trim()) {
             alert("Nama Penyakit wajib diisi!");
             return;
         }
        const penanggulanganArray = penanggulangan.split('\n').map(s => s.trim()).filter(s => s);

        const formData = {
            nama: nama.trim(),
            penjelasan: penjelasan.trim(),
            penyebab: penyebab.trim(),
            penanggulangan_cepat: penanggulanganArray,
        };
        onSubmit(diseaseId.trim().toLowerCase(), formData);
    };

    return (
        // Styling Modal sederhana 
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-transparent">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                    {isEditMode ? 'Edit Info Penyakit' : 'Tambah Penyakit Baru'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="diseaseId" className="block text-sm font-medium text-gray-700">
                            ID Penyakit (contoh: bacterial_leaf_blight)
                        </label>
                        <input
                            type="text"
                            id="diseaseId"
                            value={diseaseId}
                            onChange={(e) => setDiseaseId(e.target.value.replace(/\s+/g, '_'))} // Ganti spasi jadi underscore
                            required={!isEditMode} // Wajib diisi hanya saat menambah
                            disabled={isEditMode} // Tidak bisa diedit saat mode edit
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sage focus:border-sage sm:text-sm ${isEditMode ? 'bg-gray-100' : ''}`}
                        />
                         {!isEditMode && <p className="text-xs text-gray-500 mt-1">Gunakan huruf kecil dan underscore (_). ID ini tidak bisa diubah nanti.</p>}
                    </div>
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                            Nama Penyakit
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sage focus:border-sage sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="penjelasan" className="block text-sm font-medium text-gray-700">
                            Deskripsi / Gejala
                        </label>
                         <textarea
                            id="penjelasan"
                            rows="4"
                            value={penjelasan}
                            onChange={(e) => setPenjelasan(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sage focus:border-sage sm:text-sm"
                        ></textarea>
                    </div>
                     <div>
                        <label htmlFor="penyebab" className="block text-sm font-medium text-gray-700">
                            Penyebab
                        </label>
                         <textarea
                            id="penyebab"
                            rows="3"
                            value={penyebab}
                            onChange={(e) => setPenyebab(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sage focus:border-sage sm:text-sm"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="penanggulangan" className="block text-sm font-medium text-gray-700">
                            Penanganan / Pencegahan (pisahkan tiap langkah dengan baris baru)
                        </label>
                         <textarea
                            id="penanggulangan"
                            rows="5"
                            value={penanggulangan}
                            onChange={(e) => setPenanggulangan(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sage focus:border-sage sm:text-sm"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-sage text-black rounded-md hover:bg-green-800"
                        >
                            {isEditMode ? 'Simpan Perubahan' : 'Tambah Penyakit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditDiseaseForm;