// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Replace storageBucket with the correct one from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBwBf4qR7XC16UM3LESKVcpQTVYahCL3eU",
  authDomain: "seekforcolor.firebaseapp.com",
  projectId: "seekforcolor",
  storageBucket: "seekforcolor.appspot.com", // 🔥 fixed: should end with .appspot.com
  messagingSenderId: "127785329383",
  appId: "1:127785329383:web:212066cad0fffcd9d97842",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export both Auth & Firestore so you can use them anywhere
export const auth = getAuth(app);
export const db = getFirestore(app);
