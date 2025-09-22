import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, RotateCw } from 'lucide-react';
import { Spinner } from './Spinner'; // Impor Spinner

// Terima prop 'onImageSelect' dari ScanPage
export const ImageUploader = ({ onImageSelect }) => {
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State loading internal
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDetectClick = async () => {
        if (fileInputRef.current.files[0] && imageRef.current) {
            setIsLoading(true); // Tampilkan loading
            // Panggil fungsi prediksi dari parent (ScanPage)
            await onImageSelect(preview, imageRef.current);
            // Tidak perlu setIsLoading(false) karena akan ada navigasi halaman
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    // Tampilan saat sedang loading/memprediksi
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-4 h-80">
                <Spinner />
                <p className="mt-4 text-lg text-gray-600">Menganalisis gambar...</p>
                {preview && <img src={preview} alt="Analyzing" className="w-24 h-24 object-contain rounded-lg mt-4" />}
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 p-4">
            <div
                className="w-full h-64 border-2 border-dashed border-sage rounded-xl flex items-center justify-center bg-green-50 cursor-pointer"
                onClick={triggerFileSelect}
            >
                {preview ? (
                    <img ref={imageRef} src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                ) : (
                    <div className="text-center text-sage">
                        <UploadCloud className="mx-auto h-12 w-12" />
                        <p className="mt-2 font-semibold">Klik untuk memilih gambar</p>
                        <p className="text-xs">PNG, JPG, atau WEBP</p>
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            {preview && (
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={triggerFileSelect}
                        className="w-full bg-gray-200 text-charcoal font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <RotateCw className="h-5 w-5" />
                        Ganti Gambar
                    </button>
                    <button
                        onClick={handleDetectClick}
                        className="w-full bg-accent text-charcoal font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <ImageIcon className="h-5 w-5" />
                        Deteksi Penyakit
                    </button>
                </div>
            )}
        </div>
    );
};