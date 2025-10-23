// src/components/common/ImageUploader.jsx

import React, { useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { Spinner } from './Spinner';

// HAPUS: Import 'predictionService', 'toast', dll. (Logika dipindah ke ScanPage)

// Ganti props dari { navigate } menjadi props baru dari ScanPage
export default function ImageUploader({ onImageUpload, preview, loading }) {
    
    // State untuk styling drag-and-drop
    const [isDragging, setIsDragging] = useState(false);

    // Fungsi ini sekarang hanya meneruskan file ke ScanPage
    const handleFileChange = (selectedFile) => {
        if (selectedFile) {
            // Panggil fungsi 'handleUploadPredict' yang ada di ScanPage
            onImageUpload(selectedFile);
        }
    };

    // Handler untuk input file klik
    const onFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

    // Handler untuk styling drag-and-drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

    // HAPUS: State internal 'file', 'preview', dan 'isLoading'
    // HAPUS: Fungsi 'handleUpload'

    return (
        // (Styling Asli) Container utama
        <div className="w-full max-w-md mx-auto">
            <div
                // (Styling Asli) Area Dropzone
                className={`relative w-full aspect-square rounded-lg border-2 border-dashed ${
                    isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'
                } flex items-center justify-center text-center p-4 transition-all duration-300`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Gunakan prop 'loading' dari ScanPage */}
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded-lg">
                        <Spinner />
                        {/* Pesan loading dipindahkan ke ScanPage overlay */}
                    </div>
                ) : preview ? ( // Gunakan prop 'preview' dari ScanPage
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-lg" 
                    />
                ) : (
                    // (Styling Asli) Tampilan placeholder
                    <div className="text-gray-500">
                        <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="mt-2">
                            Drag & drop atau{' '}
                            <label 
                                htmlFor="file-upload-input" 
                                className="font-semibold text-green-600 cursor-pointer hover:underline"
                            >
                                klik untuk unggah
                            </label>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Gunakan model ahli untuk akurasi terbaik</p>
                    </div>
                )}
                
                {/* Input file tersembunyi */}
                <input 
                    id="file-upload-input" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={onFileInputChange}
                    disabled={loading}
                />
            </div>
            
            {/* HAPUS: Tombol "Mulai Prediksi". 
                (Prediksi sekarang dimulai otomatis oleh ScanPage saat gambar dipilih) */}
        </div>
    );
};