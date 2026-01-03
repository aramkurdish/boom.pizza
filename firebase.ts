
// کۆنفیگی فایەربەیسی بومز پیتزا - Boom's Pizza Firebase Config (Compat Mode)
const firebaseConfig = {
  apiKey: "AIzaSyDPCRiiZqBnQahEjbwNwVVnna8kKh0TPlc",
  authDomain: "boompizza-a5e08.firebaseapp.com",
  projectId: "boompizza-a5e08",
  storageBucket: "boompizza-a5e08.firebasestorage.app",
  messagingSenderId: "151796640376",
  appId: "1:151796640376:web:5294f931ed9f4349685b8d",
  measurementId: "G-KG5BCT8FCE",
  databaseURL: "https://boompizza-a5e08-default-rtdb.firebaseio.com"
};

// @ts-ignore
if (!firebase.apps.length) {
  // @ts-ignore
  firebase.initializeApp(firebaseConfig);
}

// @ts-ignore
export const db = firebase.database();
