// services/faceService.js
const {
  RekognitionClient,
  SearchFacesByImageCommand,
  IndexFacesCommand,
  CreateCollectionCommand,
} = require('@aws-sdk/client-rekognition');
const Employee = require('../models/Employee');

const client = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID;

// optional: ensure collection exists
async function ensureCollection() {
  try {
    await client.send(new CreateCollectionCommand({ CollectionId: COLLECTION_ID }));
    console.log('Rekognition collection created or already exists');
  } catch (err) {
    // If collection already exists, Rekognition returns ResourceAlreadyExistsException
    console.log('Collection check:', err.name);
  }
}

// Call at server start
ensureCollection().catch(console.error);

// Convert base64 'data:image/jpeg;base64,...' to Buffer
function base64ToBuffer(base64) {
  const parts = base64.split(',');
  const data = parts.length > 1 ? parts[1] : parts[0];
  return Buffer.from(data, 'base64');
}

// Register a new face and return faceId
// Dummy face service for now (no cloud)
async function registerFace(base64Image, externalEmployeeId) {
  // not used in the new design
  return null;
}

async function recognizeFace(base64Image) {
  // not used in the new design
  return null;
}

module.exports = { registerFace, recognizeFace };

// Detect which employee this is
async function recognizeFace(base64Image) {
  const bytes = base64ToBuffer(base64Image);

  const params = {
    CollectionId: COLLECTION_ID,
    Image: { Bytes: bytes },
    MaxFaces: 1,
    FaceMatchThreshold: 95
  };

  const command = new SearchFacesByImageCommand(params);
  const response = await client.send(command);

  if (!response.FaceMatches || response.FaceMatches.length === 0) {
    return null;
  }

  const faceId = response.FaceMatches[0].Face.FaceId;

  const employee = await Employee.findOne({ faceId });
  return employee;
}

module.exports = { registerFace, recognizeFace };
