import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBiT-LO2PAdUFDbBS2Ln0borpDGZLwSEiA",
  authDomain: "logintrial-94d7e.firebaseapp.com",
  projectId: "logintrial-94d7e",
  storageBucket: "logintrial-94d7e.appspot.com",
  messagingSenderId: "153536370112",
  appId: "1:153536370112:web:8485d3b2673b8d74cee425",
  measurementId: "G-S6874VMWY8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);