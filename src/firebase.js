import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDcEn8pOP0CUBbDVHKtNgBvIzouU1DCh9A",
    authDomain: "retrouver-a80ac.firebaseapp.com",
    projectId: "retrouver-a80ac",
    storageBucket: "retrouver-a80ac.firebasestorage.app",
    messagingSenderId: "744276476562",
    appId: "1:744276476562:web:88e19bcd53ae11c4141c4b",
    measurementId: "G-RDG3ZQY2DY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
