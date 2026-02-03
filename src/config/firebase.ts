import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbZRy6WePDB19Z3kF_zmbreXwbiO-h7go",
  authDomain: "boundless-1dff9.firebaseapp.com",
  projectId: "boundless-1dff9",
  storageBucket: "boundless-1dff9.firebasestorage.app",
  messagingSenderId: "938090156677",
  appId: "1:938090156677:web:7bc85329f1526a3e974fec",
  measurementId: "G-8SVKC1DBEC"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
