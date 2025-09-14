// Import Firebase SDKs (CDN lo use chestunnav kabatti direct link nundi import cheyyi)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js"; // ✅ Added

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnvRbwrZoC4v5bad43DtZc7Axk68KiDnM",
  authDomain: "eventhub-8be5b.firebaseapp.com",
  projectId: "eventhub-8be5b",
  storageBucket: "eventhub-8be5b.appspot.com",
  messagingSenderId: "927916881481",
  appId: "1:927916881481:web:c5cab765d06fa9a9bff198"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Added