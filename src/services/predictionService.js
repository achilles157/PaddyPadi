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

export const loadModel = async () => {
  try {
    if (!model) {
      console.log('Loading graph model (uint8)...'); 

      model = await tf.loadGraphModel(MODEL_URL);
      console.log('Model loaded successfully.');
      console.log('Model loaded');
      console.log('model.inputNodes =', model.inputNodes);
      console.log('model.outputNodes =', model.outputNodes);
      console.log('model.inputs =', model.inputs);        
      console.log('model.outputs =', model.outputs);
      console.log('model.signature =', model.signature);  
      tf.tidy(() => {
        const dummyTensor = tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3]).toFloat(); 
        model.execute({ 'keras_tensor_573': dummyTensor }); 
      });
      console.log('Model warmed up.');
    }
    return model; 
  } catch (error) {
    console.error('Error loading graph model:', error); 
    throw error;
  }
};

const preprocessImage = (imageElement) => {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageElement);
    const resized = tf.image.resizeBilinear(tensor, [IMAGE_SIZE, IMAGE_SIZE]);
    const floatTensor = resized.toFloat(); 
    const batched = floatTensor.expandDims(0);
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
     return { ...result, model: 'expert-server (keras)' }; 
  } catch (error) {
     console.error('Error during expert prediction:', error);
     throw error;
  }
};