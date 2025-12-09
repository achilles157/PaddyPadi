import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Spinner } from './Spinner';

const IMAGE_SIZE = 256;

const preprocessVideoFrame = (videoElement) => {
    return tf.tidy(() => {
        const tensor = tf.browser.fromPixels(videoElement);
        const [height, width] = tensor.shape;
        const shortEdge = Math.min(height, width);
        const startY = Math.floor((height - shortEdge) / 2);
        const startX = Math.floor((width - shortEdge) / 2);

        // Crop center square
        const cropped = tensor.slice([startY, startX, 0], [shortEdge, shortEdge, 3]);

        const resized = tf.image.resizeBilinear(cropped, [IMAGE_SIZE, IMAGE_SIZE]);
        const floatTensor = resized.toFloat();
        const batched = floatTensor.expandDims(0);
        return batched;
    });
};

const CameraScanner = ({ model, onPrediction, onCapture, isProcessing, scanStatus = 'searching' }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const animationFrameRef = useRef(null);
    const predictionIntervalRef = useRef(null);
    const isPredictingRef = useRef(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        if (videoRef.current) {
                            videoRef.current.play();
                            setIsCameraReady(true);
                        }
                    };
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
            }
        };
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (!isCameraReady) return;
        const renderLoop = () => {
            if (videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                ctx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
            }
            animationFrameRef.current = requestAnimationFrame(renderLoop);
        };
        renderLoop();
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isCameraReady]);

    useEffect(() => {
        if (!model || !isCameraReady) return;
        const predictLoop = async () => {
            if (isPredictingRef.current || !videoRef.current || videoRef.current.paused) {
                return;
            }
            try {
                isPredictingRef.current = true;
                const tensor = preprocessVideoFrame(videoRef.current);
                const resultTensor = model.execute({ 'keras_tensor_573': tensor });
                const predictionData = await resultTensor.data();

                if (onPrediction) {
                    onPrediction(predictionData);
                }

                tensor.dispose();
                resultTensor.dispose();
            } catch (err) {
                console.error('Prediction error:', err);
            } finally {
                isPredictingRef.current = false;
            }
        };
        const intervalId = setInterval(predictLoop, 500);
        predictionIntervalRef.current = intervalId;
        return () => {
            if (predictionIntervalRef.current) {
                clearInterval(predictionIntervalRef.current);
            }
        };
    }, [model, isCameraReady, onPrediction]);

    const handleCapture = () => {
        if (!videoRef.current || isProcessing) return;

        const video = videoRef.current;
        const { videoWidth, videoHeight } = video;
        const shortEdge = Math.min(videoWidth, videoHeight);
        const startX = (videoWidth - shortEdge) / 2;
        const startY = (videoHeight - shortEdge) / 2;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = shortEdge;
        tempCanvas.height = shortEdge;
        const ctx = tempCanvas.getContext('2d');

        // Draw only the center crop
        ctx.drawImage(video, startX, startY, shortEdge, shortEdge, 0, 0, shortEdge, shortEdge);

        const imageDataUrl = tempCanvas.toDataURL('image/jpeg');
        if (onCapture) {
            onCapture(imageDataUrl);
        }
    };

    return (
        <div className="w-full relative rounded-lg overflow-hidden shadow-lg border-4 border-gray-200" style={{ aspectRatio: '1/1' }}>
            <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
            <canvas ref={canvasRef} className="w-full h-full object-cover" />

            {/* Center Focus Overlay */}
            {isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-3/4 h-3/4 border-4 border-dashed transition-colors duration-300 ${scanStatus === 'found' ? 'border-green-500 bg-green-500/10' : 'border-white/80'
                        } rounded-lg relative`}>
                        {scanStatus === 'searching' && (
                            <p className="absolute -top-8 left-0 right-0 text-center text-white text-sm font-bold bg-black/50 py-1 rounded">
                                Frame the leaf
                            </p>
                        )}
                        {scanStatus === 'found' && (
                            <p className="absolute -top-8 left-0 right-0 text-center text-green-400 text-sm font-bold bg-black/50 py-1 rounded">
                                Ready to analyze
                            </p>
                        )}
                    </div>
                </div>
            )}

            {(!isCameraReady || !model) && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white z-20">
                    <Spinner />
                    <p className="mt-2 text-lg font-semibold">
                        {!model ? 'Memuat model...' : 'Menyalakan kamera...'}
                    </p>
                </div>
            )}

            {isCameraReady && model && !isProcessing && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
                    <button
                        onClick={handleCapture}
                        className={`w-16 h-16 rounded-full bg-white p-1 border-4 shadow-md transition-transform active:scale-90 ${scanStatus === 'found' ? 'border-green-500 shadow-green-500/50' : 'border-white/50'
                            }`}
                        aria-label="Ambil Gambar"
                    >
                        <span className={`w-full h-full rounded-full block border-2 ${scanStatus === 'found' ? 'bg-green-500 border-green-600' : 'bg-white border-gray-400'
                            }`}></span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraScanner;