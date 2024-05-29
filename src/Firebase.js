// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZaAoIHQb7-g5UrEhJHNCWGiRy1CcFJ6E",
    authDomain: "termine-91c03.firebaseapp.com",
    projectId: "termine-91c03",
    storageBucket: "termine-91c03.appspot.com",
    messagingSenderId: "334341342465",
    appId: "1:334341342465:web:c4b9450a9a84091b478700"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };