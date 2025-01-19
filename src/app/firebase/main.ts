// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { getFunctions, httpsCallable } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDltzLIcKHZx9U_qeVWZ_FimDS6PKU3bU8",
  authDomain: "at-poc-35d44.firebaseapp.com",
  projectId: "at-poc-35d44",
  storageBucket: "at-poc-35d44.firebasestorage.app",
  messagingSenderId: "106242359290",
  appId: "1:106242359290:web:78a7f9af1d8033f1beae43",
  measurementId: "G-LJ9ZXHTH6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export {functions, httpsCallable};
