import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuf4o3VaApXDAyt7Co3jxHOmSaVINjd3E",
  authDomain: "rentvelio.firebaseapp.com",
  projectId: "rentvelio",
  storageBucket: "rentvelio.firebasestorage.app",
  messagingSenderId: "769311917072",
  appId: "1:769311917072:web:022b8f56f1d62a3380f695",
  measurementId: "G-E3JNDXG58W",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
