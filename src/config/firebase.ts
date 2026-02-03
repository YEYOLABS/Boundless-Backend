import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDprLLqpEBeC58x-TL8ulI785-7CqfMXfk',
    authDomain: 'myguy-a78d0.firebaseapp.com',
    projectId: 'myguy-a78d0',
    storageBucket: 'myguy-a78d0.appspot.com',
    messagingSenderId: '743810339840',
    appId: '1:743810339840:web:6062e3048a92adb71074e5'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
