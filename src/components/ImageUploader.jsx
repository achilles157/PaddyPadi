import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({ onImageUpload }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDetectClick = () => {
        if (fileInputRef.current.files[0]) {
            onImageUpload(fileInputRef.current.files[0]);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 p-4">
            <div
                className="w-full h-64 border-2 border-dashed border-sage rounded-xl flex items-center justify-center bg-green-50 cursor-pointer"
                onClick={() => fileInputRef.current.click()}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
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
            <button
                onClick={handleDetectClick}
                disabled={!preview}
                className="w-full bg-accent text-charcoal font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-yellow-500 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <ImageIcon className="h-5 w-5" />
                Deteksi Penyakit
            </button>
        </div>
    );
};