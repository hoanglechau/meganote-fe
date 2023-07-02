// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

/**
 * @description This file is used to initialize Firebase and export the storage object for uploading files to Firebase Storage
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "meganote-718ca.firebaseapp.com",
  projectId: "meganote-718ca",
  storageBucket: "meganote-718ca.appspot.com",
  messagingSenderId: "307007249710",
  appId: "1:307007249710:web:521672f1037d1bec05aebf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
