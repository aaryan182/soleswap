// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "soleswap-b5e55.firebaseapp.com",
  projectId: "soleswap-b5e55",
  storageBucket: "soleswap-b5e55.firebasestorage.app",
  messagingSenderId: "473898388533",
  appId: "1:473898388533:web:36f455125d19df995db57c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);