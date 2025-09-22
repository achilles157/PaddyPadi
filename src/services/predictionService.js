import * as tf from '@tensorflow/tfjs';

const MODEL_URL = '/paddy_tfjs_model_final/model.json';
const CLASS_NAMES = ['bacterial_leaf_blight', 'bacterial_leaf_streak', 'bacterial_panicle_blight', 'blast', 'brown_spot', 'dead_heart', 'downy_mildew', 'hispa', 'normal', 'tungro'];

let model = null;

async function loadScreenerModel() {
  if (model) return model;
  try {
    console.log('Memuat model saringan...');
    model = await tf.loadGraphModel(MODEL_URL);
    console.log('Model saringan berhasil dimuat.');
    tf.tidy(() => {
      const dummyInput = tf.zeros([1, 160, 160, 3]);
      model.predict(dummyInput);
    });
    return model;
  } catch (error) {
    console.error('Gagal memuat model saringan:', error);
    throw new Error('Tidak dapat memuat model.');
  }
}

async function runScreenerModel(imageElement) {
  if (!model) {
    await loadScreenerModel();
  }

  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([160, 160]).toFloat();
    const preprocessedTensor = tensor.div(127.5).sub(1);
    const batchedTensor = preprocessedTensor.expandDims(0);
    const prediction = model.predict(batchedTensor);
    const predictionData = prediction.dataSync();
    const highestProbabilityIndex = prediction.as1D().argMax().dataSync()[0];
    
    return {
      prediction: CLASS_NAMES[highestProbabilityIndex],
      confidence: Math.round(predictionData[highestProbabilityIndex] * 100),
    };
  });
}

// Dummy function untuk model ahli
async function runExpertModel(imageSrc) {
  console.log('Memanggil dummy model ahli...');
  // Simulasi penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 2000)); 
  
  // Logika dummy
  const dummyPredictions = ["Blast", "Brown Spot", "Hispa"];
  const randomPrediction = dummyPredictions[Math.floor(Math.random() * dummyPredictions.length)];

  return {
    prediction: `${randomPrediction} (Analisis Ahli)`,
    confidence: Math.floor(Math.random() * (99 - 90 + 1)) + 90, // Random confidence 90-99
    description: `Ini adalah hasil analisis mendalam dari server yang mengonfirmasi adanya penyakit ${randomPrediction}.`,
    treatment: `Rekomendasi penanganan untuk ${randomPrediction} akan ditampilkan di sini.`
  };
}

export const predictionService = {
  loadScreenerModel,
  runScreenerModel,
  runExpertModel,
};