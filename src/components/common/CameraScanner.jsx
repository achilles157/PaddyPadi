import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Spinner } from './Spinner';

const IMAGE_SIZE = 256;
const preprocessVideoFrame = (videoElement) => {
    return tf.tidy(() => {
        const tensor = tf.browser.fromPixels(videoElement);
        const resized = tf.image.resizeBilinear(tensor, [IMAGE_SIZE, IMAGE_SIZE]);
        const floatTensor = resized.toFloat();
        const batched = floatTensor.expandDims(0);
        return batched;
    });
};

const CameraScanner = ({ model, onPrediction, onCapture, isProcessing }) => {
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
                const resultTensor = model.execute({ 'keras_tensor_573': tensor }); //
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
        if (!canvasRef.current || isProcessing) return; 
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
        if (onCapture) {
            onCapture(imageDataUrl);
        }
    };

    return (
        <div className="w-full relative rounded-lg overflow-hidden shadow-lg border-4 border-gray-200" style={{ aspectRatio: '1/1' }}>
            <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
            {(!isCameraReady || !model) && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white z-20">
                    <Spinner />
                    <p className="mt-2 text-lg font-semibold">
                        {!model ? 'Memuat model...' : 'Menyalakan kamera...'}
                    </p>
                </div>
            )}
            {isCameraReady && model && !isProcessing && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                    <button
                        onClick={handleCapture}
                        className="w-16 h-16 rounded-full bg-white p-1 border-4 border-white/50 shadow-md transition-transform active:scale-90"
                        aria-label="Ambil Gambar"
                    >
                        <span className="w-full h-full bg-white rounded-full block border-2 border-gray-400 group-hover:border-gray-600"></span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraScanner;