// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf1mHjX1Q_FEfGrGhRPoLiYrrHy9Eo-_M",
  authDomain: "rd-bet.firebaseapp.com",
  databaseURL: "https://rd-bet-default-rtdb.firebaseio.com",
  projectId: "rd-bet",
  storageBucket: "rd-bet.firebasestorage.app",
  messagingSenderId: "310935959510",
  appId: "1:310935959510:web:cea3f2b6a899a3851bd677",
  measurementId: "G-L7TCG3ET2Z"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
