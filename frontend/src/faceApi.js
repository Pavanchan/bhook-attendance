// frontend/src/faceApi.js
import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadFaceApiModels() {
  if (modelsLoaded) return;

  const MODEL_URL = '/models';

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);

  modelsLoaded = true;
}

export async function getFaceDescriptorFromImageElement(imageEl) {
  const detection = await faceapi
    .detectSingleFace(imageEl)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error('No face detected, make sure your face is clearly visible.');
  }

  return Array.from(detection.descriptor);
}

export function computeDistance(desc1, desc2) {
  if (!desc1 || !desc2 || desc1.length !== desc2.length) return Infinity;

  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    const diff = desc1[i] - desc2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}
