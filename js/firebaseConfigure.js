import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}

from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    onSnapshot

} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyB3tSqHj_Uo1ymoIb-EWG-FM8y9S_J-ePw",
    authDomain: "recipe-sharing-60942.firebaseapp.com",
    projectId: "recipe-sharing-60942",
    storageBucket: "recipe-sharing-60942.firebasestorage.app",
    messagingSenderId: "767914769875",
    appId: "1:767914769875:web:70393986b91253034c4326",
    measurementId: "G-PEDKYYWYQ3"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

export {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs,
    onSnapshot
};