// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa0UEWjOMIOiYtUM6cx8Dc3CFZAm1_57A",
  authDomain: "financetracker-d3f0f.firebaseapp.com",
  projectId: "financetracker-d3f0f",
  storageBucket: "financetracker-d3f0f.firebasestorage.app",
  messagingSenderId: "371017312487",
  appId: "1:371017312487:web:04f2724fa8f525462c9a42"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
