import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';
import {getAuth} from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseApp = {
  apiKey: "AIzaSyBTZA6CuFb5inLFUrVghnTbySbGGFk2NSY",
  authDomain: "fir-frontend-7f5cf.firebaseapp.com",
  projectId: "fir-frontend-7f5cf",
  storageBucket: "fir-frontend-7f5cf.appspot.com",
  messagingSenderId: "392304362082",
  appId: "1:392304362082:web:8c991f80a6a55b3b4a073b",
  measurementId: "G-KZYF88F2GY"
};

const app = initializeApp(firebaseApp);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;