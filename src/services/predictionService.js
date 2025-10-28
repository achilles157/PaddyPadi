import * as tf from '@tensorflow/tfjs';

let model;
const MODEL_URL = '/models/model.json'; // Model saringan TF.js Anda
const IMAGE_SIZE = 256; // Sesuai permintaan

// Daftar kelas sesuai modelsaringanplan.txt
const CLASSES = [
  'bacterial_leaf_blight',
  'bacterial_leaf_streak',
  'bacterial_panicle_blight',
  'blast',
  'brown_spot',
  'dead_heart',
  'downy_mildew',
  'hispa',
  'normal',
  'tungro'
];

export const loadModel = async () => {
  try {
    if (!model) {
      console.log('Loading graph model (float16 quantized)...'); 

      // Gunakan loadGraphModel
      model = await tf.loadGraphModel(MODEL_URL);
      console.log('Model loaded successfully.');

      // Warm-up graph model
      tf.tidy(() => {
        const dummyTensor = tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
        model.execute({ 'keras_tensor_25787': dummyTensor }); 
      });
      console.log('Model warmed up.');
    }
  } catch (error) {
    console.error('Error loading graph model:', error); 
    throw error;
  }
};

const preprocessImage = (imageElement) => {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageElement);
    const resized = tf.image.resizeBilinear(tensor, [IMAGE_SIZE, IMAGE_SIZE]);
    const normalized = resized.div(tf.scalar(255.0));
    const batched = normalized.expandDims(0);
    return batched;
  });
};

export const predict = async (imageElement) => {
  if (!model) {
    console.error('Graph model not loaded.');
    return null;
  }

  const tensor = preprocessImage(imageElement);

  try {
    const resultTensor = model.execute({ 'keras_tensor_25787': tensor });
    const outputTensor = Array.isArray(resultTensor) ? resultTensor[0] : resultTensor;
    const predictionData = outputTensor.dataSync();

    // Clean up tensors
    tensor.dispose();
    if (Array.isArray(resultTensor)) {
        resultTensor.forEach(t => t.dispose());
    } else {
        resultTensor.dispose();
    }


    const predictionArray = Array.from(predictionData);

    const maxConfidence = Math.max(...predictionArray);
    const maxIndex = predictionArray.indexOf(maxConfidence);

    const label = CLASSES[maxIndex];
    const confidence = maxConfidence;

    return { label, confidence, model: 'saringan-tfjs (graph-float16)' }; // Update nama model

  } catch (error) {
      console.error("Error during graph model prediction:", error);
      tensor.dispose(); // Pastikan tensor dibersihkan jika ada error
      return null;
  }
};

// Fungsi untuk model ahli di server (FastAPI)
export const predictExpert = async (imageFile) => {
  console.log('Sending image to expert server model (FastAPI):', imageFile.name);

  
  const YOUR_BACKEND_EXPERT_MODEL_URL = 'https://ml-server-production-ef63.up.railway.app/predict'; 

  const formData = new FormData();
  formData.append('image', imageFile); 

  try {
     const response = await fetch(YOUR_BACKEND_EXPERT_MODEL_URL, {
       method: 'POST',
       body: formData,
     });
     if (!response.ok) {
       throw new Error(`Server error: ${response.statusText}`);
     }
     const result = await response.json();
     // Asumsi server mengembalikan { label, confidence }
     return { ...result, model: 'expert-server (keras)' }; 
  } catch (error) {
     console.error('Error during expert prediction:', error);
  }
};