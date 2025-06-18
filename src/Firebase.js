// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCa0UEWjOMIOiYtUM6cx8Dc3CFZAm1_57A",
  authDomain: "financetracker-d3f0f.firebaseapp.com",
  projectId: "financetracker-d3f0f",
  storageBucket: "financetracker-d3f0f.appspot.com",
  messagingSenderId: "371017312487",
  appId: "1:371017312487:web:04a2f988ef30e1af2c9a42"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider()

export { db,provider };
