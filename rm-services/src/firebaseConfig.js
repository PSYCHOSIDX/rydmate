import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'

const firebase = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "carpool-9d220.firebaseapp.com",
  projectId: "carpool-9d220",
  storageBucket: "carpool-9d220.appspot.com",
  messagingSenderId: "76397578852",
  appId: "1:76397578852:web:88a48bdf3ed165d1eb2d71"
};

const app = initializeApp(firebase);
export const db = getFirestore(app);