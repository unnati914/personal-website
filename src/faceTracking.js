const WASM='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL='https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// MediaPipe face mesh indices tracing the lips
export const LIPS_OUTER=[61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146];
export const LIPS_INNER=[78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];
export const CHEEKS=[50,280,205,425];
export const LIDS=[
 {line:[33,246,161,160,159,158,157,173,133],outer:33,inner:133},
 {line:[263,466,388,387,386,385,384,398,362],outer:263,inner:362}
];
export const FACE_EDGES=[234,454];

const cache={};
// Loaded lazily (only when a visitor opens the camera or uploads a photo) and cached per mode.
export function getLandmarker(mode){
 if(!cache[mode])cache[mode]=(async()=>{
  const {FilesetResolver,FaceLandmarker}=await import('@mediapipe/tasks-vision');
  const files=await FilesetResolver.forVisionTasks(WASM);
  const opts=delegate=>({baseOptions:{modelAssetPath:MODEL,delegate},runningMode:mode,numFaces:1});
  try{return await FaceLandmarker.createFromOptions(files,opts('GPU'));}
  catch{return await FaceLandmarker.createFromOptions(files,opts('CPU'));}
 })().catch(e=>{delete cache[mode]; throw e;});
 return cache[mode];
}
