
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// کۆنفیگی فایەربەیسی بومز پیتزا - Boom's Pizza Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDPCRiiZqBnQahEjbwNwVVnna8kKh0TPlc",
  authDomain: "boompizza-a5e08.firebaseapp.com",
  projectId: "boompizza-a5e08",
  storageBucket: "boompizza-a5e08.firebasestorage.app",
  messagingSenderId: "151796640376",
  appId: "1:151796640376:web:5294f931ed9f4349685b8d",
  measurementId: "G-KG5BCT8FCE",
  // Standard Realtime Database URL for this project ID
  databaseURL: "https://boompizza-a5e08-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
