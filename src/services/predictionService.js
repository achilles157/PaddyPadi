import * as tf from '@tensorflow/tfjs';

let model;
const MODEL_URL = '/models/model.json';
const IMAGE_SIZE = 256;

export const CLASSES = [
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

/**
 * Memuat model TensorFlow.js untuk prediksi penyakit padi.
 * Model di-cache setelah loading pertama untuk performa optimal.
 * @returns {Promise<tf.GraphModel>} Model yang sudah dimuat
 * @throws {Error} Jika gagal memuat model
 */
export const loadModel = async () => {
  try {
    if (!model) {
      model = await tf.loadGraphModel(MODEL_URL);
      // Warmup model dengan dummy tensor untuk menghindari delay pada prediksi pertama
      tf.tidy(() => {
        const dummyTensor = tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3]).toFloat();
        model.execute({ 'keras_tensor_573': dummyTensor });
      });
    }
    return model;
  } catch (error) {
    console.error('Error loading graph model:', error);
    throw error;
  }
};

/**
 * Preprocessing gambar untuk input model.
 * Mengubah HTMLImageElement menjadi tensor dengan ukuran yang sesuai.
 * @param {HTMLImageElement} imageElement - Elemen gambar yang akan diproses
 * @returns {tf.Tensor4D} Tensor 4D siap untuk prediksi
 */
const preprocessImage = (imageElement) => {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageElement);
    const resized = tf.image.resizeBilinear(tensor, [IMAGE_SIZE, IMAGE_SIZE]);
    const floatTensor = resized.toFloat();
    const batched = floatTensor.expandDims(0);
    return batched;
  });
};

/**
 * Melakukan prediksi penyakit pada gambar daun padi.
 * @param {HTMLImageElement} imageElement - Elemen gambar daun padi
 * @returns {Promise<Object|null>} Hasil prediksi dengan label, confidence, dan model info
 */
export const predict = async (imageElement) => {
  if (!model) {
    console.error('Graph model not loaded.');
    return null;
  }

  const tensor = preprocessImage(imageElement);

  try {
    const resultTensor = model.execute({ 'keras_tensor_573': tensor });
    const outputTensor = Array.isArray(resultTensor) ? resultTensor[0] : resultTensor;
    const predictionData = outputTensor.dataSync();

    tensor.dispose();
    if (Array.isArray(resultTensor)) {
      resultTensor.forEach(t => t.dispose());
    } else {
      resultTensor.dispose();
    }
    const predictionArray = Array.from(predictionData);
    const allPredictions = predictionArray.map((confidence, index) => ({
      label: CLASSES[index],
      confidence: confidence
    }));
    allPredictions.sort((a, b) => b.confidence - a.confidence);
    const topPrediction = allPredictions[0];
    return {
      label: topPrediction.label,
      confidence: topPrediction.confidence,
      model: 'saringan-tfjs (graph-uint8)',
      allPredictions: allPredictions
    };

  } catch (error) {
    console.error("Error during graph model prediction:", error);
    tensor.dispose();
    return null;
  }
};

/**
 * Prediksi menggunakan model expert (fallback ke local TFJS).
 * Digunakan ketika server backend tidak tersedia.
 * @param {File} imageFile - File gambar yang akan diprediksi
 * @returns {Promise<Object>} Hasil prediksi dengan class_name, confidence, dan model info
 */
export const predictExpert = async (imageFile) => {

  // Create an HTMLImageElement from the file to pass to the local predict function
  const imgElement = document.createElement('img');
  const imageUrl = URL.createObjectURL(imageFile);

  return new Promise((resolve, reject) => {
    imgElement.onload = async () => {
      try {
        // Ensure model is loaded
        await loadModel();

        // Use the local predict function
        const result = await predict(imgElement);

        if (result) {
          resolve({
            ...result,
            class_name: result.label, // Map 'label' to 'class_name' for compatibility with UI
            model: 'expert-local-fallback (saringan-tfjs)'
          });
        } else {
          reject(new Error("Local prediction failed to produce a result."));
        }
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(imageUrl); // Clean up
      }
    };
    imgElement.onerror = (e) => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to load image for local prediction."));
    };
    imgElement.src = imageUrl;
  });
};