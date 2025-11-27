import React, { useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { Spinner } from './Spinner';

export default function ImageUploader({ onImageUpload, preview, loading }) {

    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (selectedFile) => {
        if (selectedFile) {
            onImageUpload(selectedFile);
        }
    };

    const onFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

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
    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className={`relative w-full aspect-square rounded-lg border-2 border-dashed ${
                    isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'
                } flex items-center justify-center text-center p-4 transition-all duration-300`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded-lg">
                        <Spinner />
                    </div>
                ) : preview ? ( 
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-lg" 
                    />
                ) : (
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
                <input 
                    id="file-upload-input" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={onFileInputChange}
                    disabled={loading}
                />
            </div>
        </div>
    );
};