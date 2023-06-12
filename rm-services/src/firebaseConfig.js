import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';
import {getAuth} from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseApp = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "fy-project-4521e.firebaseapp.com",
  projectId: "fy-project-4521e",
  storageBucket: "fy-project-4521e.appspot.com",
  messagingSenderId: "823613276124",
  appId: "1:823613276124:web:e08645ee21a2c00e219919",
  measurementId: "G-5YRYL96X1R"
};

const app = initializeApp(firebaseApp);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
