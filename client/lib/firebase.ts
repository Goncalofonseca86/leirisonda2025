import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Configuração Firebase - Leirisonda Production
const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Temporarily disable Firebase to prevent 400 errors
let app = null;
let db = null;
let auth = null;

try {
  // Disable Firebase initialization for now
  console.log("📱 Running in local-only mode to prevent 400 errors");
} catch (error) {
  console.log("📱 Firebase disabled, using local storage only");
}

export { db, auth };
export default app;
