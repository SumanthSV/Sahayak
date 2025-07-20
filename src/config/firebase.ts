import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// console.log(firebaseConfig.apiKey);

const app = initializeApp(firebaseConfig);
// console.log(app.name)

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Connect to emulators in development (only if not already connected)
if (import.meta.env.DEV && !globalThis.__FIREBASE_EMULATOR_CONNECTED__) {
  try {
    try{
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('Auth emulator connected');
    }catch(error){
      console.log('Auth emulator already connected or not available', error);
    }
    try{
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('Firestore emulator connected');
    }catch(error){
      console.log('Firestore emulator already connected or not available', error);
    }
    
    
    connectFunctionsEmulator(functions, 'localhost', 5001);
    globalThis.__FIREBASE_EMULATOR_CONNECTED__ = true;
  } catch (error) {
    console.log('Emulators already connected or not available'+error);
  }
}

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

export default app;