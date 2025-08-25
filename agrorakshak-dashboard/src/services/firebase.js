// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// Note: We're not using getAnalytics for this project

// Your web app's Firebase configuration (your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBspxjXObANcvC0FIlloqF8m304rr3COV4",
  authDomain: "agrorakshak-97ae7.firebaseapp.com",
  databaseURL: "https://agrorakshak-97ae7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agrorakshak-97ae7",
  storageBucket: "agrorakshak-97ae7.firebasestorage.app",
  messagingSenderId: "504191238061",
  appId: "1:504191238061:web:74988273aad43e379e6b24",
  measurementId: "G-Z7F4YC894K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const database = getDatabase(app);

// Export the app instance (optional)
export default app;
