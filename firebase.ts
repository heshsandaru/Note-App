// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVsa8iz1gnBTHcb9oTbgHwowMlb-CNVxs",
  authDomain: "my-note-app-344ed.firebaseapp.com",
  projectId: "my-note-app-344ed",
  storageBucket: "my-note-app-344ed.firebasestorage.app",
  messagingSenderId: "1058387081780",
  appId: "1:1058387081780:web:41e57de74335205f046861"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)