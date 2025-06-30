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

// Initialize Firebase with error handling
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  db = getFirestore(app);
  auth = getAuth(app);

  // Clear any stale auth state on initialization
  auth.onAuthStateChanged((user) => {
    if (!user) {
      // Clear any stale localStorage data when user is not authenticated
      console.log("🔄 Clearing stale auth data");
    }
  });

  console.log("🔥 Firebase Leirisonda initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);

  // Fallback to local-only mode if Firebase fails
  db = null;
  auth = null;
}

export { db, auth };
export default app;
