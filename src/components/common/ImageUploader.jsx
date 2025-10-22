import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, RotateCw } from 'lucide-react';
import { Spinner } from './Spinner';
import { predictionService } from '../../services/predictionService'; // Impor service langsung
import toast from 'react-hot-toast';

// Komponen ini sekarang menerima 'navigate' sebagai prop
export const ImageUploader = ({ navigate }) => {
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            try {
                // Panggil service prediksi langsung dari sini
                const screenerResult = await predictionService.runScreenerModel(imageRef.current);
                // Langsung navigasi dari sini dengan membawa hasilnya
                navigate('/result', { state: { imageSrc: preview, predictionResult: screenerResult } });
            } catch (error) {
                toast.error("Gagal melakukan prediksi. Coba lagi.");
                setIsLoading(false); // Sembunyikan spinner jika terjadi error
            }
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center gap-6 p-4 h-96">
                <Spinner />
                <p className="mt-4 text-lg text-sage">Menganalisis gambar...</p>
                <img src={preview} alt="Analyzing" className="w-32 h-32 object-contain rounded-lg mt-4" />
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